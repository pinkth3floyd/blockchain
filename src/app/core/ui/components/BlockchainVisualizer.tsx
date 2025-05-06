
import React from 'react';
import { Block, Transaction } from '../../blockchain';
import { Badge } from '../elements/badge';
import { Badge as BadgeIcon } from 'lucide-react';

interface BlockchainVisualizerProps {
  blocks: Block[];
  selectedBlockIndex: number | null;
  onSelectBlock: (index: number) => void;
}

const BlockchainVisualizer: React.FC<BlockchainVisualizerProps> = ({
  blocks,
  selectedBlockIndex,
  onSelectBlock
}) => {
  // Create a reversed copy of blocks to display in descending order
  const reversedBlocks = [...blocks].reverse();
  
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex space-x-4 min-w-max">
        {reversedBlocks.map((block, reversedIndex) => {
          // Calculate the original index to maintain correct block selection
          const originalIndex = blocks.length - 1 - reversedIndex;
          const isLatest = block.index === blocks.length - 1 && block.index !== 0;
          
          return (
            <div
              key={block.hash}
              className={`flex-shrink-0 w-52 border rounded-lg p-4 transition-transform duration-300 hover:scale-105 cursor-pointer ${
                selectedBlockIndex === originalIndex 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              } ${isLatest ? 'relative' : ''}`}
              onClick={() => onSelectBlock(originalIndex)}
            >
              {isLatest && (
                <div className="absolute top-3 right-3 animate-pulse">
                  <Badge 
                    variant="secondary"
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 shadow-lg"
                  >
                    <BadgeIcon size={14} />
                    <span>Latest</span>
                  </Badge>
                </div>
              )}
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">Block #{block.index}</div>
                {block.index === 0 && (
                  <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 dark:bg-purple-900 dark:text-purple-200">
                    Genesis
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {new Date(block.timestamp).toLocaleString()}
              </div>
              <div className="flex flex-col space-y-1">
                <div className="text-xs font-medium">Hash:</div>
                <div className="text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded overflow-hidden text-ellipsis">
                  {block.hash.substring(0, 15)}...
                </div>
                <div className="text-xs font-medium mt-1">Previous Hash:</div>
                <div className="text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded overflow-hidden text-ellipsis">
                  {block.previousHash.substring(0, 15)}...
                </div>
              </div>
              <div className="mt-2 text-xs font-medium">
                Transactions: {block.transactions.length}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlockchainVisualizer;
