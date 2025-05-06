import React, { useState } from 'react';
import { Transaction } from '../../blockchain';
import { Button } from '../elements/button';
import { Input } from '../elements/input';
import { Card, CardContent, CardHeader, CardTitle } from '../elements/card';

interface TransactionPoolProps {
  pendingTransactions: Transaction[];
  onAddTransaction: (sender: string, recipient: string, amount: number) => Promise<void>;
  onMineBlock: () => Promise<void>;
}

const TransactionPool: React.FC<TransactionPoolProps> = ({
  pendingTransactions,
  onAddTransaction,
  onMineBlock
}) => {
  
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sender && recipient && parseFloat(amount) > 0) {
      setIsSubmitting(true);
      try {
        await onAddTransaction(sender, recipient, parseFloat(amount));
        setSender('');
        setRecipient('');
        setAmount('');
      } catch (error) {
        console.error('Error adding transaction:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleMineBlockClick = async () => {
    await onMineBlock();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Transaction Pool</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {pendingTransactions.length} pending
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input 
              placeholder="Sender" 
              value={sender} 
              onChange={(e) => setSender(e.target.value)}
              className="mb-2"
              disabled={isSubmitting}
            />
            <Input 
              placeholder="Recipient" 
              value={recipient} 
              onChange={(e) => setRecipient(e.target.value)}
              className="mb-2"
              disabled={isSubmitting}
            />
            <Input 
              type="number" 
              placeholder="Amount" 
              min="0.01" 
              step="0.01" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !sender || !recipient || !amount}
            >
              {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </Button>
            <Button 
              type="button" 
              className="w-full" 
              disabled={pendingTransactions.length === 0 || isSubmitting}
              onClick={handleMineBlockClick}
              variant="secondary"
            >
              Mine Block
            </Button>
          </div>
        </form>

        <div className="mt-4 max-h-40 overflow-y-auto">
          {pendingTransactions.map((tx) => (
            <div key={tx.id} className="text-sm p-2 my-1 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="flex justify-between">
                <span className="font-medium">From:</span>
                <span className="truncate max-w-[150px]">{tx.sender}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">To:</span>
                <span className="truncate max-w-[150px]">{tx.recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>{tx.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionPool;
