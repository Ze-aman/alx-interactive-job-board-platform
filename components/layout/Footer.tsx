import React from 'react';
import Image from 'next/image';
import { SectionContainer } from './SectionContainer';

export const Footer = () => {
  return (
    <footer className="mt-24 border-t border-[#f0f2f4] bg-[#f8fafc] py-20">
      <SectionContainer className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3 mb-8">
            <Image src="/images/logo.png" alt="JobPortal logo" width={200} height={52} className="h-13 w-auto" priority />
          </div>
          <p className="text-[#617589] text-base leading-relaxed mb-8 max-w-sm">Connecting the world&apos;s best talent with the most innovative companies on the planet.</p>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <h4 className="font-black text-xs uppercase tracking-widest text-[#111418] mb-8">Subscribe</h4>
          <p className="text-sm font-semibold text-[#617589] mb-6">Get weekly job listings in your inbox.</p>
          <div className="flex gap-2">
            <input className="flex-1 bg-white border-[#f0f2f4] rounded-xl text-sm p-4 focus:ring-2 focus:ring-[#137fec] border-none shadow-sm" placeholder="Email" type="email" />
            <button className="bg-[#137fec] text-white p-4 rounded-xl shadow-lg hover:shadow-none transition-all">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
};