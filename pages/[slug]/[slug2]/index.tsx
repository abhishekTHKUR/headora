
import Filter from '@/components/Filters/Filter'
import CategoryHeader from '@/components/Category/CategoryHeader'
import { Client } from '@/graphql/client';
import CategoriesProducts from '@/components/Category/CategoriesProducts';
import { GetStaticPaths } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head'
import Content from '@/components/Category/Content';
import CollectionHeader from '@/components/Collection/CollectionHeader';
import CollectionBreadCrumbs from '@/components/Collection/CollectionBreadCrumbs';
import CollectionListing from '@/components/Collection/CollectionListing';

import CollectionContent from '@/components/Collection/CollectionContent';
import CollectionReletatedProducts from '@/components/Collection/CollectionReletatedProducts';
import SubCollectionListing from '@/components/Collection/SubCollectionListing';
import { useRouter } from 'next/router';
import { useState } from 'react';

const CategorySchema = ({ category, url }: any) => {


  return (

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "CollectionPage",
          "name": category?.meta_title ? category.meta_title : category?.name,
          "description": category?.meta_description,
          "image": category?.image,
          "url": `${process.env.baseURLWithoutTrailingSlash}${url}`
        }),
      }}
    />

  );
};


// BreadcrumbList Schema Component
const BreadcrumbSchema = ({ breadcrumbs }: any) => {
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb?.name,
      "item": index === 0
      ? `${process.env.baseURLWithoutTrailingSlash}${breadcrumb?.path}` 
      : `${process.env.baseURLWithoutTrailingSlash}${breadcrumb?.path}/`, 
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbList),
      }}
    />
  );
};
export const getStaticPaths: GetStaticPaths = async () => {

  const client = new Client();

  const fetchAllCategories = async () => {
    const response = await client.fetchSSGSubCategoryData();

    return response?.categories?.items[0];
  };

  const categories = await fetchAllCategories();


  let paths: { params: { slug: string; slug2: string } }[] = [];

  if (categories?.children) {
    categories.children.forEach((category: any) => {
      if (category.children) {
        category.children.forEach((subCategory: any) => {
          if (category.url_key && subCategory.url_key) {
            paths.push({
              params: { slug: category.url_key, slug2: subCategory.url_key }
            });
          }
        });
      }
    });
  }


  return {
    paths,
    fallback: false,
  };
}


export const getStaticProps: GetStaticProps = async ({ params, query }: any) => {
  const client = new Client();

  // Handle slug and page from params and query
  const slug = params?.slug2 || params?.slug; // Use slug2 if available, fallback to slug
  const page = query?.page ? parseInt(query.page as string, 10) : 1; // Get page from query or default to 1



  // Fetch category data based on URL key
  const fetchCategoryByURLKey = async (urlKey: string, page: number) => {
    try {
    const response = await client.fetchSubCategoryDataByUrlKey(urlKey, page);
    return response?.categoryList[0] || null;
  } catch (error) {
    return null;
  }
};

try {
  const collectionData = await client.fetchCollectionPage(slug as string);
  const collection = collectionData?.data?.categoryList?.[0] || null;

  const category = await fetchCategoryByURLKey(slug as string, page) || null;
  const uid = category?.uid || null;

  // Fetch products for the category by UID and page
  let allProduTList: any[] = []
  const fetchProductsByUID = async (uid: string, currentPage: number) => {
    try {
    const response = await client.fetchSubCategoryData(uid, currentPage);
    return response || null;
  } catch (error) {
    return null;
  }
};

let productsRes = uid ? await fetchProductsByUID(uid, page) : null;
  
  if (productsRes.products) {

    productsRes.products.items.forEach((item: any) => {
      allProduTList.push(item)
    })


    if (productsRes.products.page_info.total_pages > 1) {
      for (var i = 2; i <= productsRes?.products?.page_info?.total_pages; i++) {

        const additionalProducts = await fetchProductsByUID(uid, i);
        if (additionalProducts.products) {

          additionalProducts.products.items.forEach((item: any) => {
            allProduTList.push(item)
          })
        }
      }
    }
  }

  return {
    props: {
      allProduTList,      
      category,           
      currentPage: page,  
      productsRes,        
      collection,         
    },
  };
} catch (error) {
  return {
    props: {
      allProduTList: [],  
      category: null,     
      currentPage: page,  
      productsRes: null,  
      collection: null,   
    },
  };
}
};


