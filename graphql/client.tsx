
import IOSAppPage from "@/pages/ios-app";
import AuthenticityPromise from "./AuthenticityPromise";
import BitPayTerms from "./BitPayTerms";
import fetchCategoriesQuery from "./categories";
import GET_CMS_PAGE from "./cmsPage";
import fetchCollectionByURL from "./Collection_URL_Key";
import fetchProductBySKU from "./fetchProductBySKU";
import FooterCMS from "./FooterCMS";
import GET_GLOSSARY_PAGE from "./GlossaryCMS";
import fetchProductdetailallURLKey from "./ProductDetail";
import fetchProductDetailURLKey from "./ProductDetail_URL_Key";
import GET_RETURNS_PAGE from "./Returns";
import ReviewRating from "./ReviewRating";
import ReviewsAllValues from "./ReviewsAllValues";
import fetchSearch from "./Search";
import SearchProductResult from "./SearchProductResult";
import GET_CMS_SHIPPING_PAGE from "./ShippingPage";
import GET_CMS_SIZE_AND_FIT_PAGE from "./SizeAndFitPage";
import fetchSSGCategoriesQuery from "./ssrCategory";
import fetchSubCategory from "./SubCategory";
import fetchSubCategoryByURL from "./SubCategory_URL_Key";
import TopRibbon from "./TopRibbonCMS";
import GET_WATCHES_WARRANTY_PAGE from "./watchesWarrantycms";
import IOSApp from "./IOSApp";
import StockStatus from "./StockStatus";
import FETCH_SELL_OLD_USED_JEWELRY_WACHES_ONLINE_PAGE from "./FetchSellOldUsedJewelryWatchesOnlineData";
import PDPReturnCMSBlock from "./PDPReturnCMSBlock";
import CategoryProductsStockStatus from "./CategoryProductsStockStatus";

export class Client {

