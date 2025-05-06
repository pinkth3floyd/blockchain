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
  


