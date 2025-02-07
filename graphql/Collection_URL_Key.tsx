const fetchCollectionByURL = (urlKey: any) => `
query {
  categoryList(filters: { url_key: { eq: "${urlKey}" } }) {
      id
      name
    	uid
  		name
      url_key
         meta_title  
          meta_keywords
    meta_description
         image
     
      description
    children {
      name
      uid
      url_key
         image
     
      description
    children{
        name
      	 uid
         url_key
            image
     
      description
     	children{
        name
       	uid
        image
        url_key
     	children{
        name
       uid
       url_key
}
  }

  }
    }
  }
}


`;

export default fetchCollectionByURL;