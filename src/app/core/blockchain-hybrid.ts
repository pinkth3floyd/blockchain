import { createHash } from 'crypto';

const sha256 = (data: string): string => {
    return createHash('sha256').update(data).digest('hex');
};


export class HybridTransaction {
    constructor(
        public readonly sender: string,
        public readonly receiver: string,
        public readonly amount: number,
        public readonly timestamp: number = Date.now() 
    ) {}

    calculateHash(): string {
        return sha256(this.sender + this.receiver + this.amount + this.timestamp);
    }
}

// Represents a node in the Hybrid Merkle Tree
export class HybridNode {
    constructor(
        public readonly value: string,
        public readonly left?: HybridNode,
        public readonly right?: HybridNode
    ) {}
}

// Represents a HybridMerkle Tree
export class HybridTree {
    root: HybridNode | null = null;

    constructor(public transactions: HybridTransaction[]) {
        this.buildTree();
    }

    buildTree(): void {
        if (this.transactions.length === 0) {
            this.root = null;
            return;
        }

        const transactionHashes = this.transactions.map(tx => tx.calculateHash());
        this.root = this.build(transactionHashes);
    }

    private build(nodes: string[]): HybridNode {
        if (nodes.length === 1) {
            return new HybridNode(nodes[0]);
        }

        const parentNodes: HybridNode[] = [];
        for (let i = 0; i < nodes.length; i += 2) {
            const left = new HybridNode(nodes[i]);
            const rightValue = i + 1 < nodes.length ? nodes[i + 1] : nodes[i];
            const right = new HybridNode(rightValue);
            const combinedHash = sha256(left.value + right.value);
            parentNodes.push(new HybridNode(combinedHash, left, right));
        }
        const nextLayer = parentNodes.map(node => node.value);
        return this.build(nextLayer);
    }

    getRootHash(): string {
        return this.root ? this.root.value : '';
    }

    // Returns the HybridMerkle proof for a given transaction.
    getMerkleProof(targetHash: string): string[] | null {
      if (!this.root) {
        return null;
      }
      const proof: string[] = [];
      return this.findProof(this.root, targetHash, proof);
    }

    private findProof(node: HybridNode, targetHash: string, proof: string[]): string[] | null {
        if (node.value === targetHash) {
            return proof;
        }

        if (node.left) {
            const leftProof = [...proof, node.right ? node.right.value : ''];
            const result = this.findProof(node.left, targetHash, leftProof);
            if (result) return result;
        }

        if (node.right) {
            const rightProof = [...proof, node.left ? node.left.value : ''];
            const result = this.findProof(node.right, targetHash, rightProof);
        }
        return null;
    }

    // Verifies a HybridMerkle proof against a target hash and a root hash.
    verifyMerkleProof(targetHash: string, proof: string[], rootHash: string): boolean {
        if (proof.length === 0 && targetHash === rootHash) {
            return true; //handles empty tree
        }

        let hash = targetHash;
        for (let i = 0; i < proof.length; i++) {
            const node = proof[i];
            hash = sha256(hash < node ? hash + node : node + hash);
        }
        return hash === rootHash;
    }
}

// Represents a Hybridblock in the Hybridblockchain
class HybridBlock {
    constructor(
        public readonly index: number,
        public readonly previousHash: string,
        public readonly timestamp: number,
        public readonly merkleRoot: string,
        public readonly transactions: HybridTransaction[],  // Store the actual transactions
        public readonly hash: string
    ) {}

    calculateHash(): string {
        return sha256(this.index + this.previousHash + this.timestamp + this.merkleRoot);
    }

    static createGenesisBlock(): HybridBlock {
        const genesisBlock = new HybridBlock(0, "0", Date.now(), "0", [], "0");
        const genesisBlockHash = genesisBlock.calculateHash();
        return new HybridBlock(0, "0", genesisBlock.timestamp, "0", [], genesisBlockHash);
    }
}

// Represents the blockchain
class HybridBlockchain {
    public chain: HybridBlock[];

    constructor() {
        this.chain = [HybridBlock.createGenesisBlock()];
    }

    getLatestBlock(): HybridBlock {
        return this.chain[this.chain.length - 1];
    }

    addBlock(transactions: HybridTransaction[]): void {
        const previousBlock = this.getLatestBlock();
        const newIndex = previousBlock.index + 1;
        const newTimestamp = Date.now();
        const merkleTree = new HybridTree(transactions);
        const merkleRoot = merkleTree.getRootHash();
        const newHash = sha256(newIndex + previousBlock.hash + newTimestamp + merkleRoot);
        const newBlock = new HybridBlock(newIndex, previousBlock.hash, newTimestamp, merkleRoot, transactions, newHash);
        this.chain.push(newBlock);
    }

    isChainValid(): boolean {
        if (this.chain.length === 1) return true;

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.error(`Previous hash mismatch at block ${i}`);
                return false;
            }

            const calculatedHash = currentBlock.calculateHash();
            if (currentBlock.hash !== calculatedHash) {
                console.error(`Hash mismatch at block ${i}`);
                return false;
            }
        }
        return true;
    }

    getChain(): HybridBlock[] {
        return this.chain;
    }
}


