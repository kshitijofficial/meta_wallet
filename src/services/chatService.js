import axios from 'axios';

// API Configuration
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY; // Get free key from: https://console.groq.com
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are a helpful and friendly cryptocurrency assistant for beginners. Your goal is to:
- Explain crypto concepts in simple, easy-to-understand terms
- Be concise but informative (2-3 sentences usually)
- Use analogies when helpful
- Encourage safe practices
- Stay positive and encouraging

Keep responses brief and clear.`;

const FALLBACK_RESPONSES = [
    "I'm here to help you learn about crypto! What would you like to know?",
    "Crypto can seem complex at first, but I'm here to break it down for you. Ask me anything!",
    "Welcome to the world of cryptocurrency! I can help explain concepts, wallets, and more.",
    "New to crypto? No worries! I'm your friendly guide. What questions do you have?",
    "Let's learn about crypto together! I'm here to answer your questions in simple terms."
];

export class ChatService {
    constructor() {
        this.conversationHistory = [];
        this.isLoading = false;
    }

    async sendMessage(message) {
        if (!message.trim()) {
            return "Please ask me something about crypto!";
        }

        this.isLoading = true;

        try {
            // Add user message to conversation history
            this.conversationHistory.push({ role: 'user', content: message });

            let aiResponse = '';

            // Try Groq API if API key is available
            if (GROQ_API_KEY) {
                try {
                    aiResponse = await this.callGroqAPI(message);
                } catch (error) {
                    console.warn('Groq API failed:', error.message);
                }
            }

            // If Groq didn't work or no API key, use smart fallback
            if (!aiResponse) {
                return this.getFallbackResponse(message);
            }

            // Add AI response to conversation history
            this.conversationHistory.push({ role: 'assistant', content: aiResponse });

            // Keep only last 10 messages to avoid context overflow
            if (this.conversationHistory.length > 10) {
                this.conversationHistory = this.conversationHistory.slice(-10);
            }

            return aiResponse;

        } catch (error) {
            console.error('Chat API Error:', error);
            // Use enhanced fallback response
            return this.getFallbackResponse(message);
        } finally {
            this.isLoading = false;
        }
    }

    async callGroqAPI(message) {
        // Build message history in OpenAI format
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT }
        ];

        // Add recent conversation history
        const recentHistory = this.conversationHistory.slice(-6);
        messages.push(...recentHistory);

        const response = await axios.post(GROQ_API_URL, {
            model: 'llama-3.3-70b-versatile', // Free, fast, high quality
            messages: messages,
            temperature: 0.7,
            max_tokens: 256,
            top_p: 0.9
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        const aiResponse = response.data?.choices?.[0]?.message?.content?.trim();
        if (!aiResponse) {
            throw new Error('No response from Groq');
        }

        return aiResponse;
    }

    getFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        // Enhanced keyword-based responses for common crypto questions

        // Bitcoin
        if (lowerMessage.includes('bitcoin') || lowerMessage.includes('btc')) {
            return "Bitcoin (BTC) is the first cryptocurrency, created in 2009 by Satoshi Nakamoto. It's digital money that operates without banks or governments, using blockchain technology. Bitcoin has a limited supply of 21 million coins, making it scarce like digital gold!";
        }

        // Ethereum
        if (lowerMessage.includes('ethereum') || lowerMessage.includes('eth')) {
            return "Ethereum (ETH) is a blockchain platform that enables smart contracts and decentralized applications (dApps). Created by Vitalik Buterin in 2015, it's like a global computer where developers can build apps that run exactly as programmed without any possibility of downtime or censorship.";
        }

        // General crypto/cryptocurrency
        if (lowerMessage.includes('what is') || lowerMessage.includes('explain')) {
            if (lowerMessage.includes('crypto') || lowerMessage.includes('cryptocurrency')) {
                return "Cryptocurrency is digital or virtual money secured by cryptography. Unlike traditional currencies, it's decentralized (not controlled by banks or governments) and uses blockchain technology to record transactions. Bitcoin was the first, created in 2009!";
            }
            if (lowerMessage.includes('blockchain')) {
                return "Blockchain is a digital ledger that records transactions across many computers. Think of it as a chain of blocks, where each block contains transaction data. It's secure, transparent, and tamper-resistant because changing one block would require changing all subsequent blocks!";
            }
            if (lowerMessage.includes('wallet')) {
                return "A crypto wallet stores your private keys and lets you send/receive cryptocurrency. It's like a digital bank account, but YOU control it completely. Types: hardware wallets (most secure), software wallets (apps like this one), and paper wallets.";
            }
            if (lowerMessage.includes('defi')) {
                return "DeFi (Decentralized Finance) means financial services built on blockchain without traditional banks. You can lend, borrow, trade, and earn interest on your crypto directly with others through smart contracts. It's like recreating the financial system on the blockchain!";
            }
            if (lowerMessage.includes('nft')) {
                return "NFTs (Non-Fungible Tokens) are unique digital items on the blockchain. Unlike regular crypto (1 BTC = 1 BTC), each NFT is one-of-a-kind. They're used for digital art, collectibles, gaming items, and proving ownership of unique digital assets.";
            }
            if (lowerMessage.includes('gas') || lowerMessage.includes('fee')) {
                return "Gas fees are transaction costs on blockchain networks like Ethereum. Think of them as tolls for using the network. Fees vary based on network congestion - higher demand means higher fees. You can often choose between faster (expensive) or slower (cheaper) transactions.";
            }
            if (lowerMessage.includes('mining')) {
                return "Cryptocurrency mining is using computer power to validate transactions and secure the blockchain network. Miners solve complex math problems and get rewarded with new coins. It's like being a bank that processes transactions, but decentralized!";
            }
            if (lowerMessage.includes('staking')) {
                return "Staking means locking up your crypto to help secure a blockchain network and earn rewards. It's like earning interest in a savings account! Different cryptocurrencies offer different staking rewards and requirements. Always research before staking.";
            }
            if (lowerMessage.includes('private key') || lowerMessage.includes('seed phrase')) {
                return "Your private key/seed phrase is like the master password to your crypto. NEVER share it with anyone! If someone gets it, they can steal all your funds. Write it down and store it securely offline - losing it means losing access to your crypto forever!";
            }
        }

        // How to questions
        if (lowerMessage.includes('how to') || lowerMessage.includes('how do') || lowerMessage.includes('how can')) {
            if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('invest')) {
                return "To buy crypto: 1) Choose a reputable exchange (Coinbase, Binance, Kraken), 2) Create account & verify identity (KYC), 3) Add payment method (bank/card), 4) Buy your first crypto! Start small, diversify, and only invest what you can afford to lose. Always research first!";
            }
            if (lowerMessage.includes('send') || lowerMessage.includes('transfer')) {
                return "To send crypto: 1) Open your wallet, 2) Click 'Send', 3) Enter recipient's address (double-check it!), 4) Enter amount, 5) Review gas fees, 6) Confirm. IMPORTANT: Crypto transactions are irreversible! Always verify the address and send a small test amount first for large transfers.";
            }
            if (lowerMessage.includes('store') || lowerMessage.includes('keep safe')) {
                return "To store crypto safely: Best = hardware wallet (Ledger, Trezor) for large amounts. Good = software wallet (like this one) for smaller amounts. Enable 2FA, use strong passwords, backup your seed phrase, and NEVER share your private keys. For exchanges, only keep what you're actively trading.";
            }
        }

        // Safety and security
        if (lowerMessage.includes('safe') || lowerMessage.includes('secure') || lowerMessage.includes('protect')) {
            return "🔐 Crypto Safety Tips: Use strong unique passwords • Enable 2FA everywhere • NEVER share private keys/seed phrases • Use hardware wallets for large amounts • Double-check addresses before sending • Be skeptical of 'too good to be true' offers • Research before investing!";
        }

        // Scams
        if (lowerMessage.includes('scam') || lowerMessage.includes('fraud') || lowerMessage.includes('hack')) {
            return "🚨 Common crypto scams: Phishing sites, fake giveaways, pump & dump schemes, rug pulls, and impersonators. RED FLAGS: Guaranteed returns, pressure to invest quickly, requests for private keys, unsolicited messages. REMEMBER: If it sounds too good to be true, it probably is! Only use official websites.";
        }

        // Price/value questions
        if (lowerMessage.includes('price') || lowerMessage.includes('value') || lowerMessage.includes('worth') || lowerMessage.includes('cost')) {
            return "Crypto prices are highly volatile and change constantly based on supply/demand, news, regulations, adoption, and market sentiment. Never invest more than you can afford to lose. Do your own research (DYOR), diversify, and think long-term. Check coinmarketcap.com or coingecko.com for current prices!";
        }

        // General help
        if (lowerMessage.includes('help') || lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('learn')) {
            return "I can help you learn about crypto! Try asking: 'What is Bitcoin?', 'What is a crypto wallet?', 'How to buy crypto?', 'How to stay safe?', or any other crypto questions. I'm here to make crypto easy to understand! 🚀";
        }

        // Return a random fallback response if no specific match
        return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    }

    clearConversation() {
        this.conversationHistory = [];
    }

    getConversationHistory() {
        return this.conversationHistory;
    }

    isCurrentlyLoading() {
        return this.isLoading;
    }
}

// Export a singleton instance
export const chatService = new ChatService();
