import { supabase } from "./db";
import { Block, Transaction } from './blockchain';



export const saveBlock = async (block: Block): Promise<void> => {
    try {
  
      const { error: blockError } = await supabase
        .from('blocks')
        .insert({
          hash: block.hash,
          index: block.index,
          timestamp: block.timestamp,
          previous_hash: block.previousHash,
          nonce: block.nonce
        });
      
      if (blockError) {
        throw blockError;
      }

      if (block.transactions.length > 0) {
       
        const transactions = block.transactions.map(tx => ({
          id: tx.id,
          sender: tx.sender,
          recipient: tx.recipient,
          amount: tx.amount,
          timestamp: tx.timestamp,
          block_hash: block.hash
        }));
        
     
        const { error: txError } = await supabase
          .from('transactions')
          .upsert(transactions, { 
            onConflict: 'id',
            ignoreDuplicates: false
          });
        
        if (txError) {
          throw txError;
        }
      }
      
      console.log(`Block #${block.index} saved successfully to Supabase`);
    } catch (error) {
      console.error('Error saving block to Supabase:', error);
      throw error;
    }
  };



  export const getAllBlocks = async (): Promise<Block[]> => {
    try {
   
      const { data: blocks, error: blocksError } = await supabase
        .from('blocks')
        .select()
        .order('index', { ascending: true });
      
      if (blocksError || !blocks) {
        throw blocksError || new Error('No blocks found');
      }
      
     
      const result: Block[] = await Promise.all(blocks.map(async (block) => {
        const { data: transactions, error: txError } = await supabase
          .from('transactions')
          .select()
          .eq('block_hash', block.hash);
        
        if (txError) {
          throw txError;
        }
        
        const mappedTransactions: Transaction[] = (transactions || []).map((tx) => ({
          id: tx.id,
          sender: tx.sender,
          recipient: tx.recipient,
          amount: Number(tx.amount),
          timestamp: tx.timestamp
        }));
        
        return {
          index: block.index,
          timestamp: block.timestamp,
          hash: block.hash,
          previousHash: block.previous_hash,
          nonce: block.nonce,
          transactions: mappedTransactions
        };
      }));
      
      return result;
    } catch (error) {
      console.error('Error getting blocks from Supabase:', error);
      return [];
    }
  };



  export const getBlockByHash = async (hash: string): Promise<Block | null> => {
    try {
     
      const { data: block, error: blockError } = await supabase
        .from('blocks')
        .select()
        .eq('hash', hash)
        .single();
      
      if (blockError || !block) {
        return null;
      }
      
    
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select()
        .eq('block_hash', hash);
      
      if (txError) {
        throw txError;
      }
      
      const mappedTransactions: Transaction[] = (transactions || []).map((tx) => ({
        id: tx.id,
        sender: tx.sender,
        recipient: tx.recipient,
        amount: Number(tx.amount),
        timestamp: tx.timestamp
      }));
      
      return {
        index: block.index,
        timestamp: block.timestamp,
        hash: block.hash,
        previousHash: block.previous_hash,
        nonce: block.nonce,
        transactions: mappedTransactions
      };
    } catch (error) {
      console.error('Error getting block by hash from Supabase:', error);
      return null;
    }
  };



  export const savePendingTransaction = async (transaction: Transaction): Promise<void> => {
    try {
     
      const { data: existingTx } = await supabase
        .from('transactions')
        .select('id')
        .eq('id', transaction.id)
        .single();
      
     
      if (!existingTx) {
      
        const { error } = await supabase
          .from('transactions')
          .insert({
            id: transaction.id,
            sender: transaction.sender,
            recipient: transaction.recipient,
            amount: transaction.amount,
            timestamp: transaction.timestamp,
            block_hash: null 
          });
        
        if (error) {
          throw error;
        }
        
        console.log(`Transaction ${transaction.id} saved as pending to Supabase`);
      } else {
        console.log(`Transaction ${transaction.id} already exists, skipping save`);
      }
    } catch (error) {
      console.error('Error saving pending transaction to Supabase:', error);
      throw error;
    }
  };
  


  export const getPendingTransactions = async (): Promise<Transaction[]> => {
    try {
     
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select()
        .is('block_hash', null);
      
      if (error) {
        throw error;
      }
      
      return (transactions || []).map((tx) => ({
        id: tx.id,
        sender: tx.sender,
        recipient: tx.recipient,
        amount: Number(tx.amount),
        timestamp: tx.timestamp
      }));
    } catch (error) {
      console.error('Error getting pending transactions from Supabase:', error);
      return [];
    }
  };
  


