// components/layout/SectionContainer.tsx
import React from 'react';

export const SectionContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`max-w-[1280px] mx-auto w-full px-4 md:px-6 ${className}`}>
      {children}
    </div>
  );
};