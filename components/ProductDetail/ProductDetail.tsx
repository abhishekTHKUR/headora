/* eslint-disable jsx-a11y/alt-text */
import React, { useCallback, useEffect, useState } from "react";
import styles from "../../styles/ProductDetail.module.css";
import { Currency } from "../Currency/currency";
import PDPSkeletonLoader from "./SkilitonLoader";
import DetailNavbar from "./DetailNavbar";
import ShortDescription from "./ShortDescription";
import Image from "next/image";
import GallerySection from "./GallerySection";
import AttributeSlider from "./AttributeSlider";
import {
  processAffirmPrice,
  affirmUpdate,
  getFilePath,
  getFormattedCurrency,
  strToArray,
  validateConfigurations,
  setCookie,
  getCookie,
  updateProduct,
  standardizeValue,
} from "../../components/ConfigureProduct";
import Link from "next/link";
import { useRouter } from "next/router";
import { Client } from "@/graphql/client";
import MakeAOffer from "../Modals/MakeAOffer";
import ShortDescriptionNavBars from "./ShortDescriptionNavBars";

function ProductDetail({
  Data,
  aggregations,
  categories,
  setSchemaImage,
  breadcrumbs,
  ReturnDataCMSBlock,
}: any) {
  if (!Data) return null;
  const router = useRouter();

  const [showMoadal, setShowMoadal] = useState<any>(false);

  const [moadalHeading, setMoadalHeading] = useState<any>("");
  const [moadalMessage, setmMadalMessage] = useState<any>("");

  const [quantity, setQuantity] = useState<any>(1);
  const [disabledOptions, setDisabledOptions] = useState<any>([]);
  const [selectedOptions, setSelectedOptions] = useState<any>({});

  const [prevSelectedOptions, setPrevSelectedOptions] = useState<any>({});
  const [activeFilters, setActiveFilters] = useState<any>([]);

  const [currentVariant, setCurrentVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(
    currentVariant?.media_gallery?.[0]?.url || Data?.image?.url
  );
  const [SelectedOptionsID, setSelectedOptionsID] = useState<any>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [addToLoading, setAddToLoading] = useState<any>(false);
  const [activeImage, setActiveImage] = useState<any>(0);
  const [isMobile, setIsMobile] = useState<any>(false);
  const [cartError, setCartError] = useState<any>(0);

  const [affirmShow, setAffirmShow] = useState<any>(false);
  const [affirmPrice, setAffirmPrice] = useState<any>("");
  const [brandname, setBrandname] = useState<any>("Headora");
  const [stockStatus, setStockStatus] = useState(null);
  const [loadingStockStatus, setLoadingStockStatus] = useState(true);
  console.log(Data, "Data");
  // Limit Data.name to 50 characters and add ellipsis if necessary
  const displayName =
    Data.name.length > 50 ? `${Data.name.slice(0, 50)}...` : Data.name;
  const client = new Client();

  const fetchStockData = async () => {
    setLoadingStockStatus(true);
    try {
      const data = await client.fetchStockStatus(Data?.url_key);
      if (data) {
        setStockStatus(data?.products?.items?.[0]?.stock_status); // Adjust based on response structure
      } else {
      }
    } catch (err) {
    } finally {
      setLoadingStockStatus(false);
    }
  };
  useEffect(() => {
    fetchStockData();
  }, []);

  // Price for meta

  // ==============Brand Logic=================
  useEffect(() => {
    let found = false;

    aggregations.forEach((element: any) => {
      if (element.attribute_code === "brand" && element.options[0]?.label) {
        setBrandname(element.options[0].label);
        found = true;
      }
    });

    if (!found) {
      aggregations.forEach((element: any) => {
        if (
          element.attribute_code === "manufacturer" &&
          element.options[0]?.label
        ) {
          setBrandname(element.options[0].label);
        }
      });
    }
  }, [aggregations]);

  // ===========Cookie Handler================
  useEffect(() => {
    if (window.innerWidth < 650) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth < 650) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    });
  }, []);

  function titleCase(str: any) {
    let returnString = "";
    var splitStr = str.toLowerCase().split(" ");
    splitStr.forEach((item: any) => {
      returnString =
        returnString + item.charAt(0).toUpperCase() + item.substring(1) + " ";
    });

    return returnString ? returnString : str;
  }

  useEffect(() => {
    let slugArray: any = router.query;
    if (Data && Data.configurable_options) {
      Data.configurable_options.forEach((configuration: any) => {
        if (slugArray[configuration.attribute_code]) {
          let optvalue = slugArray[configuration.attribute_code];
          optvalue = optvalue.replaceAll("_", " ");
          optvalue = titleCase(optvalue);

          setSelectedOptions((prevOptions: any) => ({
            ...prevOptions,
            [configuration.attribute_code]:
              selectedOptions[configuration.attribute_code] != optvalue
                ? optvalue
                : "",
          }));
        }
      });
    }

    // setSelectedOptions((prevOptions: any) => ({
    //   ...prevOptions,
    //   [attributeCode]: selectedOptions[attributeCode]!=optvalue?optvalue:'',
    // }));
  }, [router.query, Data]);

  const gotToReviews = () => {
    if (typeof document !== "undefined") {
      const element = document.getElementById("reviewssection");
      if (element) {
        const scrollDiv = element.offsetTop;
        window.scrollTo({ top: scrollDiv, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (showMoadal) {
      document.body.classList.add("modalOpen");
    } else {
      document.body.classList.remove("modalOpen");
    }
  }, [showMoadal]);

  const updateAffirm = async () => {
    let final_price =
      currentVariant?.priceRange?.maximum_price?.final_price?.value ||
      Data?.priceRange?.maximum_price?.final_price?.value;
    let affirm_show = await affirmUpdate(final_price);
    let affirm_price = await processAffirmPrice(final_price);
    setAffirmPrice(affirm_price);
    setAffirmShow(affirm_show);
  };

  useEffect(() => {
    if (Data?.__typename == "ConfigurableProduct") {
      setCartError(0);

      const OptionAttributeId: { [key: string]: string } = {};
      Data?.configurable_options.forEach((option: any) => {
        const selectedOption = selectedOptions[option.attribute_code];
        const selectedOptionValue = option.values.find(
          (value: any) => value.label === selectedOption
        );

        if (selectedOptionValue) {
          OptionAttributeId[option.attribute_id_v2] =
            selectedOptionValue.value_index;
          setSelectedOptionsID(OptionAttributeId);
        } else {
          setCartError(parseInt(cartError) + 1);
        }
      });
    }
  }, [selectedOptions]);

  useEffect(() => {
    if (Data?.__typename == "ConfigurableProduct") {
      setDefailtOption(0);
    }
  }, [Data]);

  useEffect(() => {
    setAffirmShow(false);
    updateAffirm();
  }, []);

  const setDefailtOption = async (index: any) => {
    let newIndex = parseInt(index);
    let allActiveFilters: any = [];
    let tag: any;
    const initialOptions: { [key: number]: string } = {};
    await Data?.configurable_options?.forEach((option: any, indx: any) => {
      if (indx === 0) {
        initialOptions[option.attribute_code] = option.values[0]?.label;
        tag =
          option.attribute_code +
          "--" +
          standardizeValue(option.values[0].label);

        allActiveFilters.push(tag);
      } else {
        initialOptions[option.attribute_code] = option.values[newIndex]?.label;
        tag =
          option.attribute_code +
          "--" +
          standardizeValue(option.values[newIndex].label);
        allActiveFilters.push(tag);
      }
    });
    getDisableOptions(allActiveFilters);
    let isValidConfiguration = await validateConfigurations(
      Data,
      allActiveFilters
    );

    if (isValidConfiguration) {
      setActiveFilters(allActiveFilters);
      setSelectedOptions(initialOptions);
      setPrevSelectedOptions(initialOptions);
    } else {
      let nextIndex = newIndex + 1;
      setDefailtOption(nextIndex);
    }
  };

  const getDisableOptions = (allActiveFilters: any) => {
    if (allActiveFilters && allActiveFilters.length > 0) {
      allActiveFilters.forEach(async (optionstring: any) => {
        let allDisableFilters: any = [];
        if (optionstring != "") {
          let optionArrayStr = strToArray(optionstring + "", "--");
          await Data?.configurable_options?.forEach(async (option: any) => {
            if (option.attribute_code !== optionArrayStr[0]) {
              await option.values.forEach(async (opt: any) => {
                let filters: any = [];
                let newTag =
                  option.attribute_code + "--" + standardizeValue(opt.label);
                filters.push(optionstring);
                filters.push(newTag);

                let isValidConfiguration = await validateConfigurations(
                  Data,
                  filters
                );
                if (!isValidConfiguration) {
                  if (
                    option.attribute_code != "dial_color" ||
                    option.attribute_code != "metal_type"
                  ) {
                    allDisableFilters = [...allDisableFilters, newTag];
                  }
                }
              });
            }
          });

          setDisabledOptions(allDisableFilters);
        }
      });
    } else {
      setDisabledOptions([]);
    }
  };

  useEffect(() => {
    // Only process variants for configurable products
    if (Data.__typename === "ConfigurableProduct") {
      getDisableOptions(activeFilters);
      let isValidConfiguration = true; // validateConfigurations(Data, activeFilters)
      if (isValidConfiguration) {
        let selectedVariant = updateProduct(Data, activeFilters);
        setCurrentVariant(Data.variants[selectedVariant]);
      }
    } else {
      // Clear currentVariant for simple products
      setCurrentVariant(null);
    }
  }, [activeFilters, Data]);

  const generateVideoThumbnail = (file: any) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      // this is important
      const video = document.createElement("video");
      video.setAttribute("src", file);
      video.setAttribute("crossorigin", "anonymous");
      video.load();
      video.currentTime = 1;
      video.onloadeddata = () => {
        let ctx: any = canvas.getContext("2d");

        canvas.width = 500;
        canvas.height = 500;

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.pause();
        return resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  useEffect(() => {
    if (Data.__typename != "SimpleProduct") {
      let newActiveFilter: any = [];
      Object.keys(selectedOptions).forEach(function (key, idx, arr) {
        if (selectedOptions[key]) {
          newActiveFilter.push(
            key + "--" + standardizeValue(selectedOptions[key])
          );
        }
      });
      setActiveFilters(newActiveFilter);
    }
  }, [selectedOptions]);

  const handleOptionSelect = async (option: any, value: any) => {
    let attributeCode = option.attribute_code;
    let optvalue = value.label;
    let tag = attributeCode + "--" + standardizeValue(optvalue);

    if (
      option.attribute_code == "dial_color" ||
      option.attribute_code == "metal_type"
    ) {
      setSelectedOptions([]);
      setSelectedOptions((prevOptions: any) => ({
        ...prevOptions,
        [attributeCode]: optvalue,
      }));

      Data?.configurable_options.forEach((opt: any) => {
        if (opt.attribute_code != attributeCode && opt.values.length == 1) {
          setSelectedOptions((prevOptions: any) => ({
            ...prevOptions,
            [opt.attribute_code]: opt.values[0].label,
          }));
        }
      });
    } else {
      if (!disabledOptions.includes(tag)) {
        setSelectedOptions((prevOptions: any) => ({
          ...prevOptions,
          [attributeCode]: optvalue,
        }));
      }
    }
  };

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

  const handleAddToCart = async (redirect: any) => {
    let errorCount = 0;
    if (Data.__typename != "SimpleProduct") {
      Object.keys(selectedOptions).forEach(function (key) {
        if (selectedOptions[key]) {
        } else {
          errorCount++;
        }
      });
    }
    if (errorCount > 0) {
      return;
    } else {
      let formKey = getCookie("form_key");

      // If form_key doesn't exist, fetch it first
      if (!formKey) {
        formKey = await fetchFormKey();
        if (!formKey) {
          return; // Stop execution if form key fetching fails
        }
      }
      setAddToLoading(true);
      const product = Data?.id;
      const superAttributes = Object.keys(SelectedOptionsID).map((key) => ({
        id: key,
        value: SelectedOptionsID[key],
      }));

      try {
        const response = await fetch(
          `${process.env.baseURL}fcprofile/cart/add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product: product,
              qty: quantity,
              form_key: formKey, // Use the form_key from cookies or the fetched one
              options: [],
              super_attributes: superAttributes,
            }),
          }
        );

        const result = await response.json();

        if (result.success) {
          localStorage.setItem("cartCount", result.profile.cart_qty);
          localStorage.setItem("showcartBag", "true");
          window.dispatchEvent(new Event("storage"));
          setAddToLoading(false);
          if (redirect) {
            window.location.href = process.env.baseURL + "checkout/";
          }
        } else {
          setMoadalHeading("Oops!");
          setmMadalMessage(
            result.errors.general_exception
              ? result.errors.general_exception[0]?.message
              : result.message
              ? result.message
              : "Something went wrong... Please try again later."
          );
          setAddToLoading(false);
          setShowMoadal(true);
        }
      } catch (error: any) {
        setAddToLoading(false);
        setShowMoadal(true);
        setMoadalHeading("Oops!");
        setmMadalMessage("Error adding to cart: " + error.message);
      }
      // await fetchStockData();
    }
  };

  function formatPrice(value: number): string {
    // Format the value with locale-specific formatting and fixed to 2 decimals
    return value?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  function finalPrice() {
    const isConfigurable = Data.__typename === "ConfigurableProduct";
    const final_price = isConfigurable
      ? currentVariant?.priceRange?.maximum_price?.final_price?.value
      : Data?.priceRange?.maximum_price?.final_price?.value;
    let currency: any = Data?.price?.regularPrice?.amount?.currency;
    return `${Currency[currency]}${formatPrice(final_price)}`;
  }

  function regularPrice() {
    const isConfigurable = Data.__typename === "ConfigurableProduct";
    const final_price = isConfigurable
      ? currentVariant?.priceRange?.maximum_price?.final_price?.value
      : Data?.priceRange?.maximum_price?.final_price?.value;
    const regular_price = isConfigurable
      ? currentVariant?.priceRange?.maximum_price?.regular_price?.value
      : Data?.priceRange?.maximum_price?.regular_price?.value;
    let currency: any = Data?.price?.regularPrice?.amount?.currency;
    if (regular_price != final_price) {
      return `${Currency[currency]}${formatPrice(regular_price)}`;
    } else {
      return "";
    }
  }
  function savingPrice() {
    let final_price =
      currentVariant?.priceRange?.maximum_price?.final_price?.value ||
      Data?.priceRange?.maximum_price?.final_price?.value;

    let regular_price =
      currentVariant?.priceRange?.maximum_price?.regular_price?.value ||
      Data?.priceRange?.maximum_price?.regular_price?.value;

    // Calculate savings
    if (regular_price) {
      let saving = regular_price - final_price;
      if (saving > 0) {
        return `You will save $${formatPrice(saving)}`;
      }
    }

    return "";
  }

  const incrementQuantity = () => {
    setQuantity((prevQuantity: number) => Math.min(prevQuantity + 1, 100));
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity: number) => Math.max(prevQuantity - 1, 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(100, Number(e.target.value)));
    setQuantity(value);
  };

  if (!Data) {
    return <PDPSkeletonLoader />;
  }
  const calculateOverallRating = (reviews: any[]) => {
    if (reviews.length === 0) return 0;

    const totalAverageRating = reviews.reduce(
      (total, review) => total + review.average_rating,
      0
    );

    // Calculate the average rating out of 100 and map to a 5-star scale
    return totalAverageRating / reviews.length / 20;
  };
  const reviews = Data.reviews?.items || [];
  const overallRating = calculateOverallRating(reviews);

  // =======================Find Lead Time===========================

  // Find the "lead_time" attribute
  const leadTimeAttribute = aggregations.find(
    (attr: any) => attr?.attribute_code === "lead_time"
  );

  // Find the option with count === 1
  const leadTimeOption = leadTimeAttribute?.options.find(
    (option: any) => option?.count === 1
  );

  return (
    <>
      <div className={styles.navBarSpace}></div>
      {showMoadal && (
        <div className="modal_outer">
          <div className="modal_contenct">
            <div className="close_icon" onClick={() => setShowMoadal(false)}>
              <Image
                width={35}
                height={35}
                src={"/Images/cross-23-32.png"}
                alt="Close Modal"
              />
            </div>
            <div className="modal_heading">{moadalHeading}</div>
            <div className="modal_message">{moadalMessage}</div>
          </div>
        </div>
      )}

      <div className={styles.detailContainer}>
        {/* <nav className={styles.breadcrumb}>
        {breadcrumbs.length === 0 && (
          <Link href={'/'} style={{  borderRight: 'black 1px solid', padding: '0 10px 0px 0px'}}>Home</Link>
        )}
        {breadcrumbs.map((crumb: any, index: number) => (
          <React.Fragment key={index}>
             <Link href={crumb.path}>
              <span>{crumb.name}</span>
            </Link>
          </React.Fragment>
        ))}
           <span style={{ borderRight: 'unset' }}>{displayName}</span>
      </nav> */}

        <div className={styles.cartegoryHeadeBreadcrumbs}>
          {/* Render Home link if no breadcrumbs are available */}
          {breadcrumbs.length === 0 && (
            <>
              <Link href="/" style={{}}>
                Home
              </Link>
              <span>/</span>
              <Link
                href={
                  Data?.categories?.[0]?.name === "Support" &&
                  Data?.categories?.[1]?.url_key
                    ? Data?.categories?.[1]?.url_key
                    : Data?.categories?.[0]?.url_key || ""
                }
              >
                {Data?.categories?.[0]?.name === "Support" &&
                Data?.categories?.[1]?.name
                  ? Data?.categories?.[1]?.name
                  : Data?.categories?.[0]?.name || ""}
              </Link>

              <span>/</span>
            </>
          )}

          {/* Map through breadcrumbs */}
          {breadcrumbs.map((crumb: any, index: number) => (
            <React.Fragment key={index}>
              <Link href={crumb.path}>{crumb.name.replace(".html", "")}</Link>

              {index < breadcrumbs.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}

          {/* Display the last breadcrumb as a styled span */}
          {/* <span>{displayName}</span> */}
        </div>

        <div className={styles.productDetail}>
          {/* Brand, Review and Product Name Repeat For Mobile View */}
          <div className={styles.mobileBlock}>
            {/* <div className={`${styles.brandReviewWrapper}`}>
              <p className={styles.brand}>{brandname}</p>
              {reviews.length > 0 && (
                <div className={styles.Breakdown}>
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const starValue = overallRating - idx;
                    if (starValue >= 1) {
                      return (
                        <Image
                          key={idx}
                          src="/Images/Filled.png"
                          alt="Full Star"
                          height={12}
                          width={12}
                        />
                      );
                    } else if (starValue >= 0.5) {
                      return (
                        <Image
                          key={idx}
                          src="/Images/Half filled.png"
                          alt="Half Star"
                          height={12}
                          width={12}
                        />
                      );
                    } else {
                      return (
                        <Image
                          key={idx}
                          src="/Images/Unfilled.png"
                          alt="Empty Star"
                          height={12}
                          width={12}
                        />
                      );
                    }
                  })}


                </div>
              )}
            </div> */}
          </div>
          <div className={`${styles.priceTitleWrapper} ${styles.mobileBlock}`}>
            <div className={`${styles.subTitelWrapper}`}>
              <h1 className={styles.mobileViewProductTitle}>
                {Data.__typename === "ConfigurableProduct"
                  ? currentVariant?.variant_name || Data?.name
                  : Data?.name}
              </h1>
            </div>
          </div>

          <div className={styles.productImages}>
            <GallerySection
              currentVariantData={currentVariant ? currentVariant : Data}
              setSchemaImage={setSchemaImage}
            />
          </div>

          <div className={styles.productInfo}>
            <div className={styles.desktopBlock}>
              {/* <div className={`${styles.brandReviewWrapper}`}>
                <p className={styles.brand}>{brandname}</p>
                {reviews.length > 0 && (
                  <div className={styles.Breakdown}>

                    {Array.from({ length: 5 }).map((_, idx) => {
                      const starValue = overallRating - idx;
                      if (starValue >= 1) {
                        return (
                          <Image
                            key={idx}
                            src="/Images/Filled.png"
                            alt="Full Star"
                            height={12}
                            width={12}
                          />
                        );
                      } else if (starValue >= 0.5) {
                        return (
                          <Image
                            key={idx}
                            src="/Images/Half filled.png"
                            alt="Half Star"
                            height={12}
                            width={12}
                          />
                        );
                      } else {
                        return (
                          <Image
                            key={idx}
                            src="/Images/Unfilled.png"
                            alt="Empty Star"
                            height={12}
                            width={12}
                          />
                        );
                      }
                    })}


                  </div>
                )}
              </div> */}
            </div>
            <div
              className={`${styles.priceTitleWrapper} ${styles.desktopBlock}`}
            >
              <div className={styles.subTitelWrapper}>
                <h1>
                  {Data.__typename === "ConfigurableProduct"
                    ? currentVariant?.variant_name || Data?.name
                    : Data?.name}
                </h1>
              </div>
              <p className={styles.paymentInfo}>
                <b>SKU:</b> {currentVariant ? currentVariant.sku : Data?.sku}
              </p>
              <p className={styles.price}>
                <span className={styles.special}>{finalPrice()}</span>
                <span className={styles.regular}>{regularPrice()}</span>
              </p>
            </div>

            {Data?.__typename === "ConfigurableProduct" && (
              <div
                className={styles.ConfigurableWrapper + " ConfigurableProduct"}
              >
                {Data?.configurable_options?.map((option: any) => (
                  <>
                    <AttributeSlider
                      option={option}
                      handleOptionSelect={handleOptionSelect}
                      disabledOptions={disabledOptions}
                      activeFilters={activeFilters}
                    />
                  </>
                ))}
              </div>
            )}

            {/* Affirm and Product Price Repeat For Mobile View */}

            {affirmShow && affirmPrice != undefined && (
              <div
                id="affirmfinance"
                className={`affirm-as-low-as ${styles.mobileBlock}`}
                data-page-type="product"
                data-amount={affirmPrice}
              />
            )}
            <div className={styles.mobileBlock}>
              <p className={`${styles.price} `}>
                <span className={styles.special}>{finalPrice()}</span>
                <span className={styles.regular}>{regularPrice()}</span>
                {savingPrice() && (
                  <span className={styles.mobilePriceDiscount}>
                    {savingPrice()}
                  </span>
                )}
              </p>
            </div>

            <div className={styles.quantityActionWrapper}>
              {/* Quantity Selector */}
              {stockStatus === "OUT_OF_STOCK" ? (
                ""
              ) : (
                <div className={styles.quantitySelector}>
                  <label htmlFor="quantity">Quantity: </label>
                  <div className={styles.customQuantity}>
                    <button
                      className={styles.decrementButton}
                      onClick={decrementQuantity}
                      disabled={
                        stockStatus === "OUT_OF_STOCK" || loadingStockStatus
                      }
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={
                        stockStatus === "OUT_OF_STOCK" || loadingStockStatus
                          ? "0"
                          : quantity
                      }
                      onChange={handleQuantityChange}
                      min="1"
                      max="100"
                      className={styles.quantityInput}
                      disabled={
                        stockStatus === "OUT_OF_STOCK" || loadingStockStatus
                      }
                    />
                    <button
                      className={styles.incrementButton}
                      onClick={incrementQuantity}
                      disabled={
                        stockStatus === "OUT_OF_STOCK" || loadingStockStatus
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className={styles.actionButtonsWrapper}>
                {loadingStockStatus ? (
                  <div className={styles.actionButtons}>
                    <span className={styles.loadingButton}>
                      Please wait...
                    </span>
                  </div>
                ) : stockStatus === "OUT_OF_STOCK" ? (
                  <div className={styles.actionButtons}>
                    <span className={styles.outOfStockText}>Out of Stock</span>
                  </div>
                ) : addToLoading ? (
                  <div className={styles.actionButtons}>
                    <span className={styles.loadingButton}>
                      Please wait...
                    </span>
                  </div>
                ) : (
                  <div className={styles.inlineActions}>
                    <button
                      className={styles.shopNow}
                      onClick={() => handleAddToCart(false)}
                    >
                      Add To Cart
                    </button>
                  </div>
                )}
              </div>

              {/* Offer Component */}
              {stockStatus !== "OUT_OF_STOCK" && !loadingStockStatus && (
                <MakeAOffer
                  productID={Data?.id}
                  sku={currentVariant ? currentVariant.sku : Data?.sku}
                  productName={
                    Data.__typename === "ConfigurableProduct"
                      ? currentVariant?.variant_name || Data?.name
                      : Data?.name
                  }
                  price={
                    regularPrice()?.length == 0 ? finalPrice() : regularPrice()
                  }
                  specialPrice={
                    regularPrice()?.length == 0 ? "$0" : finalPrice()
                  }
                />
              )}
              {/* <button
                    className={styles.buyNow}
                    onClick={() => handleAddToCart(false)}
                  >
                    Buy It Now
                  </button> */}
            </div>

            {/* <div className={styles.wishlist_container}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="icon-icon-Dp3"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <p className={styles.wishlist}>Add to Favorites</p>
            </div> */}

            <ul className={styles.productFeatures}>
              <li>
                <Image
                  height={50}
                  width={50}
                  src="/Images/ShippingLogo.png"
                  alt="ShippingLogo"
                />
                <p>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open(
                        `${process.env.baseURLWithoutTrailingSlash}/guide/shipping-policy/`,
                        "_blank"
                      );
                    }}
                  >
                    Shipping
                  </span>{" "}
                  and{" "}
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open(
                        `${process.env.baseURLWithoutTrailingSlash}/guide/returns-policy/`,
                        "_blank"
                      );
                    }}
                  >
                    Returns
                  </span>
                </p>
              </li>
              <li>
                <Image
                  height={50}
                  width={50}
                  src="/Images/PersonLogo.png"
                  alt="PersonLogo"
                />
                <p>
                  Speak to an expert{" "}
                  <Link href="tel:+1 888 635 6174"> +1 (800) 690-3736</Link>
                </p>
              </li>
              <li>
                <Image
                  height={50}
                  width={50}
                  src="/Images/Calendar.png"
                  alt="Calendar"
                />
                <p>Virtual Appointment</p>
              </li>
              <li>
                <Image
                  height={50}
                  width={50}
                  src="/Images/gift.png"
                  alt="ShippingLogo"
                  style={{ width: "18px", height: "16px" }}
                />
                <p>
                  {" "}
                  Anticipated Delivery: {leadTimeOption?.label || "3 - 4 Week"}
                </p>
              </li>
            </ul>
            <ShortDescriptionNavBars
              currentVariant={currentVariant ? currentVariant : Data}
              configurableOptions={Data?.configurable_options}
              Data={Data}
              aggregations={aggregations}
              ReturnDataCMSBlock={ReturnDataCMSBlock}
            />
            <div className={styles.SharedSocialMediaIcons}>
              <Link
                href="https://www.facebook.com/profile.php?id=100088095545673&amp;mibextid=LQQJ4d&amp;rdid=GzonofqiS7wvqQ9V&amp;share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FhijNeHjqKVeZ4eJM%2F%3Fmibextid%3DLQQJ4d"
                aria-label="Facebook"
              >
                <div className={styles.socialIcon}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </div>
              </Link>
              <Link href="http://twitter.com/Headora" aria-label="Twitter">
                <div className={styles.socialIcon}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </div>
              </Link>
              <Link
                href="http://www.pinterest.com/Headora"
                aria-label="Pinterest"
              >
                <div className={styles.socialIcon}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M8 12a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                    <path d="M21 12c0 4.418 -4.03 8 -9 8a9.76 9.76 0 0 1 -2.24 -.267" />
                    <path d="M9 15l-3 6" />
                    <path d="M11 4c2.667 .667 4 2 4 4" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <DetailNavbar
        currentVariant={currentVariant ? currentVariant : Data}
        Data={Data}
      />
      <div id="reviewssection"></div>
    </>
  );
}

export default ProductDetail;
