import React, { useEffect, useState } from "react";
import { Currency } from "../Currency/currency";
import styles from "../../styles/Categories.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import Pagination from "./pagination";
import Filter from "../Filters/Filter";
import Link from "next/dist/client/link";
import { Client } from "@/graphql/client";

let filterOptions: any = [];

const productsPerPage = 21;
function CategoriesProducts({
  productsData,
  categoriesData,
  Data,
  categoryDetail,
}: any) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [displayedProducts, setDisplayedProducts] = useState<any>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState<any>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 80000]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [highestPrice, setHighestPrice] = useState<number>(0);
  const [lowestPrice, setLowestPrice] = useState<number>(0);
  // ====================Filters State Management==============

  const [addToLoading, setAddToLoading] = useState<any>(false);
  const [showModal, setShowModal] = useState<any>(false);
  const [modalHeading, setModalHeading] = useState<any>("");
  const [modalMessage, setModalMessage] = useState<any>("");

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [productCount, setProductCount] = useState<any>("");

  const [isSortListHovered, setIsSortListHovered] = useState<any>(false);
  const [activeSortField, setActiveSortField] = useState<any>("");
  const [filters, setFilters] = useState<any>({});
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});
  const [steps, setSteps] = useState<number[]>([]);
  const [hasValidAggregations, setHasValidAggregations] =
    useState<boolean>(false);
  const [stockStatus, setStockStatus] = useState<any>(null);
  const [loadingStockStatus, setLoadingStockStatus] = useState(true);
  const client = new Client();

  // Check Stock Status
  console.log("productsData", productsData);
  const fetchStockData = async () => {
    setLoadingStockStatus(true);
    try {
      const data = await client.fetchCategoryProductsStockStatus(
        categoryDetail.url_path,
        currentPage
      );
      if (data) {
        setStockStatus(data?.data?.categoryList?.[0]?.products.items); // Adjust based on response structure
      } else {
      }
    } catch (err) {
    } finally {
      setLoadingStockStatus(false);
    }
  };
  useEffect(() => {
    fetchStockData();
  }, [currentPage]);

  // Check Mobile Screen Size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch products for a specific page

  const fetchFormKey = async () => {
    try {
      const response = await fetch(
        `${process.env.baseURL}fcprofile/sync/index`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching form key: ${response.statusText}`);
      }
      const data = await response.json();
      if (data) {
        setCookie("form_key", data.form_key, 1); // Set form_key in cookies
        return data.form_key; // Return form key after setting it
      } else {
        throw new Error("Form key not found in the response.");
      }
    } catch (error) {
      return null;
    }
  };

  const setCookie = (name: any, value: any, days: any) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  const getCookie = (name: any) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const handleAddToCart = async (productId: any, quantity: any) => {
    let formKey = getCookie("form_key");

    // If form_key doesn't exist, fetch it first
    if (!formKey) {
      formKey = await fetchFormKey();
      if (!formKey) {
        return; // Stop execution if form key fetching fails
      }
    }

    setAddToLoading(true);

    try {
      const response = await fetch(`${process.env.baseURL}fcprofile/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: productId,
          qty: quantity,
          form_key: formKey,
          options: [],
          super_attributes: [],
        }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("cartCount", result.profile.cart_qty);
        localStorage.setItem("showcartBag", "true");
        window.dispatchEvent(new Event("storage"));
        setAddToLoading(false);
      } else {
        setModalHeading("Oops!");
        setModalMessage(
          result.errors?.general_exception
            ? result.errors.general_exception[0]?.message
            : result.message
            ? result.message
            : "Something went wrong... Please try again later."
        );
        setAddToLoading(false);
        setShowModal(true);
      }
    } catch (error) {
      setAddToLoading(false);
      setShowModal(true);
      setModalHeading("Oops!");
      setModalMessage(
        "Error adding to cart: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const fetchProductsForPage = async (page: number) => {
    if (!categoryDetail?.uid) return;

    setIsLoading(true);
    try {
      const cleanedUrlPath = categoryDetail.url_path.replace(/\/$/, "");
      const response = await client.fetchSubCategoryDataByUrlKey(
        cleanedUrlPath,
        page
      );

      if (response?.categoryList?.[0]?.products?.items) {
        setDisplayedProducts(response?.categoryList?.[0]?.products.items);
        console.log("set no. 1");
        setProductCount(response?.categoryList?.[0]?.products.total_count || 0);
        setTotalPages(
          Math.ceil(
            (response?.categoryList?.[0]?.products.total_count || 0) /
              productsPerPage
          )
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      // If there's a CORS error, fallback to the initial products
      // This is a temporary solution until the server-side CORS issue is fixed
      if (page === 1 && productsData) {
        setDisplayedProducts(productsData);
        console.log("set no. 2");
        setProductCount(categoriesData?.products?.total_count || 0);
      } else {
        // Show error message to user
        alert("Unable to load products. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };
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
          product?.variants?.[0]?.product?.price_range?.maximum_price
            ?.final_price?.value ??
          0
        );
      });

      const highest = Math.round(Math.max(...prices) / 10) * 10; // Round to nearest tens
      const lowest = Math.round(Math.min(...prices) / 10) * 10; // Round to nearest tens

      setHighestPrice(highest);
      setLowestPrice(lowest);
    };

    calculatePriceRange(productsData);
  }, [productsData]);

  // When component mounts, check URL for page parameter
  useEffect(() => {
    // Parse page from query, default to 1 if not present
    const pageFromQuery = router.query.page
      ? Number.parseInt(router.query.page as string, 10)
      : 1;

    // Ensure page is within valid range
    const safePage = pageFromQuery > totalPages ? 1 : pageFromQuery;

    setCurrentPage(safePage);

    // If we're not on page 1, fetch the products for that page
    // Check if we have active filters
    if (activeFilters.length > 0) {
      // If we have active filters, apply them regardless of page
      applyProductFilter(filters);
    } else {
      // No active filters, use normal pagination logic
      if (safePage !== 1) {
        fetchProductsForPage(safePage);
      } else {
        // For page 1, use the products we already have from SSG
        setDisplayedProducts(productsData);
        console.log("set no. 3");
        setProductCount(categoriesData?.products?.total_count || 0);
        setTotalPages(
          Math.ceil(
            (categoriesData?.products?.total_count || 0) / productsPerPage
          )
        );
      }
    }
  }, [router.query, totalPages, productsData, categoriesData, activeFilters]);
  // console.log(activeFilters.length, "activeFilters")
  // ===========================BreadCrumbs Management=======================================

  const { slug, slug2, slug3, ...rest } = router.query;

  // Get all slugs from query
  const slugs = [slug, slug2, slug3, ...Object.values(rest)].filter(Boolean);

  // Create breadcrumb array dynamically
  const breadcrumbs = [
    { name: "Home", path: "/" },
    ...slugs.map((slugPart: any, index) => ({
      name: slugPart.replace(/-/g, " "),
      path: `/${slugs.slice(0, index + 1).join("/")}`,
    })),
  ];
  // Store breadcrumbs in session storage on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("breadcrumbs", JSON.stringify(breadcrumbs));
    }
  }, []);

  // ===================================Filter==============================================

  function getForMatted(str: any) {
    str = str.replace(/[()]/g, "");
    return str.replaceAll(" ", "_").toLowerCase();
  }

  if (categoriesData?.products.aggregations) {
    filterOptions = [];
    categoriesData?.products?.aggregations.forEach((element: any) => {
      filterOptions.push({
        label: element?.label,
        value: getForMatted(element?.label),
      });
    });
  }

  useEffect(() => {
    // This effect runs on component mount and when `categoriesData` changes
    setSelectedOptions({});
  }, []);

  // Update products based on the current page and sorting
  useEffect(() => {
    if (
      displayedProducts &&
      displayedProducts.length > 0 &&
      selectedSortOption
    ) {
      // Create a copy of the array to avoid modifying state directly
      const sortedProducts = [...displayedProducts];

      // Apply sorting without setting state inside this function
      const getSortedProducts = (products: any, sortOption: any) => {
        switch (sortOption) {
          case "priceHighToLow":
            return products.sort((a: any, b: any) => {
              const aPrice =
                a?.price?.regularPrice?.amount?.value ??
                a?.variants?.[0]?.product?.price_range?.maximum_price
                  ?.final_price?.value ??
                0;
              const bPrice =
                b?.price?.regularPrice?.amount?.value ??
                b?.variants?.[0]?.product?.price_range?.maximum_price
                  ?.final_price?.value ??
                0;
              return bPrice - aPrice;
            });

          case "priceLowToHigh":
            return products.sort((a: any, b: any) => {
              const aPrice =
                a?.price?.regularPrice?.amount?.value ??
                a?.variants?.[0]?.product?.price_range?.maximum_price
                  ?.final_price?.value ??
                0;
              const bPrice =
                b?.price?.regularPrice?.amount?.value ??
                b?.variants?.[0]?.product?.price_range?.maximum_price
                  ?.final_price?.value ??
                0;
              return aPrice - bPrice;
            });

          case "productNameAtoZ":
            return products.sort((a: any, b: any) =>
              a.name.localeCompare(b.name)
            );

          case "productNameZtoA":
            return products.sort((a: any, b: any) =>
              b.name.localeCompare(a.name)
            );

          default:
            return products;
        }
      };

      // Only update state if the sorted array is different
      const sorted = getSortedProducts(sortedProducts, selectedSortOption);
      setDisplayedProducts(sorted);
      console.log("set no. 4");
    }
  }, [selectedSortOption]); // Only depend on selectedSortOption, not displayedProducts

  useEffect(() => {
    // Function to check screen size
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
    };

    // Check screen size on component mount
    checkScreenSize();

    // Add resize event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const closeDropDown = () => {
    setOpenDropdown(null);
  };

  // Define filter outside of the function to retain its state between calls
  const handleCheckboxChange = (
    aggregationLabel: string,
    optionValue: string,
    isChecked: boolean
  ) => {
    const filter: { [key: string]: string[] } = { ...filters };

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
            prev.filter(
              (item) =>
                item.label !== aggregationLabel || item.value !== optionValue
            )
          );

          filter[key] = filter[key].filter((value) => value !== optionValue);

          if (filter[key].length === 0) {
            delete filter[key];
          }
        }
      }
    });

    setFilters(filter);
    applyProductFilter(filter);
  };

  const handleRemoveFilter = (filterToRemove: any) => {
    setActiveFilters((prev) =>
      prev.filter(
        (filter) =>
          filter.label !== filterToRemove?.label ||
          filter?.value !== filterToRemove?.value
      )
    );

    // Uncheck the corresponding filter
    filterOptions.forEach((option: any) => {
      if (option?.label === filterToRemove?.label) {
        const key = option.value;
        filters[key] = filters[key]?.filter(
          (value: string) => value !== filterToRemove?.value
        );

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
        query[filterKey] = filters[filterKey].join(",");
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

  useEffect(() => {
    // Check if any aggregations exist and if the label is not null or 0
    const validAggregations = categoriesData?.products?.aggregations?.some(
      (aggregation: any) => aggregation.label && aggregation.label !== "0"
    );
    setHasValidAggregations(validAggregations);
  }, [categoriesData]);

  const applyProductFilter = async (filter: any) => {
    setIsLoading(true);
    try {
      // Convert the filter format from the current structure to the GraphQL filter format
      const graphqlFilter: Record<
        string,
        { eq?: string; in?: string[]; from?: string; to?: string }
      > = {};

      // Loop through filter options and build the GraphQL filter object
      for (const key in filter) {
        if (filter[key] && filter[key].length > 0) {
          const filterOption = filterOptions.find(
            (option: any) => option.value === key
          );
          if (filterOption) {
            const attributeName: any = getForMatted(filterOption.label);

            // Special handling for price filter
            if (
              attributeName.toLowerCase() === "price" &&
              filter[key].length === 1
            ) {
              const priceRange = filter[key][0].split("_");
              if (priceRange.length === 2) {
                graphqlFilter[attributeName] = {
                  from: priceRange[0],
                  to: priceRange[1],
                };
              }
            } else {
              // Normal filters
              if (filter[key].length === 1) {
                graphqlFilter[attributeName] = { eq: filter[key][0] };
              } else {
                graphqlFilter[attributeName] = { in: filter[key] };
              }
            }
          }
        }
      }

      function formatObject(obj: any): string {
        return Object.entries(obj)
          .map(([key, value]) => {
            if (typeof value === "object") {
              return `{${key}: ${JSON.stringify(value, null, 2)}},`.replace(
                /"([^(")]+)":/g,
                "$1:"
              );
            } else {
              return `${key}: ${value}`;
            }
          })
          .join("\n");
      }

      // Fetch filtered products using the GraphQL query
      const client = new Client();
      const response = await client.fetchSearchProductResult(
        "",
        currentPage,
        formatObject(graphqlFilter)
      );
      console.log(response, "response");
      if (response?.products?.items) {
        setDisplayedProducts(response.products.items);
        console.log("set no. 5");
        setProductCount(response.products.total_count || 0);
        setTotalPages(
          Math.ceil((response.products.total_count || 0) / productsPerPage)
        );
      } else {
        // Handle case where no products are returned
        setDisplayedProducts([]);
        console.log("set no. 6");
        setProductCount(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      // Show error message to user
      alert("Unable to apply filters. Please try again later.");
    } finally {
      setIsLoading(false);
    }
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
    const final_price =
      item?.price_range?.maximum_price?.final_price?.value.toLocaleString();
    const regular_price =
      item?.price_range?.maximum_price?.regular_price?.value.toLocaleString();
    const currency: any = item?.price?.regularPrice?.amount?.currency;
    if (regular_price != final_price) {
      return `${Currency[currency]}${regular_price}`;
    } else {
      return "";
    }
  }

  function finalPrice(item: any) {
    const final_price =
      item?.price_range?.maximum_price?.final_price?.value.toLocaleString();
    const currency: any = item?.price?.regularPrice?.amount?.currency;
    return `${Currency[currency]}${final_price}`;
  }

  function getconfigurablePrice(item: any) {
    const price =
      item?.price_range?.maximum_price?.regular_price?.value?.toLocaleString();
    const regular_price =
      item?.price_range?.maximum_price?.regular_price?.value?.toLocaleString();
    const currency: any =
      item?.price_range?.maximum_price?.regular_price?.currency;

    if (regular_price != price) {
      return `${Currency[currency]} ${price}`;
    } else {
      return "";
    }
  }

  function configurableFinalPrice(item: any) {
    const final_price =
      item?.price_range?.maximum_price?.final_price?.value?.toLocaleString();
    const currency: any =
      item?.price_range?.maximum_price?.regular_price?.currency;
    return `${Currency[currency]}${final_price}`;
  }

  // Declare variables here
  let selectedVariant: any = null;
  let product: any = null;
  let optionValueIndex: any = null;

  // Handle page change
  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Update URL with new page number
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page },
      },
      undefined,
      { shallow: true } // Prevents full page reload
    );

    setCurrentPage(page);

    // Check if we have active filters
    if (activeFilters.length > 0) {
      // If we have active filters, apply them for the new page
      applyProductFilter(filters);
    } else if (page !== currentPage) {
      // No active filters, fetch regular products for the new page
      fetchProductsForPage(page);
    }
  };

  if (!hasValidAggregations) {
    return null;
  }

  return (
    <>
      {showModal && (
        <div className="modal_outer">
          <div className="modal_contenct">
            <div className="close_icon" onClick={() => setShowModal(false)}>
              <Image
                width={35}
                height={35}
                src={"/Images/cross-23-32.png"}
                alt="Close Modal"
              />
            </div>
            <div className="modal_heading">{modalHeading}</div>
            <div className="modal_message">{modalMessage}</div>
          </div>
        </div>
      )}
      <Filter
        isSortListHovered={isSortListHovered}
        handleCheckboxChange={handleCheckboxChange}
        handleFilterClick={handleFilterClick}
        handleSortOptionClick={handleSortOptionClick}
        handleSortListHover={handleSortListHover}
        categoriesData={categoriesData}
        isFilterOpen={isFilterOpen}
        productCount={productCount}
        filters={filters}
        filterOptions={filterOptions}
        setSelectedSortOption={setSelectedSortOption}
        selectedSortOption={selectedSortOption}
        setIsFilterOpen={setIsFilterOpen}
        activeFilters={activeFilters}
        handleRemoveFilter={handleRemoveFilter}
        setPriceRange={setPriceRange}
        highestPrice={highestPrice}
        lowestPrice={lowestPrice}
      />
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <p>Loading products...</p>
        </div>
      ) : (
        <>
          {displayedProducts && displayedProducts.length > 0 ? (
            <div className={styles.allProductContainer}>
              <div className={styles.filterContainer}>
                <div className={styles.filterModal} style={{ zIndex: "unset" }}>
                  <div className={styles.filterHeader}>
                    <h4>Filter By</h4>
                  </div>

                  <div className={styles.filterContent}>
                    <div
                      className={styles.filterGroup}
                      style={{
                        borderBottom: activeFilters.length === 0 ? "none" : "",
                      }}
                    >
                      <div
                        className={styles.filterLabelContainer}
                        style={{
                          padding: activeFilters.length === 0 ? "0" : "",
                        }}
                      >
                        {activeFilters.map((filter: any, index: any) => {
                          const label = categoriesData?.products?.aggregations
                            ?.flatMap((aggregation: any) => aggregation.options)
                            .find(
                              (option: any) => option.value === filter.value
                            )?.label;

                          return (
                            <span
                              key={index}
                              className={styles.filterGroupLabel}
                            >
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
                      .filter(
                        (aggregation: any) => aggregation.label !== "Category"
                      )
                      .map((aggregation: any) => (
                        <div
                          key={aggregation.label}
                          className={styles.filterGroup}
                        >
                          {/* Clickable Group Title to Toggle Dropdown */}
                          <h5
                            className={styles.filterGroupTitle}
                            onClick={() => toggleGroup(aggregation.label)}
                          >
                            {aggregation.label}
                            <span className={styles.dropdownArrow}>
                              {openGroups[aggregation.label] ? (
                                <Image
                                  src="/Images/up-arrow.png"
                                  alt="Up Arrow"
                                  height={10}
                                  width={10}
                                />
                              ) : (
                                <Image
                                  src="/Images/down-arrow.png"
                                  alt="Up Arrow"
                                  height={10}
                                  width={10}
                                />
                              )}
                            </span>
                          </h5>

                          {/* Dropdown Content */}
                          {openGroups[aggregation.label] && (
                            <div className={styles.filterOptionsGrid}>
                              {aggregation.options.map((option: any) => (
                                <label
                                  key={option.value}
                                  className={styles.filterOption}
                                >
                                  <input
                                    type="checkbox"
                                    value={option.value}
                                    checked={isChecked(
                                      aggregation.label,
                                      option.value
                                    )}
                                    onChange={(e: any) =>
                                      handleCheckboxChange(
                                        aggregation.label,
                                        option.value,
                                        e.target.checked
                                      )
                                    }
                                  />
                                  {option.label}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className={styles.products}>
                <div className={styles.watchGrid}>
                  {displayedProducts.map((productItem: any, index: number) => {
                    selectedVariant = null
                    product = productItem
                    optionValueIndex = product?.configurable_options?.[0]?.values?.[0]?.value_index

                    if (product?.__typename === "ConfigurableProduct") {
                      selectedVariant = product?.variants.find((variant: any) =>
                        variant.attributes.some((attribute: any) => attribute.value_index === optionValueIndex),
                      )
                    }

                    const variantProduct = selectedVariant?.product || product

                    return (
                      <React.Fragment key={index}>
                        <Link href={`/${product.url_key}.html`} key={variantProduct.id} className={styles.watchItem}>
                          {/* SALE FLAG */}
                          {(() => {
                            const isOutOfStock = stockStatus?.every(
                              (status: any) => status?.stock_status !== "IN_STOCK",
                            )

                            const isOnSale =
                              (product.__typename === "ConfigurableProduct"
                                ? getconfigurablePrice(selectedVariant?.product)
                                : regularPrice(variantProduct)) >
                              (product.__typename === "ConfigurableProduct"
                                ? configurableFinalPrice(selectedVariant?.product)
                                : finalPrice(variantProduct))

                            if (isOutOfStock) {
                              return <div className={styles.saleTag}>Out of Stock</div>
                            } else if (isOnSale) {
                              return <div className={styles.saleTag}>Sale</div>
                            } else {
                              return null
                            }
                          })()}

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
                          <p className={styles.brandName}>
                            {product?.brand || ""} {/* brand */}
                          </p>
                          <span style={{ textDecoration: "none" }}>{variantProduct.name}</span>
                          <p className={styles.conditionName}>{product?.condition ? "Never Worn" : "Pre-Owned "}</p>
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

                          {!isMobile && (
                            <div className={styles.actionContainer}>
                              {stockStatus?.some((status: any) => status?.stock_status === "IN_STOCK") ? (
                                <button
                                  className={styles.addToCartButton}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    if (product.__typename === "ConfigurableProduct") {
                                      router.push(`/${product.url_key}.html`)
                                    } else {
                                      handleAddToCart(productItem.id, 1)
                                    }
                                  }}
                                >
                                  add to cart
                                </button>
                              ) : (
                                <button className={styles.addToCartButton} disabled>
                                  add to cart
                                </button>
                              )}
                            </div>
                          )}
                        </Link>
                      </React.Fragment> 
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <p className={styles.productNotFoundMessage}>No products found!</p>
          )}
        </>
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
