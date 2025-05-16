import React, { useCallback, useEffect, useState } from 'react'
import { Currency } from '../Currency/currency';
import styles from '../../styles/Categories.module.css';
import { useRouter } from 'next/router';

import Link from 'next/dist/client/link';
import Image from 'next/image';



function SearchProduct({ productsData }: any) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState<any>(1);
    const [totalPages, setTotalPages] = useState(1);



    // Handle page change
    const handlePageChange = (page: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentPage(page);
    };

    function formatPrice(value: number): string {
        // Format the value with locale-specific formatting and fixed to 2 decimals
        return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    function regularPrice(item: any) {
        let final_price = item?.price_range?.maximum_price?.final_price?.value;
        let regular_price = item?.price_range?.maximum_price?.regular_price?.value;
        let currency: any = item?.price?.regularPrice?.amount?.currency;
        if (regular_price != final_price) {
            return `${Currency[currency]}${formatPrice(regular_price)}`
        } else {
            return ''
        }
    }
    function finalPrice(item: any) {
        let final_price = item?.price_range?.maximum_price?.final_price?.value;
        let currency: any = item?.price?.regularPrice?.amount?.currency
        return `${Currency[currency]}${formatPrice(final_price)}`
    }

    function getconfigurablePrice(item: any) {
        let price = item?.price_range?.maximum_price?.regular_price?.value;
        let regular_price = item?.price_range?.maximum_price?.regular_price?.value;
        let currency: any = item?.price_range?.maximum_price?.regular_price?.currency;

        if (regular_price != price) {
            return `${Currency[currency]} ${formatPrice(price)}`;
        } else {
            return ''
        }
    }

    function configurableFinalPrice(item: any) {
        let final_price = item?.price_range?.maximum_price?.final_price?.value;
        let currency: any = item?.price_range?.maximum_price?.regular_price?.currency;
        return `${Currency[currency]}${formatPrice(final_price)}`
    }


    return (
        <>

            {productsData?.length > 0 ? (
                <div className={styles.allProductContainer} >
                    <div className={styles.products}>
                        <div className={styles.watchGrid}>
                            {productsData.length > 0 ? (
                                productsData?.map((product: any, index: any) => {
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
                                        <Link  href={`/product/${product.url_key}`}
                                            key={product.id}
                                            className={styles.watchItem}
                                        >
                                            <Image
                          src={
                            // variantProduct?.media_gallery?.length > 0 && variantProduct?.media_gallery?.[0]?.url
                            // ?
                            // variantProduct?.image?.url
                            //   ? variantProduct.image.url.includes("cache")
                            //     ? variantProduct.image.url.replace(/\/cache\/.*?\//, "/")
                            //     : variantProduct.image.url
                            //   :
                            //   variantProduct?.media_gallery?.[0]?.url.includes("cache")
                            //     ? variantProduct?.media_gallery?.[0]?.url.replace(/\/cache\/.*?\//, "/")
                            //     : variantProduct?.media_gallery?.[0]?.url
                            // : ""
                            variantProduct?.image?.url
                            ? variantProduct.image.url.includes("cache")
                                ? variantProduct.image.url.replace(/\/cache\/.*?\//, "/")
                                : variantProduct.image.url : ""
                          }
                          alt={variantProduct.name}
                          width={500}
                          height={500}
                        />
                                            {variantProduct.name.length > 80 ? variantProduct.name.slice(0, 80) + '...' : variantProduct.name}
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
                                        </Link>
                                    </React.Fragment>
                                    )
                                })
                            ) : (
                                <p className={styles.productNotFoundMessage}>No products found!</p>
                         )}
                        </div>
                    </div>
                </div>
            ) : (
                <p className={styles.NoProduct} >No products found!</p>
            )}
        </>
    );
}
export default SearchProduct;