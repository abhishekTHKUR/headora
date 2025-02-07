import CategoriesProducts from '@/components/Category/CategoriesProducts'
import CategoryHeader from '@/components/Category/CategoryHeader'
import Content from '@/components/Category/Content'
import CollectionBreadCrumbs from '@/components/Collection/CollectionBreadCrumbs'
import CollectionContent from '@/components/Collection/CollectionContent'
import CollectionHeader from '@/components/Collection/CollectionHeader'
import CollectionListing from '@/components/Collection/CollectionListing'
import CollectionReletatedProducts from '@/components/Collection/CollectionReletatedProducts'
import SubCollectionListing from '@/components/Collection/SubCollectionListing'
import { Client } from '@/graphql/client'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

// Define the types for the collection data
interface CollectionProps {
  collection: {
    name: string;
    description?: string;
    [key: string]: any;
  };
}

const CategorySchema = ({ category, url }: any) => {

  return (

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "CollectionPage",
          "name": category?.meta_title ? category?.meta_title : category?.name,
          "description": category?.meta_description,
          "image": category?.image || '/default-image.jpg',
          "url": `${process.env.baseURLWithoutTrailingSlash}${url?.slug}`
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
        : `${process.env.baseURLWithoutTrailingSlash}${breadcrumb?.path}/`, // Adds a trailing slash for other items
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

// Static Paths
export const getStaticPaths: GetStaticPaths = async () => {
  const client = new Client();

  try {
    const response = await client.fetchCategories();
    const allUrl = response?.data?.categories?.items?.[0];

    const extractUrlKeys = (children: any[]): string[] => {
      let keys: string[] = [];
      children?.forEach((child) => {
        if (child?.url_key) {
          keys.push(child?.url_key);
        }
        if (child?.children && child?.children.length > 0) {
          keys = [...keys, ...extractUrlKeys(child?.children)];
        }
      });
      return keys;
    };

    const paths = extractUrlKeys(allUrl?.children || []).map((url_key) => ({
      params: { slug: url_key } // Adjust this if you're dealing with multiple levels, e.g., slug2 or slug3
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    return {
      paths: [],
      fallback: false,
    };
  }
}



// Static Props
export const getStaticProps: GetStaticProps = async ({params, query}:any) => {
  const client = new Client();
  const urlKey = params?.slug as string;
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
  const collectionData = await client.fetchCollectionPage(urlKey as string);
  const collection = collectionData?.data?.categoryList?.[0] || null;

  const category = await fetchCategoryByURLKey(urlKey as string, page) || null;
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



// Collection Component
const Collection = ({ allProduTList, category, productsRes, collection,categories
}: any) => {

  const router = useRouter()
  const url = router.query
  // ===========================BreadCrumbs Management=======================================

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
        const result = findCategoryName(key, item?.children);
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
  // Store breadcrumbs in session storage on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('breadcrumbs', JSON.stringify(breadcrumbs));
    }
  }, [breadcrumbs]);

  const CategoryImage = collection?.image || '/default-image.jpg'
  const fileExtension = CategoryImage.split('.').pop()?.toLowerCase() || "jpg";

  const description = collection?.description || null
  const shortDescription = collection?.short_description || null
  const CollectionDescription = collection?.description || null
  return (
    <>
      {/* <Head>
      <meta charSet="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${process.env.baseURLWithoutTrailingSlash}/${slug}/`}/>

        <title>{collection?.meta_title || collection?.name}</title>
        <meta name="title" content={collection?.meta_title || collection?.name}/>
        {collection?.meta_description && (
          <meta name="description" content={collection?.meta_description}/>
        )}
        {collection?.meta_keywords && (
          <meta name="keywords" content={collection?.meta_keywords}/>
        )}
 


        <meta property="og:type" content="category"/>
        <meta property="og:title" content={collection?.meta_title || collection?.name}/>
        {collection?.meta_description && (
        <meta property="og:description" content={collection?.meta_description}/>
        )}
        <meta property="og:image" content={CategoryImage}/>
        <meta property="og:image:secure_url" content={CategoryImage}/>
        <meta property="og:image:width" content="800"/>
        <meta property="og:image:height" content="800"/>
        <meta property="og:image:type" content={`image/${fileExtension}`}/>
        <meta property="og:url" content={`${process.env.baseURLWithoutTrailingSlash}/${slug}/`}/>
        <meta property="og:site_name" content="eCommerce"/>


        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={collection?.meta_title || collection?.name}/>
        {collection?.meta_description && (
        <meta name="twitter:description" content={collection?.meta_description}/>
        )}
        <meta name="twitter:image" content={CategoryImage}/>
      </Head>

      
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      <CategorySchema category={collection} url={url}/> */}
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
}

export default Collection;
