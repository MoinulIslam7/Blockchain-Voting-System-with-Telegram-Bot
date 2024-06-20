# Blockchain Voting System with Telegram Bot

## Overview

This project implements a decentralized voting system where users can cast votes for various proposals using a Telegram bot. The votes are recorded on a blockchain (Ethereum in this case) to ensure transparency and immutability of the voting process.

## Components

### Telegram Bot

The Telegram bot interacts with users, collects their votes, and communicates with the Ethereum blockchain to record the votes securely.

### Smart Contract

The smart contract manages the proposals and records the votes on the Ethereum blockchain. It ensures that each user can only vote once and maintains the integrity of the voting process.

### Blockchain Network

The project uses Ethereum as the blockchain network for deploying the smart contract. This provides the necessary infrastructure for decentralized and secure voting.

### Ethers.js

Ethers.js is used to facilitate communication between the Telegram bot (frontend) and the Ethereum blockchain (backend). It provides a convenient way to interact with smart contracts from JavaScript applications.

## Tools Required

- **Node.js**: Ensure Node.js is installed on your system.
- **Telegraf.js**: Telegram bot framework for Node.js. Install using `npm install telegraf` or `yarn add telegraf`.
- **Truffle**: Development framework for Ethereum. Install using `npm install -g truffle` or `yarn global add truffle`.
- **Ganache**: Local Ethereum blockchain for testing. Download from [Truffle Suite](https://www.trufflesuite.com/ganache).
- **Ethers.js**: JavaScript library for Ethereum. Install using `npm install ethers` or `yarn add ethers`.

## Setup Instructions

1. **Start Ganache**: Launch Ganache to run a local Ethereum blockchain. This will provide you with a set of test accounts with prefunded Ether for development and testing.

2. **Compile and Deploy Smart Contract**:
   - Open a new terminal and navigate to your project directory.
   - Compile your smart contracts: `truffle compile`
   - Deploy your smart contracts to Ganache: `truffle migrate --reset`

3. **Configure Environment Variables**:
   - Create a `.env` file in the root of your project.
   - Add your contract address, private key, and Telegram bot token:
     ```
     CONTRACT_ADDRESS=0xYourContractAddress
     PRIVATE_KEY=YourPrivateKey
     BOT_TOKEN=YourTelegramBotToken
     ```
   - Ensure you keep your `.env` file secure and do not expose your private key or bot token.

4. **Run the Telegram Bot**:
   - Start the Telegram bot by running: `node index.js` or `yarn dev` (depending on your setup).

5. **Interact with the Bot**:
   - Open Telegram and search for your bot.
   - Start voting on the proposals provided by the bot.

## Example Usage

Once everything is set up and running:
- Users can interact with the Telegram bot to vote on different proposals.
- Each vote is recorded on the Ethereum blockchain, ensuring transparency and security.
- Users receive feedback from the bot confirming their vote and can view current voting statistics.

## Author

This project was created by [Moinul Islam](https://www.linkedin.com/in/moinul-islam7/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
