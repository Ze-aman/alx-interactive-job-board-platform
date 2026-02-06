import React from 'react';
import { SectionContainer } from '../layout/SectionContainer';
import { SearchBar } from './SearchBar';

export const Hero = () => {
  return (
    <div className="w-full bg-white border-b border-[#f0f2f4]">
      <SectionContainer className="py-16 md:py-24 flex flex-col items-center text-center">
        <h1 className="text-[#111418] text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
          Find your dream job <span className="text-[#137fec]">today</span>.
        </h1>
        <p className="text-[#617589] text-lg md:text-xl mb-12 max-w-2xl font-medium">
          Browse through thousands of open positions from top-tier tech companies and startups around the world.
        </p>
        <SearchBar />
      </SectionContainer>
    </div>
  );
};