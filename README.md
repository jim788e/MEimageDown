# MEimageDown

A Node.js script to fetch NFT token data and image URLs from Magic Eden's API for various EVM chains.

## Features

- Fetches token data for an entire NFT collection from Magic Eden
- Supports multiple EVM chains (ethereum, arbitrum, base, berachain, bsc, monad-testnet, polygon, sei)
- Uses cursor-based pagination for reliable data retrieval
- Saves token IDs and image URLs to chain-specific CSV files
- Handles rate limiting with automatic delays
- Tracks progress and provides detailed logging
- Avoids duplicate entries

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Magic Eden API Key
- NFT Collection Contract Address

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jim788e/MEimageDown.git
cd MEimageDown
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your Magic Eden API key, NFT contract address, and desired EVM chain to the `.env` file.

## Configuration

Edit the `.env` file with your specific details:

```env
NFT_CONTRACT=your_contract_address_here
MAGIC_EDEN_API_KEY=your_api_key_here
EVM_CHAIN=ethereum  # Change this to your desired chain
```

Available EVM chains:
- ethereum
- arbitrum
- base
- berachain
- bsc
- monad-testnet
- polygon
- sei

You can also modify these constants in `fetch_tokens.js`:
- `TOTAL_TOKENS`: Total number of tokens to fetch
- `BATCH_SIZE`: Number of tokens to fetch per request (default: 20)

## Usage

Run the script:
```bash
node fetch_tokens.js
```

The script will:
1. Validate the specified EVM chain
2. Fetch token data in batches
3. Show progress and token ranges
4. Create an `output` directory
5. Save results to `output/{chain}_token_images.csv`

## Output Format

The script generates a CSV file (`output/{chain}_token_images.csv`) with the following columns:
- `tokenId`: The token ID number
- `imageUrl`: The URL of the token's image

The output files are organized by chain name, making it easy to manage data from multiple collections across different chains.

## Error Handling

The script includes:
- EVM chain validation
- Request error handling
- Rate limiting protection
- Progress tracking
- Duplicate entry prevention
- Maximum attempts limit

## Dependencies

- `dotenv`: For environment variable management
- `node-fetch`: For making HTTP requests
- `fs`: For file system operations

## License

MIT License

## Contributing

Feel free to submit issues and pull requests. 