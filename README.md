# 🌟 Next.js Venia 

Welcome to the **Next.js Venia**! 🚀 This is a [Next.js](https://nextjs.org) theme with Magento 2. It’s a modern, **Progressive Web Application (PWA)** storefront built on top of **Magento 2**, utilizing Next.js and PWA Studio tools. 💡

## 📝 About the Theme

### 💥 Next.js Magento Venia Theme Overview

The **[Next.js Magento Venia Theme](https://wiki.ocodecommerce.com/en/Theme/overview)** is a headless eCommerce solution that brings the power of Magento’s GraphQL API together with a blazing-fast Next.js frontend. 🚀 This setup creates **fast**, **scalable**, and **SEO-friendly** eCommerce stores, while giving you the flexibility to customize the UI/UX to your heart's content. 🎨

![Logo](https://dev2.diamondtrov.com/media/home.png)

### 📄 **Next.js Magento Venia Theme Pages**

- **🏠 [Home Page](https://wiki.ocodecommerce.com/en/Theme/home-page)**  
  - Features **highlighted products**, **categories**, and **promotional banners** for a captivating shopping experience.  
  - **Super-fast performance** with quick-loading content for a seamless user experience.  
  - Dynamic **product recommendations** that engage users and drive sales. 💥  

- **🛒 [Category Page](https://wiki.ocodecommerce.com/en/Theme/category-page)**  
  - Displays all products within a specific category for easy browsing.  
  - Includes **advanced filtering** and **sorting** options to help customers find exactly what they need. 🔍  
  - **Pagination** and **quick product previews** for faster navigation. ⚡  

- **🔍 [Sub-Category Page](https://wiki.ocodecommerce.com/en/Theme/sub-category)**  
  - Showcases products within a more refined category structure for **focused browsing**.  
  - Helps users drill down into specific **product groups** with ease.  
  - Clean, **responsive layout** for a smooth and engaging shopping journey across all devices. 📱💻  

Would you like me to refine or expand on any section? 🚀

## 🚀 Key Features

* **📱 Progressive Web App (PWA):** Offline support, fast loading, and app-like experience
* **🔀 Dynamic Routing:** Supports multi-level categories and product pages
* **🔍 SEO Optimization:** Built-in support for meta tags, OpenGraph, and structured data (JSON-LD)
* **🔧 Filtering and Sorting:** Advanced product filtering and sorting capabilities
* **💻 Responsive Design:** Optimized for mobile, tablet, and desktop devices
* **🔗 Magento Integration:** Seamlessly integrates with Magento 2 via GraphQL API

## 🚀 Getting Started

### 🛠️ Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) 🌱
- **Yarn** (recommended for monorepo support) 🎯
- **Magento 2 instance** with **GraphQL API** enabled 🔗

# Installation and Setup Guide

## 📝[Installation](https://wiki.ocodecommerce.com/en/Theme/installation)

### Step 1: Clone the Repository

To get started, clone the Next.js GitHub repository using one of the following methods:

#### 🔒 HTTPS
```bash
git clone https://github.com/ocodecommerce/next-magento-theme.git
```

#### 🔑 SSH
```bash
git clone git@github.com:ocodecommerce/next-magento-theme.git
```

#### 🧑‍💻 GitHub CLI
```bash
gh repo clone ocodecommerce/next-magento-theme
```

Choose the method that best suits your workflow.

---

### Step 2: Create `.env`

Create a .env file in the root directory of the repository and replace the placeholders with your actual Magento endpoint, base URL, and logo URL.🌐

```typescript
# This variable will be used in the Next.js config file.
NEXT_PUBLIC_MAGENTO_ENDPOINT=<Your-Domain>/graphql
NEXT_PUBLIC_BASE_URL=<Your-Domain>/
NEXT_PUBLIC_BASE_URL_WITHOUT_TRAILING_SLASH=<Your-Domain>

# This variable will be used in the Magento config file.
DB_HOST=<db-host>
DB_NAME=<db-name>
DB_USERNAME=<db-username>
DB_PASSWORD=<db-password>
```

---

### Step 3: Install Dependencies
Ensure you have the following versions installed:


- Node.js v18.20.4 or higher 🖥️
- PHP v8.3.13 or higher 🐘
- Composer v2.7.8 or higher 📦

Run the following commands to install the necessary packages and start the development server:

### 🎉 Setup Frontend (Next.js)

```bash
cd next-magento-theme
npm install
npm run build
```
### 🛠️ Setup Backend (Magento)

```bash
cd next-magento-theme/magento
composer install
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy -f
php bin/magento cache:clean
sudo chmod 755 -R var pub generated
```

This will install all dependencies and start the theme on your local development server.

## 🗂️ theme Structure

```
next-venia/
├── components/          # Reusable UI components
├── graphql/            # GraphQL queries and client setup
├── magento/            # Magento extensions and pages
├── pages/              # Next.js pages and API routes
├── public/             # Static assets (images, fonts, etc.)
├── styles/             # Global and module-specific styles
├── utils/              # Utility functions and helpers
├── .env                # Environment variables
├── next.config.js      # Next.js configuration
├── package.json        # theme dependencies and scripts
└── README.md           # theme documentation
```

## 🌐 Useful Links

Here are some useful links to help you get the most out of this theme:

### 📚 PWA Studio Documentation
- **PWA Studio Overview**  
- **PWA Studio Beginner Guide**  
- **Tools and Libraries**  
- **PWA Studio Best Practices**  

### 🛍️ Venia Storefront
- **Venia Documentation**  
- **Venia UI Components**  

### 🔗 Magento Integration
- **Magento GraphQL API**  
- **Magento PWA Studio**  

---

## 🤝 Contributing

We ❤️ contributions from the community! If you'd like to contribute to this theme, please follow these steps:

1. **Fork** the repository
2. **Create a new branch** for your feature or bugfix
3. **Submit a pull request** with a detailed description of your changes

For more details, check out our **[Contribution Guide](CONTRIBUTION_GUIDE.md)**.

We can’t wait to see what you build! 🎉

## Deployment

### Vercel

The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

1. Install the Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy your theme:
```bash
vercel
```

3. Follow the prompts to complete the deployment.

For more details, refer to the Next.js Deployment Documentation.

## 💬 Join the Conversation

Got questions, concerns, or ideas? We’d love to hear from you! Join our community Slack channel and be part of the conversation:  
* **#pwa**  

Stay in the loop by adding our public calendar 📅 to keep track of events and announcements. Never miss an update! 🚀

---

## 🙏 Acknowledgments

This theme is inspired by the following:

* **Magento PWA Studio**: A powerful collection of tools for building PWAs on Magento ⚙️
* **Venia**: A reference storefront built with PWA Studio 🛒
* **Alpaca Theme**: A discontinued Magento 2 theme that influenced this theme's design and structure 🎨

---

## 📄 License

This theme is licensed under the **MIT License**. Feel free to use, modify, and contribute! 🎉
