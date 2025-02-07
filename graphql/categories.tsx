const fetchCategoriesQuery = `
query {
  categories{
  items{
  
uid
    children{
     url_key
        name
       uid
       
     children{
      url_key
        name
       uid
       children{
        url_key
        name
       uid
}
  }

  }
  }
}
}
`;
export default fetchCategoriesQuery