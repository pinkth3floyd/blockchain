This is sample implementation of the blockchain technology.

Created By Prakash Niraula

Contact: pinkth3floyd@gmail.com
Website: https://prakashniraula.info

Project Live Url: https://blockchain-dusky-three.vercel.app/





Merkel Blockchain  
const mchain = new MerkelBlockchain();  
const tx1 = new MerkelTransaction("Alice", "Bob", 10);  
const tx2 = new MerkelTransaction("Bob", "Charlie", 5);  
const tx3 = new MerkelTransaction("Charlie", "Alice", 12);  
const tx4 = new MerkelTransaction("David", "Eve", 20);  


mchain.addBlock([tx1, tx2]);  
mchain.addBlock([tx3, tx4]);  


console.log("MerkelBlockchain: \n", mchain.getChain());  

const latestBlock = mchain.getLatestBlock();
const merkleTree = new MerkleTree(latestBlock.transactions);  
const rootHash = merkleTree.getRootHash();  

console.log("\nMerkle Root: ", rootHash);  

const proof = merkleTree.verifyTransaction(tx3);  
console.log("\nMerkle Proof for tx3:", proof);  

if (proof && proof.length > 0) {  
    const isProofValid = merkleTree.checkProof(tx3.calculateHash(), proof, rootHash);  
    console.log("\nIs Merkle Proof Valid?", isProofValid);  
}  





Merkel+Hash Hybrid Blockchain  
const myChain = new HybridBlockchain();  

const tx1 = new HybridTransaction("Alice", "Bob", 10);  
const tx2 = new HybridTransaction("Bob", "Charlie", 5);  
const tx3 = new HybridTransaction("Charlie", "Alice", 12);  
const tx4 = new HybridTransaction("David", "Eve", 20);  
const tx5 = new HybridTransaction("Eve", "Frank", 8);  


myChain.addBlock([tx1, tx2]);  
myChain.addBlock([tx3, tx4, tx5]);  //testing with odd number of transactions  

console.log("Blockchain: \n", myChain.getChain());  

const latestBlock = myChain.getLatestBlock();  
const merkleTree = new HybridTree(latestBlock.transactions);  
const rootHash = merkleTree.getRootHash();   
console.log("\nMerkle Root:", rootHash);  

// Example of verifying a transaction.  
const targetTx = tx3;  
const targetTxHash = targetTx.calculateHash();  
const proof = merkleTree.getMerkleProof(targetTxHash);  
console.log("\nMerkle Proof for tx3:", proof);  

if (proof) {  
  const isProofValid = merkleTree.verifyMerkleProof(targetTxHash, proof, rootHash);  
  console.log("\nIs Merkle Proof Valid:", isProofValid);  
}  

//check for invalid chain.  
console.log("\nIs Chain Valid:", myChain.isChainValid());  
myChain.chain[1].transactions[0].amount = 1000; //tamper  
console.log("\nIs Chain Valid After Tampering:", myChain.isChainValid());  