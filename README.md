# MEimageDown

A Node.js script to fetch NFT token data and image URLs from Magic Eden's API for SEI collections.

## Features

- Fetches token data for an entire NFT collection from Magic Eden
- Uses cursor-based pagination for reliable data retrieval
- Saves token IDs and image URLs to a CSV file
- Handles rate limiting with automatic delays
- Tracks progress and provides detailed logging
- Avoids duplicate entries

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Magic Eden API Key
- SEI Collection Contract Address

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

4. Add your Magic Eden API key and NFT contract address to the `.env` file.

## Configuration

Edit the `.env` file with your specific details:

```env
NFT_CONTRACT=your_contract_address_here
MAGIC_EDEN_API_KEY=your_api_key_here
```

You can also modify these constants in `fetch_tokens.js`:
- `TOTAL_TOKENS`: Total number of tokens to fetch
- `BATCH_SIZE`: Number of tokens to fetch per request (default: 20)

## Usage

Run the script:
```bash
node fetch_tokens.js
```

The script will:
1. Fetch token data in batches
2. Show progress and token ranges
3. Create a `token_images.csv` file with the results

## Output Format

The script generates a CSV file (`token_images.csv`) with the following columns:
- `tokenId`: The token ID number
- `imageUrl`: The URL of the token's image

## Error Handling

The script includes:
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