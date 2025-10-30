'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function Confirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const referenceId = searchParams.get('referenceId');
  const customerName = searchParams.get('customerName');
  const total = searchParams.get('total');
  const experienceName = searchParams.get('experienceName');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleBackToHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9]">
        <Navbar onSearch={() => {}} searchQuery="" />
        <main className="flex items-center justify-center min-h-[50vh] px-6">
          <div className="text-center">
            <div className="animate-pulse mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto"></div>
            </div>
            <div className="h-8 bg-gray-300 rounded mb-4 w-64 mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded mb-8 w-48 mx-auto animate-pulse"></div>
            <div className="h-10 bg-gray-300 rounded w-32 mx-auto animate-pulse"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar onSearch={() => {}} searchQuery=" " />

      <main className="flex items-center justify-center min-h-[50vh] px-6">
        <div className="text-center">
          {/* Custom Green Circle with White Tick */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#24AC39] rounded-full flex items-center justify-center">
              <svg 
                width="50" 
                height="50" 
                viewBox="0 0 640 640" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fill="#ffffff" 
                  d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-medium text-[#161616] mb-4">
            Booking Confirmed
          </h1>

          <p className="text-lg text-[#656565] mb-2">
            Ref ID: <span className="font-semibold">{referenceId}</span>
          </p>

          <button
            onClick={handleBackToHome}
            className="px-6 py-3 bg-[#E3E3E3] text-[#656565] font-medium rounded-md hover:bg-gray-200 hover:text-gray-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}