import React from 'react';
import { SectionContainer } from './SectionContainer';

export const Footer = () => {
  return (
    <footer className="mt-24 border-t border-[#f0f2f4] bg-[#f8fafc] py-20">
      <SectionContainer className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="text-[#137fec] w-8 h-8"><svg fill="currentColor" viewBox="0 0 48 48"><path d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" /></svg></div>
            <h2 className="text-[#111418] text-2xl font-black">JobPortal</h2>
          </div>
          <p className="text-[#617589] text-base leading-relaxed mb-8 max-w-sm">Connecting the world's best talent with the most innovative companies on the planet.</p>
        </div>

        <div className="md:col-span-4">
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