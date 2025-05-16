import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  reactStrictMode: true,
  

  env: {
    magentoEndpoint: '', // magento endpoint
    baseURL:'', // baseURL of your site with  trailing slash 
    baseURLWithoutTrailingSlash:'', // baseURL of your site without trailing slash 
    SecondStoreURL: '',
    logoURL: '', // if you don't have Logo then leave it blank. 
    logoText: '', // if you don't have Logo then you can simply site name 
    siteName: '' // your site name
  },  

  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase request payload limit
    },
  },
  staticPageGenerationTimeout: 300000,
  output: 'export',
  trailingSlash: true, // Ensures static files have .html

  images: {
    unoptimized: true,
  }

};

export default nextConfig;