
import React from 'react';
import { Block } from '../../blockchain';
import { Card, CardContent, CardHeader, CardTitle } from '../elements/card';

interface BlockDetailsProps {
  block: Block | null;
}

const BlockDetails: React.FC<BlockDetailsProps> = ({ block }) => {
  if (!block) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent className="pt-6">
          <p className="text-gray-500 dark:text-gray-400">Select a block to view details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Block #{block.index}</span>
          <span className="text-sm font-normal">
            {new Date(block.timestamp).toLocaleString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Hash</h3>
            <p className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">{block.hash}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">Previous Hash</h3>
            <p className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">{block.previousHash}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">Nonce</h3>
            <p className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">{block.nonce}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">Transactions ({block.transactions.length})</h3>
            <div className="max-h-64 overflow-y-auto">
              {block.transactions.map((tx) => (
                <div key={tx.id} className="p-2 my-1 text-xs bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="font-medium">ID: {tx.id.substring(0, 8)}...</div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">From:</span>
                    <span className="col-span-2 truncate">{tx.sender}</span>
                    
                    <span className="font-medium">To:</span>
                    <span className="col-span-2 truncate">{tx.recipient}</span>
                    
                    <span className="font-medium">Amount:</span>
                    <span className="col-span-2">{tx.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockDetails;
