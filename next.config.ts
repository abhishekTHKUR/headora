import type { NextConfig } from "next";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    magentoEndpoint: process.env.NEXT_PUBLIC_MAGENTO_ENDPOINT || '',
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || '',
    baseURLWithoutTrailingSlash: process.env.NEXT_PUBLIC_BASE_URL_WITHOUT_TRAILING_SLASH || '',
  },
  staticPageGenerationTimeout: 300000,
  trailingSlash: true,
  images: {
    domains: [new URL(process.env.NEXT_PUBLIC_MAGENTO_ENDPOINT || '').hostname], // Dynamically extract domain
  },
};

export default nextConfig;
