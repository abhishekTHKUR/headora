"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"

import styles from "../../styles/Header.module.css"

interface QuickSearchProps {
  isSearchOpen: boolean
  toggleSearch: () => void
  searchText: string
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  isLoading: boolean
  searchResults: any[]
}

const QuickSearch: React.FC<QuickSearchProps> = ({
  isSearchOpen,
  toggleSearch,
  searchText,
  handleSearchChange,
  handleKeyDown,
  isLoading,
  searchResults,
}) => {
  if (!isSearchOpen) return null
console.log(searchResults,"searchResults")
  return (
    <div className={styles.searchContainer}>
      <div className={styles.inputWrapper}>
        {/* Search Icon */}
      
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

        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          value={searchText}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />

        {/* Clear (X) Icon */}
        <svg
                  onClick={toggleSearch}
                  style={{ cursor: "pointer" }}
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
      </div>

      {isLoading && <div className={styles.loading}>Loading...</div>}

      {searchResults.length > 0 && (
        <ul className={styles.searchResults}>
          {searchResults.map((item) => (
            <li key={item.id} className={styles.searchResultItem}>
              <Link href={`/${item.url_path}`}>
                <Image
                  src={item.image?.url.replace(/\/cache\/.*?\//, "/") || "/Images/prorate_place_holder.png"}
                  alt={item.name}
                  width={50}
                  height={50}
                  className={styles.searchResultImage}
                />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {searchText.length >= 2 && !isLoading && searchResults.length === 0 && (
        <div className={styles.noResults}>No results found</div>
      )}
    </div>
  )
}

export default QuickSearch
