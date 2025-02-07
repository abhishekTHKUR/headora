import React, { useEffect, useState } from 'react';
import ProductDetail from '../../components/ProductDetail/ProductDetail';
import { Client } from '../../graphql/client';
import ReviewSection from '../../components/ProductDetail/ReviewSection';

import ReletedProducts from '../../components/ProductDetail/ReletedProducts';


import { createFiltersFromAggregations, createProductsFromMagProducts } from '../../components/ConfigureProduct';
import Head from 'next/head';
import { useRouter } from 'next/router';



// // Generate BreadcrumbList schema
// const BreadcrumbSchema = ({ breadcrumbs, products }: any) => {
//   const schemaData = {
//     "@context": "https://schema.org",
//     "@type": "BreadcrumbList",
//     "itemListElement": (breadcrumbs.length > 0
//       ? breadcrumbs
//       : [
//           {
//             name: "Home",
//             path: `${process.env.baseURLWithoutTrailingSlash}`,
//           },
//           // Only include the category breadcrumb if categories exist
//           ...(products?.categories?.length > 0
//             ? [
//                 {
//                   "@type": "ListItem",
//                   "position": 2,
//                   name:
//                     products?.categories?.[0]?.name === "Support" &&
//                     products?.categories?.[1]?.name
//                       ? products?.categories?.[1]?.name
//                       : products?.categories?.[0]?.name || "",
//                   path: `${
//                     process.env.baseURLWithoutTrailingSlash
//                   }/${
//                     products?.categories?.[0]?.name === "Support" &&
//                     products?.categories?.[1]?.url_key
//                       ? products?.categories?.[1]?.url_key
//                       : products?.categories?.[0]?.url_key || ""
//                   }/`,
//                 },
//               ]
//             : []),
//         ]
//     ).map((crumb: any, index: number) => ({
//       "@type": "ListItem",
//       "position": index + 1,
//       "name": crumb?.name,
//       "item": crumb?.path,
//     })),
//   };

//   return (
//     <script
//       type="application/ld+json"
//       dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
//     />
//   );
// };


// const ProductSchema = ({ product, aggregations, schemaImage, price,metaDiscription }: any) => {

//   const getBrandName = () => {
//     const brandAggregation = aggregations.find(
//       (element: any) => element.attribute_code === 'brand'
//     );
//     return brandAggregation ? brandAggregation.options[0].label : '';
//   };
//   const extractTagValue = (prefix: string): string | null => {
//     const tag = product.tags.find((tag: string) => tag.startsWith(prefix));
//     return tag ? tag.split('--')[1] : null;
//   };
//   const material = extractTagValue('metal_type');
//   const color = extractTagValue('dial_color');
//   const reviews: any = product.reviews?.items || [];

//   const aggregateRating =
//     reviews.length > 0
//       ? {
//         "@type": "AggregateRating",
//         "ratingValue": (
//           reviews.reduce(
//             (sum: number, review: any) => sum + review?.average_rating,
//             0
//           ) / reviews.length
//         ).toFixed(1),
//         "reviewCount": reviews.length,
//         "bestRating": "100",
//         "worstRating": "0",
//       }
//       : null;

      
//   const reviewSchema = reviews.map((review: any) => ({

//     "@type": "Review",
//     "name": review?.summary,
//     "reviewBody": review?.text,
//     "reviewRating": {
//       "@type": "Rating",
//       "ratingValue": review?.average_rating?.toString(),
//       "bestRating": "100",
//       "worstRating": "0",
//     },
//     "datePublished": review?.created_at,
//     "author": { "@type": "Person", "name": review?.nickname },
//   }));
  
//   const schemaData = {
//     "@context": "https://schema.org/",
//     "@type": "Product",
//     "name": product?.meta_title ? product?.meta_title : product?.name,
//     "sku": product?.sku,
//     "mpn": product?.sku,
//     "description": metaDiscription,
//     "url": `${process.env.baseURL}product/${product?.url_key}/`,
//     "image": schemaImage,
//     "brand": {
//       "@type": "Brand",
//       "name": getBrandName() || "eCommerce"
//   },
//     ...(!(!material || material.length === 0) && { material }),
//     ...(!(!color || color.length === 0) && { color }),
//     "offers": {
//       "@type": "Offer",
//       "priceCurrency": "USD",
//       "price": price,
//       "availability": "https://schema.org/InStock",
//       "itemCondition": "https://schema.org/NewCondition",
//       "priceValidUntil": "2026-12-31T23:59:59Z",
//       "shippingDetails": {
//         "@type": "OfferShippingDetails",
//         "shippingRate": {
//           "@type": "MonetaryAmount",
//           "value": price,
//           "currency": "USD"
//         }
//       }
//     },
//     ...(aggregateRating && { aggregateRating }),
//     ...(reviewSchema?.length > 0 && { review: reviewSchema }),
//   };

//   return (
//     <script
//       type="application/ld+json"
//       dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
//     />
//   );
// };



