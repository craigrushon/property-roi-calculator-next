'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { ModalProvider } from '@/components/modal';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <ModalProvider>{children}</ModalProvider>
    </TooltipProvider>
  );
}
