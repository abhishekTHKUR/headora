import React, { useState } from 'react';
import styles from '../../styles/Header.module.css';
import Image from 'next/image';
import Link from 'next/link';

function Header({ categoriesList }: any) {
  const [isMenuOpen, setMenuOpen] = useState<any>(false);
  const categories = categoriesList?.data?.categories?.items[0]?.children || [];
  console.log(categories, 'categories')

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  return (
    <nav className={styles.navbar}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href={'/'}>
            <Image
              src="/Logo/EcommerceLogo.png" 
              alt="Venia"
              width={120}
              height={35}
              className={styles.logo}
            />
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navItems}>
            {categories.map((category: any) => (
              <li key={category.uid} className={styles.navItem}>
                <Link href={`/${category.url_key}`}>
                {category.name}</Link>
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
                        className="icon-icon-_rq"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                    <ul className={styles.dropdown}>
                      {category.children.map((subCategory: any) => (
                        <li key={subCategory.uid}>
                          <Link href={`/${category.url_key}/${subCategory.url_key}`} >
                          {subCategory.name}
                          </Link>
                          {subCategory.children.length > 0 && (
                            <ul>
                              {subCategory.children
                                .slice(0, false ? subCategory.children.length : 4)
                                .map((SubSubCategory: any) => {
                                  return (
                                    <li
                                      key={SubSubCategory.uid}
                                     >
                                      <Link href={`/${category.url_key}/${subCategory.url_key}/${SubSubCategory.url_key}`}>
                                        {SubSubCategory.name}
                                      </Link>
                                    </li>
                                  )
                                })}
                              {subCategory.children.length > 4 && (
                                <li >
                                  <Link href={`/${category.url_key}/${subCategory.url_key}`}>
                                    View All
                                  </Link>
                                </li>
                              )}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>

        </nav>
        <div className={styles.actions}>
          <div className={styles.actionItem}>
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
          <div className={styles.actionItem}>
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            Sign In
          </div>
          <div className={styles.actionItem}>
            <Link href="/cart">
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
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </header>
    </nav>
  );
}

export default Header;
