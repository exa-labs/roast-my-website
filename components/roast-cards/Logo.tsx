// components/roast-cards/Logo.tsx
import Image from 'next/image';

export function ExaLogo() {
  return (
    <Image 
      src="/exa_logo.png" 
      alt="Exa AI Logo" 
      width={48} 
      height={48} 
      className="object-contain w-8 h-8 sm:w-12 sm:h-12"
    />
  );
}
