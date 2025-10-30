'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import { validatePromoCode, PromoValidation, createBooking, getExperienceById, Experience } from '../lib/api';

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const experienceId = searchParams.get('experienceId');
  const slotId = searchParams.get('slotId');
  const date = searchParams.get('date');
  const slot = searchParams.get('slot');
  const quantity = searchParams.get('quantity') || '1';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [promoValidation, setPromoValidation] = useState<PromoValidation | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [experienceData, setExperienceData] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!experienceId) return;
      
      try {
        setLoading(true);
        const data = await getExperienceById(experienceId);
        setExperienceData(data);
      } catch (err) {
        console.error('Error fetching experience:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [experienceId]);

  const pricePerPerson = experienceData?.price || 0;
  const taxes = 59;
  const quantityNum = parseInt(quantity);
  const subtotal = pricePerPerson * quantityNum;
  
  const discount = promoValidation?.discount || 0;
  const total = promoValidation?.finalTotal ? promoValidation.finalTotal + taxes : subtotal + taxes;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    try {
      setPromoLoading(true);
      setPromoError('');
      const validation = await validatePromoCode(promoCode, subtotal);
      setPromoValidation(validation);
      
      if (validation.valid) {
        setAppliedPromo(promoCode);
        setPromoError('');
      } else {
        setAppliedPromo(null);
        setPromoError(validation.message || 'Invalid promo code');
      }
    } catch (error: any) {
      console.error('Error applying promo code:', error);
      setPromoError(error.message || 'Failed to apply promo code');
      setPromoValidation(null);
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoValidation(null);
    setAppliedPromo(null);
    setPromoError('');
  };

const handlePayAndConfirm = async () => {
  if (!fullName || !email) {
    alert('Please fill in all required fields');
    return;
  }

  if (!agreeTerms) {
    alert('Please agree to terms and safety policy');
    return;
  }

  if (!slotId) {
    alert('Slot information is missing');
    return;
  }

  try {
    const bookingData = {
      experienceId: experienceId || '',
      slotId: slotId, 
      user: {
        name: fullName,
        email: email, 
      },
      promoCode: appliedPromo || undefined,
      quantity: quantityNum
    };

    const result = await createBooking(bookingData);
    
    const confirmationParams = new URLSearchParams({
      referenceId: result.booking.referenceId, 
      experienceName: result.booking.experienceTitle,
      date: result.booking.date,
      time: result.booking.time,
      total: result.booking.total.toString(),
      customerName: fullName,
    });
    
    router.push(`/confirmation?${confirmationParams}`);
    
  } catch (error: any) {
    console.error('Booking failed:', error);
    alert(error.message || 'Booking failed. Please try again.');
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9]">
        <Navbar onSearch={() => {}} searchQuery="" />
        <main className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-[#161616] mb-6">
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-[#EFEFEF] rounded-lg p-6 h-64 animate-pulse"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-[#EFEFEF] rounded-lg p-6 h-64 animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar onSearch={() => {}} searchQuery="" />

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#161616] mb-6 hover:text-gray-600"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.152 5.4937H2.8437L6.91037 1.42704C7.23537 1.10204 7.23537 0.568703 6.91037 0.243703C6.83328 0.16645 6.7417 0.105161 6.64089 0.0633426C6.54008 0.0215248 6.43201 0 6.32287 0C6.21373 0 6.10566 0.0215248 6.00485 0.0633426C5.90404 0.105161 5.81247 0.16645 5.73537 0.243703L0.243704 5.73537C0.166451 5.81246 0.105161 5.90404 0.063343 6.00485C0.0215252 6.10566 0 6.21373 0 6.32287C0 6.43201 0.0215252 6.54008 0.063343 6.64089C0.105161 6.7417 0.166451 6.83328 0.243704 6.91037L5.73537 12.402C5.81252 12.4792 5.90411 12.5404 6.00492 12.5821C6.10572 12.6239 6.21376 12.6454 6.32287 12.6454C6.43198 12.6454 6.54002 12.6239 6.64082 12.5821C6.74163 12.5404 6.83322 12.4792 6.91037 12.402C6.98752 12.3249 7.04872 12.2333 7.09048 12.1325C7.13223 12.0317 7.15372 11.9236 7.15372 11.8145C7.15372 11.7054 7.13223 11.5974 7.09048 11.4966C7.04872 11.3958 6.98752 11.3042 6.91037 11.227L2.8437 7.16037H12.152C12.6104 7.16037 12.9854 6.78537 12.9854 6.32704C12.9854 5.8687 12.6104 5.4937 12.152 5.4937Z" fill="currentColor"/>
          </svg>
          <span className="font-medium text-[#000000]">Checkout</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#EFEFEF] rounded-lg p-6">
              {/* Full Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[#5B5B5B] text-sm mb-2">Full name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#DDDDDD] text-[#161616] placeholder-[#727272] rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#161616] text-sm mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#DDDDDD] text-[#161616] placeholder-[#727272] rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-4">
                <label className="block text-[#5B5B5B] text-sm mb-2">Promo Code</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      if (promoError) setPromoError('');
                    }}
                    disabled={!!appliedPromo}
                    className={`flex-1 px-4 py-3 bg-[#DDDDDD] text-[#161616] placeholder-[#727272] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                      appliedPromo ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                  {appliedPromo ? (
                    <button
                      onClick={handleRemovePromo}
                      className="px-8 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyPromo}
                      disabled={promoLoading}
                      className={`px-8 py-3 font-medium rounded-md transition-colors ${
                        promoLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#161616] text-white hover:bg-gray-800'
                      }`}
                    >
                      {promoLoading ? 'Applying...' : 'Apply'}
                    </button>
                  )}
                </div>
                {promoError && (
                  <p className="text-red-500 text-sm mt-2">{promoError}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 accent-[#161616]"
                />
                <label htmlFor="terms" className="text-[#5B5B5B] text-sm">
                  I agree to the terms and safety policy
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#EFEFEF] rounded-lg p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#656565]">Experience</span>
                  <span className="text-[#161616] font-medium">{experienceData?.title || 'Experience'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#656565]">Date</span>
                  <span className="text-[#161616]">{date || 'Not selected'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#656565]">Time</span>
                  <span className="text-[#161616]">{slot || 'Not selected'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#6C6C6C]">Qty</span>
                  <span className="text-[#161616]">{quantity}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#656565]">Subtotal</span>
                  <span className="text-[#161616]">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#656565]">Discount</span>
                    <span className="text-green-600">-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-[#656565]">Taxes</span>
                  <span className="text-[#161616]">₹{taxes}</span>
                </div>

                <div className="border-t border-[#D9D9D9] my-4"></div>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-medium text-[#161616]">Total</span>
                  <span className="text-2xl font-medium text-[#161616]">₹{total}</span>
                </div>


                <button
                  onClick={handlePayAndConfirm}
                  className="w-full py-3 bg-[#FFD643] text-[#161616] font-medium rounded-md hover:bg-yellow-500 transition-colors mt-4"
                >
                  Pay and Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}