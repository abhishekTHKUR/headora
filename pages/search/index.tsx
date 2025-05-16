import CategoriesProducts from '@/components/Category/CategoriesProducts';
import Filter from '@/components/Filters/Filter';
import styles from '../../styles/Search.module.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SearchProduct from '@/components/Search/SearchProduct';
import { Client } from '@/graphql/client'; // Import the client
import Pagination from '@/components/Category/pagination';
import Head from 'next/head';
import Image from 'next/image';

function Search() {
    const router = useRouter();
    const client = new Client();
    const [searchInput, setSearchInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<any>();
    const [currentPage, setCurrentPage] = useState<any>(1);

    console.log(searchResults, "searchResults for product page");
let filter = {};

    // Extract the slug from the router query
    const slug:any = router.query?.query;
    const page = Number(router.query?.page) || 1; // Default to page 1

      // Sync currentPage with the URL parameter
      useEffect(() => {
        setCurrentPage(page);
    }, [page]);


    // Fetch search results based on the slug
    const fetchSearchResults = async () => {
        if (slug) {
            setLoading(true);
            setSearchInput(slug as string); // Set the search input from slug

            try {
                const result = await client.fetchSearchProductResult(slug as string, currentPage, filter );
                setSearchResults(result);
            } catch (error) {

            } finally {
                setLoading(false);
            }
        }
    };

    // Fetch search results whenever slug or currentPage changes
    useEffect(() => {
        if (slug) {
            fetchSearchResults();
        }
    }, [slug, currentPage]); // Trigger search when slug or page changes

    // Handle search input submission
  const handleSearch = () => {
        if (searchInput.trim()) {
            router.push(`/search/?query=${encodeURIComponent(searchInput.trim())}&page=1`);
        }
    };

    // Handle page change for pagination
    const handlePageChange = (page: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        router.push(`/search/?query=${encodeURIComponent(slug)}&page=${page}`);
    };
      // Handle Enter key press for search
      const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && searchInput.trim()) {
            router.push(`/search/?query=${encodeURIComponent(searchInput.trim())}&page=1`);
        }
    };

    return (
        <>
            <Head>
                <title>{`Search results for ${slug} - LuxyVerse`}</title>
                <meta
                    name="description"
                    content={`Find the best products for ${slug} in our store. Shop now from a wide variety of products.`}
                />
                <meta name="keywords" content={`search, ${slug}, products, brands`} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Search results for ${slug} - LuxyVerse`} />
                <meta
                    property="og:description"
                    content={`Explore a wide range of products related to ${slug}. Discover the best deals today.`}
                />
                {/* <meta property="og:image" content="/path/to/default-image.jpg" /> */}
                <meta property="og:url" content={`${process.env.baseURL}search?query=${encodeURIComponent(slug as string)}`} />
                <meta property="og:site_name" content="LuxyVerse" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`Search results for ${slug} - LuxyVerse`} />
                <meta
                    name="twitter:description"
                    content={`Explore products related to ${slug} on LuxyVerse. Get the best offers now.`}
                />
                {/* <meta name="twitter:image" content="/path/to/default-image.jpg" /> */}
            </Head>
            <div className={styles.navBarSpace}></div>
            <div className={styles.SearchPageMainContainer}>
    <div className={styles.headerContainer}>
        <div className={styles.searchContainer}>
            <Image
                src="/Images/SearchIcon.png"
                alt="SearchIcon"
                width={35}
                height={25}
                style={{ filter: 'invert()', paddingRight: '10px' }}
            />
            <input
                type="text"
                className={styles.searchInput}
                placeholder="Search for products, brands, and more..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
                Search
            </button>
        </div>

        <div className={styles.resultCount}>
            {loading ? (
                <p className={styles.textLoading}>Loading...</p>
            ) : (
                <p>
                    {searchResults?.products?.total_count
                        ? `Showing result for ${slug}: ${searchResults?.products?.total_count} items`
                        : `No results found for ${slug}.`}
                </p>
            )}
        </div>
    </div>
    {/* <Filter
        isSortListHovered={isSortListHovered}
        activeSortField={activeSortField}
        toggleDropdown={toggleDropdown}
        handleCheckboxChange={handleCheckboxChange}
        handleFilterClick={handleFilterClick}
        handleSortOptionClick={handleSortOptionClick}
        handleSortListHover={handleSortListHover}
        categoriesData={categoriesData}
        openDropdown={openDropdown}
        selectedOptions={selectedOptions}
        isFilterOpen={isFilterOpen}
        productCount={productCount}
        filters={filters}
        filterOptions={filterOptions}
        setSelectedSortOption={setSelectedSortOption}
        selectedSortOption={selectedSortOption}
        setIsFilterOpen={setIsFilterOpen}
        activeFilters={activeFilters}
        handleRemoveFilter={handleRemoveFilter}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        handlePriceChange={handlePriceChange}
        highestPrice={highestPrice}
        lowestPrice={lowestPrice}
      /> */}
    {!loading && (
        <>
            <SearchProduct productsData={searchResults?.products?.items} />
            <Pagination
                totalPages={searchResults?.products?.page_info?.total_pages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
            />
        </>
    )}
</div>

         
        </>
    );
}

export default Search;
