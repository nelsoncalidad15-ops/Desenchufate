import React from 'react';
import { getCompanyBrandLogos } from '../utils/brandLogos';

interface BrandLogosProps {
  companyName: string;
  size?: 'sm' | 'md';
  monochrome?: boolean;
}

export const BrandLogos: React.FC<BrandLogosProps> = ({
  companyName,
  size = 'sm',
  monochrome = false,
}) => {
  const logos = getCompanyBrandLogos(companyName);

  if (logos.length === 0) return null;

  const wrapperClass = size === 'md' ? 'h-9 w-9 p-1.5' : 'h-7 w-7 p-1';
  const imageClass = monochrome ? 'opacity-80 grayscale contrast-125' : '';

  return (
    <div className="flex items-center gap-1.5">
      {logos.map((logo) => (
        <span
          key={`${companyName}-${logo.alt}`}
          className={`inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white shadow-2xs ${wrapperClass}`}
          title={logo.alt}
        >
          <img src={logo.src} alt={logo.alt} className={`max-h-full max-w-full object-contain ${imageClass}`} />
        </span>
      ))}
    </div>
  );
};