function Product({ productData, aggregations, reviews, categories }: any) {
  const [schemaImage, setSchemaImage] = useState<any>('')
  const [breadcrumbs, setBreadcrumbs] = useState<any>([]);
  const [price, setPrice] = useState<any>()

  // ===========Bread Crumbs Logic========== 
  const router = useRouter()
  const slug = router.query.slug
  useEffect(() => {
    // Retrieve breadcrumbs data from sessionStorage on the first render
    if (typeof window !== 'undefined') {
      const storedBreadcrumbs = sessionStorage.getItem('breadcrumbs');
      if (storedBreadcrumbs) {
        setBreadcrumbs(JSON.parse(storedBreadcrumbs));
        // Clear breadcrumbs from sessionStorage
        sessionStorage.removeItem('breadcrumbs');
      }
    }
  }, []);

  function getMetaDescription(description: any) {
    let htmlData = description.html ? description.html : description
    htmlData = htmlData + ' '
    htmlData = htmlData.replaceAll(/(?:\r\n|\r|\n)/g, '<br>')
    htmlData = htmlData.replaceAll('<br><br>', '<br>')
    htmlData = htmlData.replaceAll('</p><br><p>', '</p><p>')
    htmlData = htmlData.replace(/<style[^>]*>.*<\/style>/g, '')
      // Remove script tags and content
      .replace(/<script[^>]*>.*<\/script>/g, '')
      // Remove all opening, closing and orphan HTML tags
      .replace(/<[^>]+>/g, '')
      // Remove leading spaces and repeated CR/LF
      .replace(/([\r\n]+ +)+/g, '');

    return htmlData.slice(0, 160)
  }
  

    const metaDiscription = productData ? productData.meta_description ||  getMetaDescription(productData.short_description || productData.description)  : " "; 
  
  const fileExtension = schemaImage?.split('.').pop()?.toLowerCase() || "jpg";
  return (
    <>
      {/* <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${process.env.baseURLWithoutTrailingSlash}/product/${slug}/`} />

        <title>{productData?.meta_title ? productData?.meta_title : productData?.name} </title>
      

        <meta name="title" content={`${productData?.meta_title ? productData?.meta_title : productData?.name}`} />
        <meta name="description"
          content={ metaDiscription}
        />
        <meta name="keywords" content={productData?.meta_keyword ? productData?.meta_keyword : 'eCommerce'} />


        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${productData?.meta_title ? productData?.meta_title : productData?.name}`} />
        <meta property="og:description"
          content={
            metaDiscription
          }
        />
        <meta property="og:url" content={`${process.env.baseURL}product/${productData?.url_key}/`} />
        <meta property="og:site_name" content="Luxverse" />
        <meta property="og:image" content={schemaImage} />
        <meta property="og:image:secure_url" content={schemaImage} />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
        <meta property="og:image:type" content={`image/${fileExtension}`} />
        <meta property="og:price:amount" content={price} />
        <meta property="og:price:currency" content="USD" />


        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${productData?.meta_title ? productData?.meta_title : productData?.name}`} />
        <meta name="twitter:description"
          content={metaDiscription}
        />
        <meta name="twitter:image" content={schemaImage} />

        <meta itemProp="name" content={productData?.name} />
        <meta itemProp="description"
          content={metaDiscription}
        />
        <meta itemProp="image" content={schemaImage} />
      </Head> */}

      {/* <BreadcrumbSchema breadcrumbs={breadcrumbs} products={productData} />
      <ProductSchema product={productData} aggregations={aggregations} schemaImage={schemaImage} price={price} metaDiscription={metaDiscription} /> */}
      <ProductDetail setSchemaImage={setSchemaImage} Data={productData} aggregations={aggregations} categories={categories} breadcrumbs={breadcrumbs} setPrice={setPrice} />
      {/* <ReviewSection Data={productData} AllReviews={reviews} /> */}
      {/* <ReletedProducts Data={productData} /> */}

    </>
  );
}
export default Product


export async function getStaticPaths() {
  const client = new Client();
  let currentPage = 1;
  let TotalPages = 1;

  let all_paths: any[] = [];

  // Fetch all product URLs to generate paths for each product
  while (currentPage <= TotalPages) {
    const urlData = await client.fetchProductDetailsAllUrl(currentPage);
    TotalPages = urlData?.data?.products?.page_info?.total_pages;
    currentPage = currentPage + 1;

    // Generate an array of paths with params from fetched URLs
    const paths = urlData?.data?.products?.items.map((product: any) => ({
      params: { slug: product.url_key }, // Assuming 'url_key' is the slug field
    }));

    all_paths = [...all_paths, ...paths]; // Accumulate paths
  }

  return {
    paths: all_paths, // Return 'paths' instead of 'all_paths'
    fallback: false,  // Use 'blocking' or 'true' depending on your needs
  };
}

const sanitizeData = (productData: any): any => {
  const sanitizedVariants = productData.variants.map((variant:any) => ({
    ...variant,
    variant_name: variant.variant_name ?? null, // Replace undefined with null
  }));

  return {
    ...productData,
    variants: sanitizedVariants,
  };
};

export async function getStaticProps({ params }: any) {
  const client = new Client();
  const urlKey = params.slug;
  
  try {
    // Fetch the product details using the slug (urlKey)
    const product = await client.fetchProductDetail(urlKey);
    let productsResult = product.data.products || null


    // Get Review all value data from fetchAllReviewValue
    const reviews = await client.fetchAllReviewValue() || null

    let { filters, optionValueMap } = await createFiltersFromAggregations(productsResult.aggregations);
    let configuredProducts = await createProductsFromMagProducts(productsResult.items, filters, optionValueMap);
    const productData = configuredProducts[0] || null;
    const aggregations = productsResult.aggregations || [];
    const sanitizedData = sanitizeData(productData);
    // if (!productData) {
    //   return {
    //     props: {
    //       productData: null,
    //       aggregations: [],
    //       reviews: null,
    //     },
    //   };
    // }

    return {
      props: {
        productData:sanitizedData,
        aggregations,
        reviews,
      },
    };
  } catch (error) {
    return {
      props: {
        productData: null,
        aggregations: [],
        reviews: null,
      },
    };
  }
}

