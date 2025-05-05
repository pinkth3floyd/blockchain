import Image from "next/image";
import { useEffect, useState } from "react";
import { Block, Blockchain } from "./core/blockchain";

export default function Home() {


  const [blockchain, setBlockchain] = useState<Blockchain | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const [isValidChain, setIsValidChain] = useState<boolean>(true);
  const [miningInProgress, setMiningInProgress] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);






  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        
      </main>
      
    </div>
  );
}