    async fetchCategories() {
        try {

            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: fetchCategoriesQuery }),
            });

            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors

            }
        } catch (error) {

            return "Error"
        }
    };
    async fetchBoutiqueCategories() {
        try {

            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                     
                },
                body: JSON.stringify({ query: fetchCategoriesQuery }),
            });
            
            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                return response

            }
        } catch (error) {

            return "Error"
        }
    };

    async fetchCMSPages() {
        try {
            const identifier = "headora-home-page";
            const query = GET_CMS_PAGE(identifier); 
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query}),
            });

            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors

            }
        } catch (error) {

            return "Error"
        }
    };
    async fetchBouitqueCMSPages() {
        try {
            const identifier = "home-page-boutique";
            const query = GET_CMS_PAGE(identifier); 
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query}),
            });
            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors

            }
        } catch (error) {

            return "Error"
        }
    };
    async fetchShippingCMSPages() {
        try {
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: GET_CMS_SHIPPING_PAGE }),
            });

            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors

            }
        } catch (error) {

            return "Error"
        }
    };
    async fetchSizeAndFitCMSPages() {
        try {
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: GET_CMS_SIZE_AND_FIT_PAGE }),
            });

            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors

            }
        } catch (error) {

            return "Error"
        }
    };

    
    async fetchReturnsCMSPages() {
        try {
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: GET_RETURNS_PAGE }),
            });

            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors

            }
        } catch (error) {

            return "Error"
        }
    };
    
    async fetchSellOldUsedJewelryWatchesOnline() {
        try {
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: FETCH_SELL_OLD_USED_JEWELRY_WACHES_ONLINE_PAGE }),
            });

            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors

            }
        } catch (error) {

            return "Error"
        }
    };
    async fetchGlossaryCMSPages() {
        try {
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: GET_GLOSSARY_PAGE }),
            });

            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors

            }
        } catch (error) {

            return "Error"
        }
    };

    
    async fetchWatchWarrantyCMSPages() {
        try {
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: GET_WATCHES_WARRANTY_PAGE }),
            });

            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors

            }
        } catch (error) {

            return "Error"
        }
    };


    async fetchProductDetailsAllUrl(currentPage:number){
        try {
            const query = fetchProductdetailallURLKey(currentPage); 
             
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query}),
            });
             
            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };

    async fetchProductDetail(urlKey:any){
        try {
            const query = fetchProductDetailURLKey(urlKey); 

            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query}),
            });
             
            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };

    async fetchAllReviewValue(){
        try {
         
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: ReviewsAllValues}),
            });
          
            if (response.ok) {
                const data = await response.json();
                return data.data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };

    async fetchCollectionPage(urlKey:any){
        try {
            const query = fetchCollectionByURL(urlKey); 
             
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query}),
            });
             
            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };

   async fetchboutiqueCollectionPage(urlKey:any){
        try {
            const query = fetchCollectionByURL(urlKey); 
             
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                     
                },
                body: JSON.stringify({ query}),
            });
             
            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };

    async fetchTopRibbion(){
        try {
         
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: TopRibbon}),
            });
             
            if (response.ok) {
                const data = await response.json();
                return data.data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };
   async fetchPDPReturnCMSBlock(){
        try {
         
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: PDPReturnCMSBlock}),
            });
             
            if (response.ok) {
                const data = await response.json();
                return data.data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };
    async fetchSubCategoryDataByUrlKey(urlKey:any, currentPage: number){
        try {
            const query = fetchSubCategoryByURL(urlKey,currentPage); 
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                   
                },
                body: JSON.stringify({ query}),
            });
             //console.log(response,'response')
            if (response.ok) {
                const data = await response.json();
                return data.data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };

    
    async fetchSubCategoryDataByUrlKeyForBoutique(urlKey:any, currentPage: number){
        try {
            const query = fetchSubCategoryByURL(urlKey,currentPage); 
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                       
                },
                body: JSON.stringify({ query}),
            });
             
            if (response.ok) {
                const data = await response.json();
                return data.data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };
    async fetchSubCategoryData(uid:any,currentPage: number){
        try {
            const query = fetchSubCategory(uid, currentPage); 
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query}),
            });
             
            if (response.ok) {
                const data = await response.json();
                return data.data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };

    async fetchboutiqueSubCategoryData(uid:any,currentPage: number){
        try {
            const query = fetchSubCategory(uid, currentPage); 
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                     
                },
                body: JSON.stringify({ query}),
            });
             
            if (response.ok) {
                const data = await response.json();
                return data.data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };

    async fetchProductBySKU(urlKey:any){
        try {
            const query = fetchProductBySKU(urlKey); 
           
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query}),
            });
             
            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };

    async fetchSSGSubCategoryData(){
        try {
            const query = fetchSSGCategoriesQuery(); 
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query}),
            });
             
            if (response.ok) {
                const data = await response.json();
                return data.data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };   
    async fetchSearchResult(text:any,currentPage: number){
        try {
            const query = fetchSearch(text, currentPage); 
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query}),
            });
             
            if (response.ok) {

                
                const responsedata = await response.json();
                return responsedata.data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };
    async fetchFooterCMS(){
        try {
         
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: FooterCMS}),
            });
             
            if (response.ok) {
                const data = await response.json();
                return data.data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    };

    async fetchSearchProductResult(text: any, currentPage: any, filter: any) {
        try {
            const query = SearchProductResult(text, currentPage, filter); 
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query}),
            });
             
            if (response.ok) {

                
                const responsedata = await response.json();
                return responsedata.data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    } 
    
    async fetchReviewSection(
        SKU:any,
        NickName:any,
        Summary:any,
        Text:any,
        QualityLabel:any, 
        QualityValue:any, 
        ValueLabel:any, 
        ValueValue:any,
        PriceLabel:any,
        PriceValue:any
    ){
        try {
            const query = ReviewRating(SKU,NickName,Summary,Text,QualityLabel,QualityValue,ValueLabel,ValueValue,PriceLabel,PriceValue); 
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query}),
            });
             
            if (response.ok) {

                
                const responsedata = await response.json();
                return responsedata.data
            } else {
                // Handle errors
                 
            }
        } catch (error) {
             
            return "Error"
        }
    } 

    async fetchAuthenticityPromisePage() {
        try {
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: AuthenticityPromise }),
            });

            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors

            }
        } catch (error) {

            return "Error"
        }
    };

    async fetchIosAppPage() {
        try {
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: IOSApp }),
            });

            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors

            }
        } catch (error) {

            return "Error"
        }
    };
        
    async fetchStockStatus(urlKry: any) {
        try {
            const query = StockStatus(urlKry); 
    
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }), 
            });
    
             ;
            
            if (response.ok) {
                const data = await response.json();
                return data.data;
            } else {
                // Handle errors
                 
                return null; // Return null or handle it as needed
            }
        } catch (error) {
             
            return "Error";
        }
    }
    async fetchCategoryProductsStockStatus(urlPath: any, currentPage: number) {
        
        try {
            const query = CategoryProductsStockStatus(urlPath, currentPage); 
    
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }), 
            });
  
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                // Handle errors
                 
                return null; // Return null or handle it as needed
            }
        } catch (error) {
             
            return "Error";
        }
    }
    async fetchBitpayTermsPage() {
        try {
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: BitPayTerms }),
            });

            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                // Handle errors

            }
        } catch (error) {

            return "Error"
        }
    };
}
