'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Image from 'next/image';

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
          <div className="flex justify-center mb-6">
            <div className="rounded-full flex items-center justify-center">
              <Image
                src="/success.svg"
                alt="Booking Confirmed"
                width={80}
                height={80}
                className="object-contain"
              />
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