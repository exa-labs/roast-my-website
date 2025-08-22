/**
 * Comprehensive list of two-part Top Level Domains (TLDs)
 * These are country code domains that use two parts (e.g., co.uk, com.au)
 */
export const TWO_PART_TLDS = [
  // UK and British territories
  'co.uk', 'org.uk', 'net.uk', 'ac.uk', 'gov.uk',
  // India
  'co.in', 'org.in', 'net.in', 'ac.in', 'gov.in',
  // Australia
  'com.au', 'org.au', 'net.au', 'edu.au', 'gov.au',
  // Canada
  'co.ca', 'com.ca',
  // South Africa
  'co.za', 'org.za', 'net.za', 'ac.za', 'gov.za',
  // Japan
  'co.jp', 'or.jp', 'ne.jp', 'ac.jp', 'go.jp',
  // South Korea
  'co.kr', 'or.kr', 'ne.kr', 'ac.kr', 'go.kr',
  // Brazil
  'com.br', 'org.br', 'net.br', 'edu.br', 'gov.br',
  // New Zealand
  'co.nz', 'org.nz', 'net.nz', 'ac.nz', 'govt.nz',
  // Germany
  'co.de', 'com.de',
  // France
  'co.fr', 'com.fr',
  // Spain
  'com.es', 'org.es',
  // Italy
  'co.it', 'com.it',
  // Netherlands
  'co.nl',
  // China
  'com.cn', 'org.cn', 'net.cn', 'ac.cn', 'gov.cn',
  // Hong Kong
  'com.hk', 'org.hk', 'net.hk', 'edu.hk', 'gov.hk',
  // Singapore
  'com.sg', 'org.sg', 'net.sg', 'edu.sg', 'gov.sg',
  // Malaysia
  'com.my', 'org.my', 'net.my', 'edu.my', 'gov.my',
  // Thailand
  'co.th', 'or.th', 'ac.th', 'go.th',
  // Philippines
  'com.ph', 'org.ph', 'net.ph', 'edu.ph', 'gov.ph',
  // Indonesia
  'co.id', 'or.id', 'ac.id', 'go.id',
  // Vietnam
  'com.vn', 'org.vn', 'net.vn', 'edu.vn', 'gov.vn',
  // Mexico
  'com.mx', 'org.mx', 'net.mx', 'edu.mx', 'gob.mx',
  // Argentina
  'com.ar', 'org.ar', 'net.ar', 'edu.ar', 'gov.ar',
  // Chile
  'co.cl', 'com.cl',
  // Colombia
  'com.co', 'org.co', 'net.co', 'edu.co', 'gov.co',
  // Peru
  'com.pe', 'org.pe', 'net.pe', 'edu.pe', 'gob.pe',
  // Venezuela
  'co.ve', 'com.ve',
  // Russia
  'co.ru', 'com.ru',
  // Turkey
  'com.tr', 'org.tr', 'net.tr', 'edu.tr', 'gov.tr',
  // Israel
  'co.il', 'org.il', 'net.il', 'ac.il', 'gov.il',
  // UAE
  'co.ae', 'com.ae', 'org.ae', 'net.ae', 'ac.ae', 'gov.ae',
  // Saudi Arabia
  'com.sa', 'org.sa', 'net.sa', 'edu.sa', 'gov.sa',
  // Egypt
  'com.eg', 'org.eg', 'net.eg', 'edu.eg', 'gov.eg',
  // Nigeria
  'com.ng', 'org.ng', 'net.ng', 'edu.ng', 'gov.ng',
  // Kenya
  'co.ke', 'or.ke', 'ne.ke', 'ac.ke', 'go.ke',
  // Ghana
  'com.gh', 'org.gh', 'edu.gh', 'gov.gh'
];

/**
 * Cleans and normalizes a URL input to extract the main domain
 * Handles various URL formats, protocols, subdomains, and international TLDs
 * 
 * @param input - Raw URL input from user
 * @returns Clean domain name (e.g., "example.com" or "example.co.uk")
 * 
 * @example
 * cleanUrl("@https://www.blog.example.com/path") // returns "example.com"
 * cleanUrl("subdomain.company.co.uk") // returns "company.co.uk"
 */
export const cleanUrl = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // First, trim whitespace from the entire input
  let cleanedUrl = input.trim();
  
  // Remove leading @ symbol if present
  cleanedUrl = cleanedUrl.replace(/^@+/, '');
  
  // Remove protocol (http:// or https://)
  cleanedUrl = cleanedUrl.replace(/^https?:\/\//, '');
  
  // Remove www. prefix
  cleanedUrl = cleanedUrl.replace(/^www\./, '');
  
  // Extract just the domain (everything before the first slash)
  const domainMatch = cleanedUrl.split('/')[0];
  cleanedUrl = domainMatch || '';
  
  // Extract main domain from subdomains (e.g., blog.example.com -> example.com)
  const domainParts = cleanedUrl.split('.');
  if (domainParts.length > 2) {
    const lastTwoParts = domainParts.slice(-2).join('.');
    
    // Check if the last two parts form a known two-part TLD
    if (TWO_PART_TLDS.includes(lastTwoParts)) {
      // Keep the last three parts (domain + two-part TLD)
      cleanedUrl = domainParts.slice(-3).join('.');
    } else {
      // Keep only the last two parts (main domain + single TLD)
      cleanedUrl = domainParts.slice(-2).join('.');
    }
  }
  
  // Remove any remaining trailing dots or spaces
  cleanedUrl = cleanedUrl.replace(/[.\s]+$/, '');
  
  // Final trim
  cleanedUrl = cleanedUrl.trim();
  
  return cleanedUrl.toLowerCase();
};

/**
 * Validates if a cleaned URL represents a valid domain
 * 
 * @param cleanedUrl - The cleaned URL from cleanUrl function
 * @returns boolean indicating if the domain is valid
 */
export const isValidDomain = (cleanedUrl: string): boolean => {
  return !!(cleanedUrl && cleanedUrl.includes('.') && cleanedUrl.length >= 3);
};
