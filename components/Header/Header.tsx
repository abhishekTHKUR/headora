import React, { useEffect, useState } from "react";
import styles from "../../styles/Header.module.css";
import Image from "next/image";
import Link from "next/link";
import { Client } from "@/graphql/client";
import CartBag from "./CartBag";
import { useRouter } from "next/router";
import QuickSearch from "../Search/QuickSearch";


function Header({ categoriesList, 
   BoutiqueCategoriesList
}: any) {
 

  const [isSearchOpen, setSearchOpen] = useState<boolean>(false); // New state for search input
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]); // Store search results
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCartBag, setShowCartBag] = useState(false);
  const [cartCount, setCartCount] = useState<any>(0);
   const categories =  categoriesList?.data?.categories?.items[0]?.children || [] 
  const client = new Client();
  const router = useRouter();




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
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen); // Toggle search input visibility
  };
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

  console.log(searchResults,"searchResults")
  return (
    <nav className={styles.navbar}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href={"/"}>
            <Image
              src={
                isScrolled
                  ? "/Logo/EcommerceLogo.png"
                  : "/Logo/EcommerceLogo.png"
              }
              alt={isScrolled ? "Monogram" : "Full Logo"}
              width={isScrolled ? 60 : 200}
              height={isScrolled ? 60 : 40}
              className={styles.logo}
            />
          </Link>
        </div>
        <nav className={styles.nav}>
        <ul className={styles.navItems}>
        {categories
        .filter((category: any) => category.product_count > 0)
        .map(
          (category: any) =>
            category.children.length > 0 && (
              <li key={category.uid} className={styles.navItem}>
                <Link href={`/${category.url_path}`}>{category.name}</Link>
                {category.children.length > 0 && (
                  <>
                    <span className={styles.icon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                    <div className={styles.dropdown}>
                      <div className={styles.megaMenuContainer}>
                        <div
                          className={`${styles.categoryGrid} ${category.children.length <= 4 ? styles.fewCategories : ""}`}
                          style={{ gap: category.name.toLowerCase() == "brands" ? "10px" : undefined }}
                        >
                         {category.children
                            .filter((subCategory: any) => subCategory.product_count > 0)
                            .map((subCategory: any) => (
                              <div key={subCategory.uid} className={styles.categoryColumn}>
                              <span className={styles.categoryTitle}>
                                <Link href={`/${subCategory.url_path}`}>{subCategory.name}</Link>
                              </span>
                              {subCategory.children.length > 0 && (
                                <ul className={styles.subCategoryList}>
                                  {subCategory.name.toLowerCase() !== "brand" &&
                                    subCategory.children
                                      .filter((SubSubCategory: any) => SubSubCategory.product_count > 0)
                                      .slice(0, false ? subCategory.children.length : 4)
                                      .map((SubSubCategory: any) => (

                                        <li key={SubSubCategory.uid} 
                                        style={{ padding: category.name.toLowerCase() == "brands" ? "0px" : undefined }}
                                        >
                                      
                                            {category.name.toLowerCase() !== "brands" ? <Link href={`/${SubSubCategory.url_path}`}>{SubSubCategory.name}</Link> :null}
                                      
                                        </li>
                                      ))}
                                  {subCategory.children.length > 4 && (
                                    <li className={styles.viewAllLink}>
                                      <Link href={`/${subCategory.url_path}`}>View All</Link>
                                    </li>
                                  )}
                                </ul>
                              )}
                            </div>
                          ))}


                        </div>
                        <div className={styles.bannerColumn}>
                          <img
                            src={category.image || "/Images/Affirm banner.png"}
                            alt={`${category.name} Banner`}
                            className={styles.bannerImage}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ),
        )}
        <li>
        <Link href={`/sell-old-used-jewelry-watches-online`} style={{fontSize:'11px'}}>SELL</Link>
        </li>
  <li>
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
          className="icon-icon-_rq"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </span>
      Search
    </div>
  </li>
</ul>

        </nav>
        <div className={styles.actions}>

          {/* ================================= Quick Search================================ */}
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
        
          <div className={styles.actionItem}>
            {/* <Link href="/cart"> */}
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
                  className="icon-icon-_rq"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {parseInt(cartCount) > 0 && <span className={styles.cartCountNumber}>{cartCount}</span>}
              </span>
            {/* </Link> */}
          </div>
        </div>
      </header>
      {showCartBag && <CartBag showCartBag={showCartBag} toggleCartBag={toggleCartBag} updateCartCount={updateCartCount} />}
    </nav>
  );
}

export default Header;
