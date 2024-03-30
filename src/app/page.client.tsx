'use client';
import React from 'react';
import { mintNft, balanceOf } from '../../utils/mint';

export default function Home() {
  const userAddress = '0x8BF5932E7245865Ac9fb35c07907967A8B5375dB';

  const checkBalance = async () => {
    try {
      const balance = await balanceOf(userAddress);
      console.log(balance);
      alert(`Balance: ${balance}`);
    } catch (error) {
      console.error('Error fetching balance:', error);
      alert('Failed to fetch balance.');
    }
  };

  const mintNftHandler = async () => {
    try {
      const transaction = await mintNft(userAddress);
      console.log(transaction);
      alert('NFT minted successfully!');
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={checkBalance}
      >
        Check Balance
      </button>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={mintNftHandler}
      >
        Mint NFT
      </button>
    </main>
  );
}