// components/roast-cards/Logo.tsx
import Image from 'next/image';

export function ExaLogo() {
  return (
    <Image 
      src="/exa_logo.png" 
      alt="Exa AI Logo" 
      width={64} 
      height={64} 
      className="object-contain w-10 h-10 sm:w-16 sm:h-16"
    />
  );
}
