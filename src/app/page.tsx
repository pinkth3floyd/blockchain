"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { Block, Blockchain } from "./core/blockchain";
import BlockchainVisualizer from "./core/ui/components/BlockchainVisualizer";
import { Skeleton } from "./core/ui/elements/skeleton";
import TransactionPool from "./core/ui/components/TransactionPool";
import BlockDetails from "./core/ui/components/BlockDetail";

export default function Home() {


  const [blockchain, setBlockchain] = useState<Blockchain | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const [isValidChain, setIsValidChain] = useState<boolean>(true);
  const [miningInProgress, setMiningInProgress] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);


  useEffect(() => {

    try {
      const newBlockchain = new Blockchain(3);
      setBlockchain(newBlockchain);

      const checkInitialization = setInterval(() => {
        if (newBlockchain.isInitialized()) {
          updateBlockchainState(newBlockchain);
          setLoading(false);
          setIsInitialized(true);
          clearInterval(checkInitialization);
          console.log('Successfully connected to Supabase database');
        }
      }, 500);


      return () => {
        clearInterval(checkInitialization);
      };
    } catch (error) {
      console.error('Failed to initialize blockchain:', error);
      setLoading(false);
    }
  }, []);



  const updateBlockchainState = (chain: Blockchain) => {
    if (!chain) return;

    const chainData = chain.getChain();
    setBlocks(chainData);
    setIsValidChain(chain.validateChain());

    if (selectedBlockIndex === null && chainData.length > 0) {
      setSelectedBlockIndex(chainData.length - 1);
    }
  };


  const handleAddTransaction = async (sender: string, recipient: string, amount: number) => {
    if (!blockchain) return;

    try {
      await blockchain.addTransaction(sender, recipient, amount);
      console.log('Transaction added to the pool');
      updateBlockchainState(blockchain);
    } catch (error) {
      console.error('Failed to add transaction:', error);

    }
  };


  const handleMineBlock = async () => {
    if (!blockchain) return;

    setMiningInProgress(true);

    setTimeout(async () => {
      try {
        const minerAddress = "miner-" + Math.floor(Math.random() * 1000);
        const newBlock = await blockchain.mineBlock(minerAddress);
        console.log(`Block #${newBlock.index} mined successfully!`);
        setSelectedBlockIndex(newBlock.index);
        updateBlockchainState(blockchain);
      } catch (error) {

        console.error(error);
      } finally {
        setMiningInProgress(false);
      }
    }, 1500);
  };

  const handleSelectBlock = (index: number) => {
    setSelectedBlockIndex(index);
  };

  const selectedBlock = selectedBlockIndex !== null && blocks.length > 0 ? blocks[selectedBlockIndex] : null;





  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse h-8 w-8 bg-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Connecting to Supabase and initializing blockchain...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">

        {/* header */}
        <div className="text-center mb-4">
            <h1 className="text-3xl font-bold mb-2">Blockchain Explorer</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A visual demonstration of blockchain technology with blocks, transactions, and mining.
             Powered by NextJS and Supabase
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div 
                className={`px-3 py-1 rounded-full text-sm ${
                  isValidChain 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                }`}
              >
                {isValidChain ? 'Chain Valid ✓' : 'Chain Invalid ✗'}
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900 dark:text-blue-100">
                {blocks.length} Blocks
              </div>
              <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm dark:bg-purple-900 dark:text-purple-100">
                Difficulty: {3}
              </div>
            </div>
          </div>



          {/* blockchain visualizer */}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-4">Blockchain</h2>
            {!isInitialized ? (
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-52 h-44" />
                ))}
              </div>
            ) : blocks.length > 0 ? (
              <BlockchainVisualizer 
                blocks={blocks}
                selectedBlockIndex={selectedBlockIndex}
                onSelectBlock={handleSelectBlock}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No blocks found. Start by adding a transaction and mining a block.
              </div>
            )}
          </div>



          {/* main content */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Transaction Pool */}
            <div className="md:col-span-1">
              <TransactionPool 
                pendingTransactions={blockchain?.getPendingTransactions() || []}
                onAddTransaction={handleAddTransaction}
                onMineBlock={handleMineBlock}
              />
            </div>
            
            {/* Block Details */}
            <div className="md:col-span-2">
              {!isInitialized ? (
                <Skeleton className="w-full h-96" />
              ) : (
                <BlockDetails block={selectedBlock} />
              )}
            </div>
          </div>







          {/* Mining Indicator */}
          {miningInProgress && (
            <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
              <div className="animate-pulse h-3 w-3 bg-yellow-400 rounded-full"></div>
              <span>Mining in progress...</span>
            </div>
          )}




        </div>
      </div>
    </div>
  );
}
