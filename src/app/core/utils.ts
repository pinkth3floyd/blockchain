import {  Blockchain } from "./blockchain";



export class Utils {

    private blockchain: Blockchain;
    // private Blocks:Block;
    // private SelectedBlocIndex:number;
    // private isValid:boolean;
    // private MiningInProcess:boolean;

    constructor() {
        this.blockchain = new Blockchain(3);

    }


    async AddTransaction(sender: string, recipient: string, amount: number) {
        if (!this.blockchain) return;
        try {
            await this.blockchain.addTransaction(sender, recipient, amount);
            console.log('Transaction added to the pool');

        } catch (error) {
            console.error('Failed to add transaction:', error);

        }

    }


    async MineBlocks() {

        if (!this.blockchain) return;

        try {
            const minerAddress = "miner-" + Math.floor(Math.random() * 1000);
            const newBlock = await this.blockchain.mineBlock(minerAddress);
            console.log(`Block #${newBlock.index} mined successfully!`);

        } catch (error) {
            console.error('Error mining blocks:', error);
        }

    }


    async UpdateBlockChain(chain: Blockchain) {
        if (!this.blockchain) return;

        try {
            this.blockchain = chain;
            const isValid = this.blockchain.validateChain()
            if (isValid) {
                console.log("Chain Validation Successful");
                return true
            }
            return false;
        } catch (error) {
            console.log("Error validating block" + error);
        }

    };

}





