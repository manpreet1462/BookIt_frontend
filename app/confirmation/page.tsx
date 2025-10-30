'use client';

import { Suspense } from 'react';
import ConfirmationContent from './ConfirmationContent';

export default function Confirmation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}

