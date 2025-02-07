
import fetchCategoriesQuery from "./categories";
import GET_CMS_PAGE from "./cmsPage";
import fetchCollectionByURL from "./Collection_URL_Key";
import fetchProductdetailallURLKey from "./ProductDetail";
import fetchProductDetailURLKey from "./ProductDetail_URL_Key";
import ReviewRating from "./ReviewRating";
import ReviewsAllValues from "./ReviewsAllValues";
import fetchSSGCategoriesQuery from "./ssrCategory";
import fetchSubCategory from "./SubCategory";
import fetchSubCategoryByURL from "./SubCategory_URL_Key";

export class Client {

    async fetchCategories() {
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
                // Handle errors

            }
        } catch (error) {

            return "Error"
        }
    };

    async fetchCMSPages() {
        try {
            const response = await fetch(`${process.env.magentoEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: GET_CMS_PAGE }),
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
}