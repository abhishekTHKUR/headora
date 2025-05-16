"use client"

interface Category {
  uid: string
  name: string
  url_key: string
  children: Category[]
}

interface MobileHeaderProps {
  categoriesList: {
    data?: {
      categories?: {
        items?: Array<{
          children?: Category[]
        }>
      }
    }
  }
}

import type React from "react"
import { useEffect, useRef, useState } from "react"
import styles from "../../styles/MobileHeader.module.css"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import Ribbon from "../Ribbon/Ribbon"
import QuickSearch from "../Search/QuickSearch"
import { Client } from "@/graphql/client"

const MobileHeader = ({ categoriesList }: any) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const categories = categoriesList?.data?.categories?.items[0]?.children || []
  const router = useRouter()
  const navRef = useRef<HTMLDivElement>(null)

  const [isSearchOpen, setSearchOpen] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>("")
  const [searchResults, setSearchResults] = useState<any[]>([])
   const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false)
  const [cartCount, setCartCount] = useState<any>(0);
   const [showCartBag, setShowCartBag] = useState(false);
    const client = new Client();
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setCurrentCategory(null)
  }

  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen)
  }
 // Fetch search suggestions dynamically
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);

    if (text.length >= 2) {
      // Trigger search for 2+ characters
      setLoading(true);

      const data = await client.fetchSearchResult(text, 1);
      setSearchResults(data.products?.items || []);
      setLoading(false);
    } else {
      setSearchResults([]); // Clear results if input is cleared
    }
  };


  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchText.trim()) {
      // Blur the input to close the keyboard on mobile


      setTimeout(() => {
        (event.target as HTMLInputElement).blur();
        router.push(`/search/?query=${encodeURIComponent(searchText.trim())}`);
        toggleSearch(); // Optionally close the search modal after the user presses Enter
      }, 2000);
    }
  };
    //================================= Cart Count ===============================
    
    
      function handleStorageChange() {
        let newcartCount: any = localStorage.getItem('cartCount') ? localStorage.getItem('cartCount') : 0
        let newwshowcartBag: any = localStorage.getItem('showcartBag') ? localStorage.getItem('showcartBag') : "false"
    
        if (parseInt(newcartCount) > 0) {
          setCartCount(parseInt(newcartCount))
          if (newwshowcartBag == "true") {
            localStorage.setItem('showcartBag', "false")
            setShowCartBag(true)
    
          }
    
        }
      }
      useEffect(() => {
        let newcartCount: any = localStorage.getItem('cartCount') ? localStorage.getItem('cartCount') : 0
        if (parseInt(newcartCount) > 0) {
          setCartCount(parseInt(newcartCount))
        }
      }, []);
    
      useEffect(() => {
        window.addEventListener('storage', handleStorageChange)
      }, [])
      
      const toggleCartBag = () => {
        setShowCartBag(!showCartBag)
      }
      const updateCartCount = (newcartCount: any) => {
        localStorage.setItem('cartCount', newcartCount)
        if (parseInt(newcartCount) > 0) {
          setCartCount(parseInt(newcartCount))
        }
        setShowCartBag(true)
      }

 
  const handleCategoryClick = (category: Category) => {
    if (category.children.length == 0) {
      setCurrentCategory(null)
      router.push(`/${category.url_key}`)
      setTimeout(() => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
      }, 500)
    } else {
      setCurrentCategory(category)
    }
  }

  const handleBackClick = () => {
    setCurrentCategory(null)
  }
  const handleCloseFilterModal = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the clicked element is the overlay itself
    if ((e.target as HTMLDivElement).classList.contains(styles.overlay)) {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    }
  }
  function handleTopCategoryOpen(urlKey: any) {
    router.push(`/${urlKey}`)

    setTimeout(() => {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    }, 500)
  }
  function handleSubCategoryOpen(urlKey: any) {
    router.push(urlKey)

    setTimeout(() => {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    }, 500)
  }

  return (
    <nav className={styles.navbar}>
      <div
        className={`${styles.overlay} ${isMobileMenuOpen ? styles.overlayActive : ""}`}
        onClick={handleCloseFilterModal}
      />
      <header className={styles.header}>
        <div className={styles.mobileMenuIcon} onClick={toggleMobileMenu}>
          {!isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          )}
        </div>

        <div className={styles.logo}>
          <Link href={"/"}>
            {process.env.logoURL?.length == 0 ? (
              `${process.env.logoText}`
            ) : (
              <Image src={`${process.env.logoText}`} alt="Logo" width={120} height={35} className={styles.logo} />
            )}
          </Link>
        </div>

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileNavActive : ""}`}>
          <div>
            {!currentCategory ? (
              <>
                <div className={styles.mobileMenuHeader}>
                  <div className={styles.closeIcon} onClick={toggleMobileMenu}>
                    ×
                  </div>
                  <span>Main Menu</span>
                </div>
                <ul className={styles.navItems}>
                  {categories.map((category: Category) => (
                    <li key={category.uid} className={styles.navItem} onClick={() => handleCategoryClick(category)}>
                      <span onClick={() => handleTopCategoryOpen(category.url_key)}>{category.name}</span>
                      {category.children.length > 0 && <span className={styles.mobileArrow}>›</span>}
                    </li>
                  ))}
                     <li className={styles.navItem}>
        <Link href={`/sell-old-used-jewelry-watches-online`} style={{fontSize:'16px'}}>SELL</Link>
        </li>
                </ul>
              </>
            ) : (
              <>
                <div className={styles.mobileMenuHeader}>
                  <div className={styles.closeIcon} onClick={handleBackClick}>
                    ‹
                  </div>
                  <span>Main Menu</span>
                </div>
                <ul className={styles.navItems}>
                  {currentCategory.children.map((subCategory: Category) => (
                    <li
                      key={subCategory.uid}
                      className={styles.navItem}
                      onClick={() => {
                        handleSubCategoryOpen(`/${currentCategory.url_key}/${subCategory.url_key}`)
                      }}
                    >
                      {subCategory.name}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className={styles.bottomContainer}>
       
            <div className={styles.signContainer}>
              <p>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon-icon-_rq"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>{" "}
                Account
              </p>
              <span><Link href="/customer/account/login/">Sign In </Link> | <Link href={"/customer/account/create/"}>Sign Up</Link></span>
            </div>
          </div>
        </nav>

        <div className={styles.actions}>
          <div className={styles.actionItem} onClick={toggleSearch}>
            <span className={styles.icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
          <div className={styles.actionItem}>
            <Link href="/cart">
              <span className={styles.icon} onClick={toggleCartBag}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                    {parseInt(cartCount) > 0 && <span className={styles.cartCountNumber}>{cartCount}</span>}
              </span>
            </Link>
          </div>
        </div>
      </header>
      {isSearchOpen && (
        <QuickSearch
          isSearchOpen={isSearchOpen}
          toggleSearch={toggleSearch}
          searchText={searchText}
          handleSearchChange={handleSearchChange}
          handleKeyDown={handleKeyDown}
          isLoading={isLoading}
          searchResults={searchResults}
        />
      )}
    </nav>
  )
}

export default MobileHeader