const Categories = ({ allProduTList, category, productsRes, collection,categories
  // BlogContent
}: any) => {
  
  const router = useRouter()
  const url = router.asPath
  const CategoryImage = category?.image || '/default-image.jpg'
  const fileExtension = CategoryImage.split('.').pop()?.toLowerCase() || "jpg";
  const { slug, slug2, slug3, ...rest } = router.query;

  // Get all slugs from query
  const slugs = [slug, slug2, slug3, ...Object.values(rest)].filter(Boolean);

  const findCategoryName = (key: string, items?: any): string | null => {
    if (!Array.isArray(items)) return null; // Ensure items is an array

    for (const item of items) {
      if (item.url_key === key) {
        return item.name;
      }
      if (item.children) {
        const result = findCategoryName(key, item.children);
        if (result) return result;
      }
    }
    return null;
  };
  
 // Create breadcrumb array dynamically by matching slugs to category names
 const breadcrumbs = [
  { name: 'Home', path: '' },
  ...slugs.map((slugPart: any, index) => ({
    name: findCategoryName(slugPart, categories?.data?.categories?.items) || slugPart.replace(/-/g, ' '),
    path: `/${slugs.slice(0, index + 1).join('/')}`,
  })),
];
const CollectionDescription = collection?.description || null

  return (
    <>

      {/* <Head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
   
        <meta name="robots" content="index, follow"/>
        <link rel="canonical" href={`${process.env.baseURLWithoutTrailingSlash}${url}`}/>

        <title>{`${category?.meta_title || category?.name}`}</title>
        <meta name="title" content={`${category?.meta_title || category?.name}`}/>
        {category?.meta_description && (
          <meta name="description" content={category?.meta_description}/>
        )}
        {category?.meta_keywords && (
          <meta name="keywords" content={category?.meta_keywords}/>
        )}


        <meta property="og:title" content={`${category?.meta_title || category?.name}`}/>
        {category?.meta_description && (
        <meta property="og:description" content={category?.meta_description}/>
        )}
        <meta property="og:url" content={`${process.env.baseURLWithoutTrailingSlash}${url}`}/>
        <meta property="og:type" content="category"/>
        <meta property="og:image" content={CategoryImage}/>
        <meta property="og:image:secure_url" content={CategoryImage}/>
        <meta property="og:image:width" content="800"/>
        <meta property="og:image:height" content="800"/>
        <meta property="og:image:type" content={`image/${fileExtension}`}/>

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={`${category?.meta_title || category?.name}`}/>
        {category?.meta_description && (
        <meta name="twitter:description" content={category?.meta_description}/>
        )}
        <meta name="twitter:image" content={CategoryImage}/>
      </Head>
      <BreadcrumbSchema breadcrumbs={breadcrumbs}/>
      <CategorySchema category={category} url={url}/> */}

      {category?.display_mode === "PAGE" ? (
        <>
          <CollectionHeader Data={collection} />
          <CollectionBreadCrumbs Data={collection} />
          <SubCollectionListing Collection={collection} />
          <CollectionReletatedProducts Data={category} Collection={collection} />
          {/* <CollectionContent BlogContent={BlogContent}/> */}
          <Content description={CollectionDescription}/>
        </>
      ) : (
        <>
          <CategoryHeader Data={{ name: category?.name, description:category?.short_description }} categories={categories}/>
          <CategoriesProducts
            Data={{ name: category?.name }}
            categoryDetail={category}
            categoriesData={productsRes}
            productsData={allProduTList}
          />
          <Content description={category?.description} />
        </>
      )}
    </>
  );
};

export default Categories;