'use client';

import { Suspense } from 'react';
import CheckoutContent from './CheckoutContent';

export default function Checkout() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
