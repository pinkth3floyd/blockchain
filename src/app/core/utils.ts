import { Block, Blockchain } from "./blockchain";

export class Utils {

    private BlockChain: Blockchain;
    // private Blocks:Block;
    // private SelectedBlocIndex:number;
    // private isValid:boolean;
    // private MiningInProcess:boolean;

    constructor() {
        this.BlockChain = new Blockchain(3);

    }


    async AddTransaction(sender: string, recipient: string, amount: number) {
        if (!this.BlockChain) return;
        try {
            await this.BlockChain.addTransaction(sender, recipient, amount);
            console.log('Transaction added to the pool');

        } catch (error) {
            console.error('Failed to add transaction:', error);

        }

    }


    async MineBlocks() {

        if (!this.BlockChain) return;

        try {
            const minerAddress = "miner-" + Math.floor(Math.random() * 1000);
            const newBlock = await this.BlockChain.mineBlock(minerAddress);
            console.log(`Block #${newBlock.index} mined successfully!`);

        } catch (error) {
            console.error('Error mining blocks:', error);
        }

    }


    async UpdateBlockChain(chain: Blockchain) {
        if (!this.BlockChain) return;

        try {
            this.BlockChain = chain;
            const isValid = this.BlockChain.validateChain()
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





