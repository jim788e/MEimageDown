require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');

const NFT_CONTRACT = process.env.NFT_CONTRACT;
const MAGIC_EDEN_API_KEY = process.env.MAGIC_EDEN_API_KEY;
const EVM_CHAIN = process.env.EVM_CHAIN || 'ethereum';
const TOTAL_TOKENS = 3332; // Total number of tokens to fetch
const BATCH_SIZE = 20;

// Validate EVM chain
const VALID_CHAINS = ['ethereum', 'arbitrum', 'base', 'berachain', 'bsc', 'monad-testnet', 'polygon', 'sei'];
if (!VALID_CHAINS.includes(EVM_CHAIN)) {
    console.error(`Invalid EVM chain: ${EVM_CHAIN}`);
    console.error(`Valid options are: ${VALID_CHAINS.join(', ')}`);
    process.exit(1);
}

async function fetchTokens(continuation = null) {
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${MAGIC_EDEN_API_KEY}`
        }
    };

    let url = `https://api-mainnet.magiceden.dev/v3/rtp/${EVM_CHAIN}/tokens/v6?collection=${NFT_CONTRACT}&limit=${BATCH_SIZE}&sortBy=tokenId&sortDirection=asc`;
    if (continuation) {
        url += `&continuation=${continuation}`;
    }

    try {
        console.log(`Making request to: ${url}`);
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Response status: ${response.status}`);
        console.log(`Number of tokens received: ${data.tokens?.length || 0}`);
        
        if (data.tokens && data.tokens.length > 0) {
            const firstTokenId = data.tokens[0].token.tokenId;
            const lastTokenId = data.tokens[data.tokens.length - 1].token.tokenId;
            console.log(`Token ID range in this batch: ${firstTokenId} to ${lastTokenId}`);
        }
        
        return {
            tokens: data.tokens || [],
            continuation: data.continuation
        };
    } catch (error) {
        console.error('Error fetching tokens:', error);
        return { tokens: [], continuation: null };
    }
}

async function main() {
    console.log(`Starting token fetch for ${EVM_CHAIN} chain...`);
    console.log(`Contract address: ${NFT_CONTRACT}`);
    
    const csvRows = ['tokenId,imageUrl\n'];
    let processedTokens = new Set(); // To avoid duplicates
    let totalProcessed = 0;
    let continuation = null;
    let attempts = 0;
    const MAX_ATTEMPTS = Math.ceil(TOTAL_TOKENS / BATCH_SIZE) + 10; // Add some buffer
    
    while (processedTokens.size < TOTAL_TOKENS && attempts < MAX_ATTEMPTS) {
        attempts++;
        console.log(`\nFetching batch ${attempts}... (${Math.round((processedTokens.size/TOTAL_TOKENS)*100)}% complete)`);
        
        const { tokens, continuation: nextContinuation } = await fetchTokens(continuation);
        
        for (const tokenData of tokens) {
            if (tokenData && tokenData.token && tokenData.token.tokenId !== undefined && tokenData.token.image) {
                const tokenId = tokenData.token.tokenId;
                const imageUrl = tokenData.token.image;
                
                if (!processedTokens.has(tokenId)) {
                    csvRows.push(`${tokenId},${imageUrl}\n`);
                    processedTokens.add(tokenId);
                    totalProcessed++;
                    if (totalProcessed % 100 === 0) {
                        console.log(`Processed ${totalProcessed} unique tokens so far...`);
                    }
                }
            }
        }

        // If we don't get a continuation token, we've reached the end
        if (!nextContinuation) {
            console.log('No more continuation token received. Ending pagination.');
            break;
        }
        
        continuation = nextContinuation;
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Create output directory if it doesn't exist
    const outputDir = 'output';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Save to chain-specific CSV file
    const outputFile = `output/${EVM_CHAIN}_token_images.csv`;
    fs.writeFileSync(outputFile, csvRows.join(''));
    console.log(`\nData has been saved to ${outputFile}. Total unique tokens: ${processedTokens.size}`);
    
    if (processedTokens.size < TOTAL_TOKENS) {
        console.log(`\nWarning: Only fetched ${processedTokens.size} tokens out of ${TOTAL_TOKENS} expected tokens.`);
    }
}

main().catch(console.error); 