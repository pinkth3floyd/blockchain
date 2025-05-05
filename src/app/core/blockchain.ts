import { SHA256 } from 'crypto-js';

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


    constructor(difficulty = 2) {
        this.chain = [];
        this.pendingTransactions = [];
        this.difficulty = difficulty;
        this.initializeChain();
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


    calculateHash(index: number, previousHash: string, timestamp: number, transactions: Transaction[], nonce: number): string {
        return SHA256(index + previousHash + timestamp + JSON.stringify(transactions) + nonce).toString();
    }

    private async initializeChain() {
        try {



            // todo Check db for blockchain


            if (this.chain.length === 0) {
                const genesisBlock = this.createGenesisBlock();
                this.chain = [genesisBlock];


                // todo save genesis block
            }

            // todo Load pending transactions

        } catch (error) {
            console.error('Error initializing blockchain:', error);
        }
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

        // Save to database
        //todo save transaction to db

        return transaction;
    }



    async mineBlock(minerAddress: string): Promise<Block> {
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

        // Save block to database
        //   todo save block to databse

        // Update transaction block_hash references in database
        for (const tx of this.pendingTransactions) {
        
        }

        // Clear pending transactions
        this.pendingTransactions = [];

        return newBlock;
    }

    validateChain(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
          const currentBlock = this.chain[i];
          const previousBlock = this.chain[i - 1];
    
          // Validate hash
          if (currentBlock.hash !== this.calculateHash(
              currentBlock.index,
              currentBlock.previousHash,
              currentBlock.timestamp,
              currentBlock.transactions,
              currentBlock.nonce
            )) {
            return false;
          }
    
          // Validate chain links
          if (currentBlock.previousHash !== previousBlock.hash) {
            return false;
          }
        }
        return true;
      }


}