'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Image from 'next/image';
import { getExperienceById, Experience, Slot } from '../../lib/api';

export default function ExperienceDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [experienceData, setExperienceData] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!resolvedParams?.id) return;

      try {
        setLoading(true);
        const data = await getExperienceById(resolvedParams.id);
        setExperienceData(data);
        
        if (data.slots && data.slots.length > 0) {
          const firstDate = new Date(data.slots[0].date).toISOString().split('T')[0]; 
          setSelectedDate(firstDate);
        }
      } catch (err) {
        setError('Failed to load experience details');
        console.error('Error fetching experience:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [resolvedParams]);

  useEffect(() => {
    if (!selectedSlot) return;
    const available = Math.max(0, selectedSlot.capacity - selectedSlot.bookedCount);
    setQuantity(prev => Math.min(Math.max(1, prev), available || 1));
  }, [selectedSlot]);

  const getUniqueDates = () => {
    if (!experienceData?.slots) return [];
    
    const dates = experienceData.slots.map(slot => {
      const dateObj = new Date(slot.date);
      return {
        display: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // "Oct 23"
        iso: dateObj.toISOString().split('T')[0] // "2024-10-23"
      };
    });
    
    const uniqueDates = dates.filter((date, index, self) => 
      index === self.findIndex(d => d.iso === date.iso)
    );
    
    return uniqueDates;
  };

  const getSlotsForSelectedDate = () => {
    if (!experienceData?.slots || !selectedDate) return [];
    
    return experienceData.slots.filter(slot => {
      const slotDate = new Date(slot.date).toISOString().split('T')[0];
      return slotDate === selectedDate;
    });
  };

  const subtotal = experienceData ? experienceData.price * quantity : 0;
  const taxes = 59;
  const total = subtotal + taxes;
  const availableForSelected = selectedSlot ? Math.max(0, selectedSlot.capacity - selectedSlot.bookedCount) : 0;

  const handleConfirm = () => {
    if (!selectedSlot || !experienceData) {
      alert('Please select a time slot');
      return;
    }
    const available = Math.max(0, selectedSlot.capacity - selectedSlot.bookedCount);
    if (quantity > available) {
      alert(`Only ${available} seats left for this slot.`);
      setQuantity(Math.max(1, Math.min(quantity, available)));
      return;
    }
    
    const queryParams = new URLSearchParams({
      experienceId: experienceData._id,
      slotId: selectedSlot._id || '', 
      date: selectedDate, 
      slot: selectedSlot.time,
      quantity: quantity.toString(),
    });
    
    router.push(`/checkout?${queryParams}`);
  };

  if (loading || !resolvedParams) {
    return (
      <div className="min-h-screen bg-[#F9F9F9]">
        <Navbar onSearch={() => {}} searchQuery=" " />

        <main className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-[#161616] mb-6">
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="w-full h-[400px] bg-gray-300 rounded-lg mb-6 animate-pulse"></div>
              <div className="h-8 bg-gray-300 rounded mb-3 animate-pulse"></div>
              <div className="space-y-2 mb-8">
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse"></div>
              </div>

              <div className="mb-8">
                <div className="h-6 bg-gray-300 rounded mb-4 w-32 animate-pulse"></div>
                <div className="flex gap-3 flex-wrap">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-20 h-10 bg-gray-300 rounded-md animate-pulse"></div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="h-6 bg-gray-300 rounded mb-4 w-32 animate-pulse"></div>
                <div className="flex gap-3 flex-wrap">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-24 h-10 bg-gray-300 rounded-md animate-pulse"></div>
                  ))}
                </div>
              </div>

              <div className='py-0.5'>
                <div className="h-6 bg-gray-300 rounded mb-3 w-20 animate-pulse"></div>
                <div className="bg-[#EEEEEE] p-4 rounded-md">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#EFEFEF] rounded-lg p-6 sticky top-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                    </div>
                  ))}
                  <div className="border-t border-gray-300 my-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
                    <div className="h-6 bg-gray-300 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="h-12 bg-gray-300 rounded mt-4 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !experienceData) {
    return (
      <div className="min-h-screen bg-[#F9F9F9]">
        <Navbar onSearch={() => {}} searchQuery=" " />
        <main className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{error || 'Experience not found'}</p>
            <button 
              onClick={() => router.back()}
              className="px-6 py-2 bg-[#FFD643] text-[#161616] rounded-md hover:bg-yellow-500 font-medium"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  const uniqueDates = getUniqueDates();
  const availableSlots = getSlotsForSelectedDate();

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar onSearch={() => {}} searchQuery=" " />

      <main className="max-w-7xl mx-auto px-6 py-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#161616] mb-6 hover:text-gray-600"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.152 5.4937H2.8437L6.91037 1.42704C7.23537 1.10204 7.23537 0.568703 6.91037 0.243703C6.83328 0.16645 6.7417 0.105161 6.64089 0.0633426C6.54008 0.0215248 6.43201 0 6.32287 0C6.21373 0 6.10566 0.0215248 6.00485 0.0633426C5.90404 0.105161 5.81247 0.16645 5.73537 0.243703L0.243704 5.73537C0.166451 5.81246 0.105161 5.90404 0.063343 6.00485C0.0215252 6.10566 0 6.21373 0 6.32287C0 6.43201 0.0215252 6.54008 0.063343 6.64089C0.105161 6.7417 0.166451 6.83328 0.243704 6.91037L5.73537 12.402C5.81252 12.4792 5.90411 12.5404 6.00492 12.5821C6.10572 12.6239 6.21376 12.6454 6.32287 12.6454C6.43198 12.6454 6.54002 12.6239 6.64082 12.5821C6.74163 12.5404 6.83322 12.4792 6.91037 12.402C6.98752 12.3249 7.04872 12.2333 7.09048 12.1325C7.13223 12.0317 7.15372 11.9236 7.15372 11.8145C7.15372 11.7054 7.13223 11.5974 7.09048 11.4966C7.04872 11.3958 6.98752 11.3042 6.91037 11.227L2.8437 7.16037H12.152C12.6104 7.16037 12.9854 6.78537 12.9854 6.32704C12.9854 5.8687 12.6104 5.4937 12.152 5.4937Z" fill="currentColor"/>
          </svg>
          <span className="font-medium text-[#000000]">Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-6">
              <Image
                src={experienceData.image || '/placeholder-image.jpg'}
                alt={experienceData.title}
                fill
                className="object-cover"
              />
            </div>

            <h1 className="text-3xl text-[#161616] mb-3">
              {experienceData.title}
            </h1>
            <p className="text-[#6C6C6C] mb-8 text-lg">
              {experienceData.description}
            </p>

            <div className="mb-8">
              <h2 className="text-2xl font-medium text-[#161616] mb-4">Choose date</h2>
              <div className="flex gap-3 flex-wrap">
                {uniqueDates.map((dateObj) => (
                  <button
                    key={dateObj.iso}
                    onClick={() => setSelectedDate(dateObj.iso)}
                    className={`px-6 py-2 rounded-md font-medium transition-colors ${
                      selectedDate === dateObj.iso
                        ? 'bg-[#FFD643] text-[#161616]'
                        : 'bg-white text-[#838383] border border-[#BDBDBD] hover:border-gray-400'
                    }`}
                  >
                    {dateObj.display}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-medium text-[#161616] mb-4">Choose time</h2>
              <div className="flex gap-3 flex-wrap">
                {availableSlots.map((slot) => {
                  const available = slot.capacity - slot.bookedCount;
                  const isSoldOut = available <= 0;
                  
                  return (
                    <button
                      key={`${slot.date}-${slot.time}`}
                      onClick={() => !isSoldOut && setSelectedSlot(slot)}
                      disabled={isSoldOut}
                      className={`px-4 py-2 rounded-md font-medium transition-colors relative ${
                        selectedSlot?.time === slot.time
                          ? 'bg-[#FFD643] text-[#161616]'
                          : isSoldOut
                          ? 'bg-[#CCCCCC] text-[#838383] cursor-not-allowed'
                          : 'bg-white text-[#838383] border border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {slot.time}
                      {!isSoldOut && (
                        <span className="ml-2 text-xs text-[#FF4C0A]">{available} left</span>
                      )}
                      {isSoldOut && (
                        <span className="ml-2 text-xs text-[#6A6A6A]">Sold out</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[#838383] mt-2">All times are in IST (GMT +5:30)</p>
            </div>

            <div className='py-0.5'>
              <h2 className="text-xl font-medium text-[#161616] mb-3">About</h2>
              <div className="bg-[#EEEEEE] p-2 rounded-md">
                <p className="text-[#838383]">{experienceData.description}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#EFEFEF] rounded-lg p-6 sticky top-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#656565] text-lg">Starts at</span>
                  <span className="text-xl text-[#161616]">₹{experienceData.price}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#6C6C6C] text-lg">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 text-[#161616] border border-gray-300"
                    >
                      −
                    </button>
                    <span className="text-[#161616] font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(availableForSelected || 1, quantity + 1))}
                      disabled={!selectedSlot || quantity >= availableForSelected}
                      className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 text-[#161616] border border-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#6C6C6C] text-lg">Subtotal</span>
                  <span className="text-[#161616]">₹{subtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#6C6C6C] text-lg">Taxes</span>
                  <span className="text-[#161616]">₹{taxes}</span>
                </div>

                <div className="border-t border-gray-300 my-4"></div>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-semibold text-[#161616]">Total</span>
                  <span className="text-2xl font-semibold text-[#161616]">₹{total}</span>
                </div>

                <button
                  onClick={handleConfirm}
                  className={`w-full py-3 font-semibold rounded-md transition-colors mt-4 ${
                    selectedSlot
                      ? 'bg-[#FFD643] text-[#161616] hover:bg-yellow-500'
                      : 'bg-[#D7D7D7] text-[#7F7F7F] cursor-not-allowed'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}