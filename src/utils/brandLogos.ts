export interface BrandLogoItem {
  src: string;
  alt: string;
}

const COMPANY_BRAND_LOGOS: Record<string, BrandLogoItem[]> = {
  autosol: [
    { src: '/brands/vw.png', alt: 'Volkswagen' },
  ],
  autolux: [
    { src: '/brands/toyota.png', alt: 'Toyota' },
  ],
  autociel: [
    { src: '/brands/peugeot.png', alt: 'Peugeot' },
    { src: '/brands/citroen.png', alt: 'Citroen' },
  ],
};

export function getCompanyBrandLogos(companyName: string): BrandLogoItem[] {
  return COMPANY_BRAND_LOGOS[companyName.trim().toLowerCase()] || [];
}
