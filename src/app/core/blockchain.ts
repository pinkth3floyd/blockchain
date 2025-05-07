import { SHA256 } from 'crypto-js';
import * as db from './controller';
export interface Transaction {
    id: string;
    sender: string;
    recipient: string;
    amount: number;
    timestamp: number;
}

export interface Block {
    index: number;
    timestamp: number;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
    nonce: number;
}


export class Blockchain {

    private chain: Block[];
    private pendingTransactions: Transaction[];
    private difficulty: number;
    private initialized: boolean;


    constructor(difficulty = 2) {
        this.chain = [];
        this.pendingTransactions = [];
        this.difficulty = difficulty;
        this.initialized = false;
        this.initializeChain();
    }




    private async initializeChain() {
        try {
            this.chain = await db.getAllBlocks();


            if (this.chain.length === 0) {
                const genesisBlock = this.createGenesisBlock();
                this.chain = [genesisBlock];


                await db.saveBlock(genesisBlock);
            }

            this.pendingTransactions = await db.getPendingTransactions();
            this.initialized = true;

            console.log('Blockchain initialized with', this.chain.length, 'blocks and',
                this.pendingTransactions.length, 'pending transactions');

        } catch (error) {
            console.error('Error initializing blockchain:', error);
            this.initialized = false;
        }
    }

    private createGenesisBlock(): Block {
        const genesisBlock = {
            index: 0,
            timestamp: Date.now(),
            transactions: [],
            previousHash: "0",
            hash: "0",
            nonce: 0
        };


        genesisBlock.hash = this.calculateHash(
            genesisBlock.index,
            genesisBlock.previousHash,
            genesisBlock.timestamp,
            genesisBlock.transactions,
            genesisBlock.nonce
        );

        return genesisBlock;
    }

    isInitialized(): boolean {
        return this.initialized;
    }


    // calculateHash(index: number, previousHash: string, timestamp: number, transactions: Transaction[], nonce: number): string {
    //     return SHA256(index + previousHash + timestamp + JSON.stringify(transactions) + nonce).toString();
    // }

    calculateHash(index: number, previousHash: string, timestamp: number, transactions: Transaction[], nonce: number): string {
        const transactionsStr = JSON.stringify(transactions.map(tx => ({
            id: tx.id,
            sender: tx.sender,
            recipient: tx.recipient,
            amount: Number(tx.amount),
            timestamp: tx.timestamp
        })));
        return SHA256(index + previousHash + timestamp + transactionsStr + nonce).toString();
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }


    getChain(): Block[] {
        return [...this.chain];
    }

    getPendingTransactions(): Transaction[] {
        return [...this.pendingTransactions];
    }


    generateTransactionId(): string {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }



    async addTransaction(sender: string, recipient: string, amount: number): Promise<Transaction> {
        const transaction: Transaction = {
            id: this.generateTransactionId(),
            sender,
            recipient,
            amount,
            timestamp: Date.now()
        };

        this.pendingTransactions.push(transaction);

        await db.savePendingTransaction(transaction);

        return transaction;
    }



    async mineBlock(minerAddress: string): Promise<Block> {
        const pendingTransactions = [...this.pendingTransactions];



        const rewardTransaction: Transaction = {
            id: this.generateTransactionId(),
            sender: "SYSTEM",
            recipient: minerAddress,
            amount: 1,
            timestamp: Date.now()
        };

        const transactions = [...this.pendingTransactions, rewardTransaction];
        const previousBlock = this.getLatestBlock();
        const index = previousBlock.index + 1;
        const previousHash = previousBlock.hash;
        const timestamp = Date.now();
        let nonce = 0;
        let hash = this.calculateHash(index, previousHash, timestamp, transactions, nonce);

        // Mining process - Proof of Work
        while (hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
            nonce++;
            hash = this.calculateHash(index, previousHash, timestamp, transactions, nonce);
        }

        const newBlock: Block = {
            index,
            timestamp,
            transactions,
            previousHash,
            hash,
            nonce
        };

        this.chain.push(newBlock);

        await db.saveBlock(newBlock);

        for (const tx of pendingTransactions) {
            await db.updateTransactionBlockHash(tx.id, newBlock.hash);
        }

        // Clear pending transactions
        this.pendingTransactions = [];

        return newBlock;
    }

    validateChain(): boolean {
        if (this.chain.length <= 1) {
          return true;
        }
        for (let i = 1; i < this.chain.length; i++) {
          const currentBlock = this.chain[i];
          const previousBlock = this.chain[i - 1];
          if (currentBlock.previousHash !== previousBlock.hash) {
            console.error(`Chain link broken at block ${i}: previousHash doesn't match block ${i-1}'s hash`);
            return false;
          }
          const hashPrefix = currentBlock.hash.substring(0, this.difficulty);
          const expectedPrefix = Array(this.difficulty + 1).join("0");
          
          if (hashPrefix !== expectedPrefix) {
            console.error(`Block ${i} hash doesn't have the correct difficulty prefix`);
            return false;
          }
        }
        return true;
      }

}