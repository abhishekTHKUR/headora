import React, { useCallback, useEffect, useState } from 'react'
import { Currency } from '../Currency/currency';
import styles from '../../styles/Categories.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Pagination from './pagination';
import Filter from '../Filters/Filter';
import Link from 'next/dist/client/link';


let filterOptions: any = []

const productsPerPage = 20;
function CategoriesProducts({ productsData, categoriesData, Data, categoryDetail }: any) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [displayedProducts, setDisplayedProducts] = useState<any>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState<any>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 80000]);

  const [highestPrice, setHighestPrice] = useState<number>(0);
  const [lowestPrice, setLowestPrice] = useState<number>(0);
  // ====================Filters State Management==============

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [productCount, setProductCount] = useState<any>('')

  const [isSortListHovered, setIsSortListHovered] = useState<any>(false);
  const [activeSortField, setActiveSortField] = useState<any>('');
  const [filters, setFilters] = useState<any>({})
  const [selectedSortOption, setSelectedSortOption] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});
  const [steps, setSteps] = useState<number[]>([]);
  useEffect(() => {
    const calculatePriceRange = (products: any[]) => {
      if (products.length === 0) {
        setHighestPrice(0);
        setLowestPrice(0);

        return;
      }

      const prices = products.map((product) => {
        return (
          product?.price?.regularPrice?.amount?.value ??
          product?.variants?.[0]?.product?.price_range?.maximum_price?.final_price?.value ??
          0
        );
      });

      const highest = Math.round(Math.max(...prices) / 10) * 10; // Round to nearest tens
      const lowest = Math.round(Math.min(...prices) / 10) * 10;   // Round to nearest tens
      const middle = Math.round((highest + lowest) / 20) * 10;   // Calculate middle, then round

      setHighestPrice(highest);
      setLowestPrice(lowest);

    };

    calculatePriceRange(productsData);
  }, [productsData]);


  // When component mounts, check URL for page parameter
  useEffect(() => {
    // Parse page from query, default to 1 if not present
    const pageFromQuery = router.query.page
      ? parseInt(router.query.page as string, 10)
      : 1;

    // Ensure page is within valid range
    const safePage = pageFromQuery > totalPages
      ? 1
      : pageFromQuery;

    setCurrentPage(safePage);
  }, [router.query, totalPages]);
  // ===========================BreadCrumbs Management=======================================

  const { slug, slug2, slug3, ...rest } = router.query;

  // Get all slugs from query
  const slugs = [slug, slug2, slug3, ...Object.values(rest)].filter(Boolean);

  // Create breadcrumb array dynamically
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    ...slugs.map((slugPart: any, index) => ({
      name: slugPart.replace(/-/g, ' '),
      path: `/${slugs.slice(0, index + 1).join('/')}`,
    })),
  ];
  // Store breadcrumbs in session storage on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('breadcrumbs', JSON.stringify(breadcrumbs));
    }
  }, [breadcrumbs]);

  // ===================================Filter==============================================

  function getForMatted(str: any) {
    str = str.replace(/[()]/g, "");
    return str.replaceAll(' ', '_').toLowerCase()
  }

  if (categoriesData?.products.aggregations) {
    filterOptions = []
    categoriesData?.products?.aggregations.forEach((element: any) => {
      filterOptions.push({ label: element?.label, value: getForMatted(element?.label) })
    });

  }

  useEffect(() => {
    // This effect runs on component mount and when `categoriesData` changes
    setSelectedOptions({});
  }, []);

  useEffect(() => {
    // Function to check if the screen size is less than 650px
    const handleResize = () => {
      setIsMobile(window.innerWidth < 650);
    };

    // Initial check
    handleResize();

    // Add event listener for screen resizing
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Update products based on the current page and sorting
  useEffect(() => {
    if (productsData && productsData.length > 0) {
      applySorting(productsData, selectedSortOption);
    }
  }, [productsData, currentPage, selectedSortOption]);


  useEffect(() => {
    // Avoid conditional useEffect calls, run logic inside the hook
    if (productsData && productsData.length > 0) {
      applyProductFilter(filters);
    } else {
      // Reset products if there are none
      setDisplayedProducts([]);
      setProductCount(0);
      setTotalPages(1);
    }
  }, [productsData, currentPage, filters]);

  useEffect(() => {
    // Adjust query based on the page, avoid conditional hook calls
    const { page, ...restQuery } = router.query;
    if (currentPage === 1) {
      router.push({ pathname: router.pathname, query: restQuery }, undefined, { shallow: true });
    } else {
      router.push({ pathname: router.pathname, query: { ...router.query, page: currentPage } }, undefined, { shallow: true });
    }
  }, []);

  useEffect(() => {
    // Always call the hook and handle logic inside
    const queryFilters: any = { ...router.query };
    let initialFilters: any = {};
    Object.keys(queryFilters).forEach((key) => {
      if (queryFilters[key]) {
        initialFilters[key] = queryFilters[key].split(',');
      }
    });

    setFilters(initialFilters);


    if (productsData && productsData.length > 0) {
      applyProductFilter(initialFilters);
    }
  }, [router.query]);

  useEffect(() => {
    // Function to check screen size
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
    };

    // Check screen size on component mount
    checkScreenSize();

    // Add resize event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);


  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };
  const closeDropDown = () => {
    setOpenDropdown(null);
  };



  // Define filter outside of the function to retain its state between calls
  const handleCheckboxChange = (aggregationLabel: string, optionValue: string, isChecked: boolean) => {
    let filter: { [key: string]: string[] } = filters;

    filterOptions.forEach((option: any) => {
      if (option.label === aggregationLabel) {
        const key = option.value;

        if (!filter[key]) {
          filter[key] = [];
        }

        if (isChecked) {
          // Add to active filters
          setActiveFilters((prev) => [
            ...prev,
            { label: aggregationLabel, value: optionValue },
          ]);

          if (!filter[key].includes(optionValue)) {
            filter[key].push(optionValue);
          }
        } else {
          // Remove from active filters
          setActiveFilters((prev) =>
            prev.filter((item) => item.label !== aggregationLabel || item.value !== optionValue)
          );

          filter[key] = filter[key].filter((value) => value !== optionValue);

          if (filter[key].length === 0) {
            delete filter[key];
          }
        }
      }
    });

    applyProductFilter(filter);
  };

  const handleRemoveFilter = (filterToRemove: any) => {
    setActiveFilters((prev) =>
      prev.filter(
        (filter) =>
          filter.label !== filterToRemove?.label || filter?.value !== filterToRemove?.value
      )
    );

    // Uncheck the corresponding filter
    filterOptions.forEach((option: any) => {
      if (option?.label === filterToRemove?.label) {
        const key = option.value;
        filters[key] = filters[key]?.filter((value: string) => value !== filterToRemove?.value);

        if (filters[key].length === 0) {
          delete filters[key];
        }
      }
    });

    applyProductFilter(filters);
  };
  const updateUrlWithFilters = (filters: any) => {
    // Create a query object based on filters
    const query = { ...router.query };
    // For each filter, add it to the query
    Object.keys(filters).forEach((filterKey) => {
      if (filters[filterKey].length > 0) {
        query[filterKey] = filters[filterKey].join(',');
      } else {
        delete query[filterKey];
      }
    });
    // Update the URL query parameters without refreshing the page
    router.push(
      {
        pathname: router.pathname,
        query: query,
      },
      undefined,
      { shallow: true } // To prevent full page reload
    );
  };






  const handleSortOptionClick = (value: string) => {
    setActiveSortField(value);

  };

  const handleSortListHover = (isHovered: boolean) => {
    setIsSortListHovered(isHovered);
  };

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Check if any aggregations exist and if the label is not null or 0
  const hasValidAggregations = categoriesData?.products?.aggregations?.some(
    (aggregation: any) => aggregation.label && aggregation.label !== '0'
  );

  if (!hasValidAggregations) {
    return null;
  }

  const applyProductFilter = (filter: any) => {
    let products = [...productsData];

    // Loop through filter options dynamically
    for (const { value } of filterOptions) {
      if (filter[value]) {
        if (value === "price") {
          // Special case for price filter
          const [minPrice, maxPrice] = filter[value]; // Use slider values directly
          products = products.filter((product) => {
            const price =
              product?.price?.regularPrice?.amount?.value ||
              product.variants?.[0]?.product?.price_range?.maximum_price?.final_price?.value;

            return price >= minPrice && price <= maxPrice;
          });
        } else {
          // Generic filter logic for all other attributes
          const options = filter[value];
          products = products.filter((product) =>
            options.includes(product[value] + "")
          );
        }
      }
    }



    // Update state with filtered products
    setProductCount(products.length);

    // Handle Pagination
    const totalPages = Math.ceil(products.length / productsPerPage);
    setTotalPages(totalPages);

    // Ensure current page is not out of bounds after filtering
    const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;

    const indexOfLastProduct = safeCurrentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    setDisplayedProducts(products.slice(indexOfFirstProduct, indexOfLastProduct));
  };
  useEffect(() => {
    if (categoriesData?.products?.aggregations?.length > 0) {
      const firstGroupLabel = categoriesData.products.aggregations[0].label;
      setOpenGroups({ [firstGroupLabel]: true });
    }
  }, [categoriesData]);
  const toggleGroup = (groupLabel: string) => {
    setOpenGroups((prev) => {
      const isCurrentlyOpen = prev[groupLabel];
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>);

      if (!isCurrentlyOpen) {
        newState[groupLabel] = true;
      }

      return newState;
    });
  };

  const isChecked = (label: any, value: any) => {
    let key = "";
    for (let i = 0; i < filterOptions.length; i++) {
      if (filterOptions[i].label === label) {
        key = filterOptions[i].value;
      }
    }
    return filters[key]?.includes(value) || false;
  };


  const handlePriceChange = (newPriceRange: [number, number]) => {
    setPriceRange(newPriceRange);
    applyProductFilter({ ...filters, price: newPriceRange });
  };
  function regularPrice(item: any) {
    let final_price = item?.price_range?.maximum_price?.final_price?.value.toLocaleString();
    let regular_price = item?.price_range?.maximum_price?.regular_price?.value.toLocaleString();
    let currency: any = item?.price?.regularPrice?.amount?.currency;
    if (regular_price != final_price) {
      return `${Currency[currency]}${regular_price}`
    } else {
      return ''
    }
  }
  function finalPrice(item: any) {
    let final_price = item?.price_range?.maximum_price?.final_price?.value.toLocaleString();
    let currency: any = item?.price?.regularPrice?.amount?.currency
    return `${Currency[currency]}${final_price}`
  }

  function getconfigurablePrice(item: any) {
    let price = item?.price_range?.maximum_price?.regular_price?.value?.toLocaleString();
    let regular_price = item?.price_range?.maximum_price?.regular_price?.value?.toLocaleString();
    let currency: any = item?.price_range?.maximum_price?.regular_price?.currency;

    if (regular_price != price) {
      return `${Currency[currency]} ${price}`;
    } else {
      return ''
    }
  }
  function configurableFinalPrice(item: any) {
    let final_price = item?.price_range?.maximum_price?.final_price?.value?.toLocaleString();
    let currency: any = item?.price_range?.maximum_price?.regular_price?.currency;
    return `${Currency[currency]}${final_price}`
  }




  // ===========================Sorting=====================

  const applySorting = (products: any[], sortOption: string) => {
    let sortedProducts = [...products]; // Copy the products array

    switch (sortOption) {
      case 'priceHighToLow':
        sortedProducts.sort((a, b) => {
          const aPrice =
            a?.price?.regularPrice?.amount?.value ??
            a?.variants?.[0]?.product?.price_range?.maximum_price?.final_price?.value ??
            0;
          const bPrice =
            b?.price?.regularPrice?.amount?.value ??
            b?.variants?.[0]?.product?.price_range?.maximum_price?.final_price?.value ??
            0;
          return bPrice - aPrice;
        });
        break;

      case 'priceLowToHigh':
        sortedProducts.sort((a, b) => {
          const aPrice =
            a?.price?.regularPrice?.amount?.value ??
            a?.variants?.[0]?.product?.price_range?.maximum_price?.final_price?.value ??
            0;

          const bPrice =
            b?.price?.regularPrice?.amount?.value ??
            b?.variants?.[0]?.product?.price_range?.maximum_price?.final_price?.value ??
            0;

          return aPrice - bPrice;
        });
        break;

      case 'productNameAtoZ':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case 'productNameZtoA':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;

      default:
        // No sorting if 'none' is selected
        break;
    }

    setDisplayedProducts(
      sortedProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      )
    );
    setTotalPages(Math.ceil(sortedProducts.length / productsPerPage));
  };




  // Handle page change
  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL with new page number
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page }
      },
      undefined,
      { shallow: true } // Prevents full page reload
    );

    setCurrentPage(page);
  };



  return (
    <>
      <Filter
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
      />
      {productsData.length > 0 ? (
        <div className={styles.allProductContainer} >
          <div className={styles.filterContainer}>
            <div className={styles.filterModal} style={{ zIndex: 'unset' }}>
              <div className={styles.filterHeader}>
                <h4>Filter By</h4>

              </div>

              <div className={styles.filterContent} >
                <div
                  className={styles.filterGroup}
                  style={{ borderBottom: activeFilters.length === 0 ? "none" : "" }}
                >
                  <div
                    className={styles.filterLabelContainer}
                    style={{ padding: activeFilters.length === 0 ? "0" : "" }}
                  >
                    {activeFilters.map((filter: any, index: any) => {
                      const label = categoriesData?.products?.aggregations?.flatMap((aggregation: any) =>
                        aggregation.options
                      ).find((option: any) => option.value === filter.value)?.label;

                      return (
                        <span key={index} className={styles.filterGroupLabel}>
                          {filter.label}: {label || "Unknown"}
                          <button
                            className="remove-filter"
                            onClick={() => handleRemoveFilter(filter)}
                          >
                            &times;
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {categoriesData?.products?.aggregations
                  .filter((aggregation: any) => aggregation.label !== "Category")
                  .map((aggregation: any) => (
                    <div key={aggregation.label} className={styles.filterGroup}>
                      {/* Clickable Group Title to Toggle Dropdown */}
                      <h5
                        className={styles.filterGroupTitle}
                        onClick={() => toggleGroup(aggregation.label)}
                      >
                        {aggregation.label}
                        <span className={styles.dropdownArrow}>
                          {openGroups[aggregation.label] ? <Image src='/Images/up-arrow.png' alt='Up Arrow' height={10} width={10} /> : <Image src='/Images/down-arrow.png' alt='Up Arrow' height={10} width={10} />}
                        </span>
                      </h5>

                      {/* Dropdown Content */}
                      {openGroups[aggregation.label] &&
                        // (aggregation.label === "Price" ? (
                        //   <div className={styles.sliderContainer}>
                        //     <div className={styles.PriceInputWrapper}>
                        //       <input
                        //         type="range"
                        //         min={steps[0]}
                        //         max={steps[steps.length - 1]}
                        //         step={100}
                        //         value={priceRange[0]}
                        //         onChange={(e) => handlePriceChange([+e.target.value, priceRange[1]])}
                        //         className={styles.slider}
                        //       />
                        //       <input
                        //         type="range"
                        //         min={steps[0]}
                        //         max={steps[steps.length - 1]}
                        //         step={100}
                        //         value={priceRange[1]}
                        //         onChange={(e) => handlePriceChange([priceRange[0], +e.target.value])}
                        //         className={styles.slider}
                        //       /></div>
                        //     <div className={styles.priceLabels}>
                        //       <span>$ {priceRange[0]}</span><span> - </span>
                        //       <span>$ {priceRange[1]}</span>
                        //     </div>
                        //   </div>
                        // ) : (
                          <div className={styles.filterOptionsGrid}>
                            {aggregation.options.map((option: any) => (
                              <label key={option.value} className={styles.filterOption}>
                                <input
                                  type="checkbox"
                                  value={option.value}
                                  checked={isChecked(aggregation.label, option.value)}
                                  onChange={(e: any) =>
                                    handleCheckboxChange(aggregation.label, option.value, e.target.checked)
                                  }
                                />
                                {option.label}
                              </label>
                            ))}
                          </div>
                        // ))
                        }
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className={styles.products}>
            <div className={styles.watchGrid}>
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product: any, index: number) => {
                  let selectedVariant = null;

                  if (product?.__typename === "ConfigurableProduct") {
                    const optionValueIndex = product?.configurable_options?.[0]?.values?.[0]?.value_index;
                    selectedVariant = product?.variants.find((variant: any) =>
                      variant.attributes.some((attribute: any) => attribute.value_index === optionValueIndex)
                    );
                  }

                  const variantProduct = selectedVariant?.product || product;

                  return (
                    <React.Fragment key={index}>

                      <Link

                        href={`/product/${product.url_key}`}
                        key={variantProduct.id}
                        className={styles.watchItem}
                      >
                        <Image
                          src={
                            variantProduct?.media_gallery?.length > 0 && variantProduct?.media_gallery?.[0]?.url
                              ? variantProduct?.media_gallery?.[0]?.url.includes("cache")
                                ? variantProduct?.media_gallery?.[0]?.url.replace(/\/cache\/.*?\//, "/")
                                : variantProduct?.media_gallery?.[0]?.url
                              : variantProduct?.image?.url
                                ? variantProduct.image.url.includes("cache")
                                  ? variantProduct.image.url.replace(/\/cache\/.*?\//, "/")
                                  : variantProduct.image.url
                                : ""
                          }
                          alt={variantProduct.name}
                          width={500}
                          height={500}
                        />

                        <span style={{ textDecoration: 'none' }}>{variantProduct.name}</span>

                        <p className={styles.price}>
                          <span className={styles.special}>
                            {product.__typename === "ConfigurableProduct"
                              ? configurableFinalPrice(selectedVariant?.product)
                              : finalPrice(variantProduct)}
                          </span>
                          <span className={styles.regular}>
                            {product.__typename === "ConfigurableProduct"
                              ? getconfigurablePrice(selectedVariant?.product)
                              : regularPrice(variantProduct)}
                          </span>

                        </p>
                        <div className={styles.actionContainer}>
                          <button className={styles.addToCartButton}>add to cart</button>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon-icon-Dp3"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </div>
                      </Link>

                    </React.Fragment>
                  );
                })
              ) : (
                <p className={styles.productNotFoundMessage}>No products found!</p>
              )}

            </div>

          </div>

        </div>
      ) : (
        <p className={styles.productNotFoundMessage}>No products found!</p>
      )}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </>
  );
}
export default CategoriesProducts;