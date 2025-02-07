const fetchSSGCategoriesQuery = () =>`
query {
  categories{ 
  items{
uid
    url_key
    level
    children{
      products{
      page_info{
        total_pages
      }
    }
     url_key
        name
        level
       uid
     children{
      products{
      page_info{
        total_pages
      }
    }
      url_key
        name
        level
       uid
       children{
        products{
      page_info{
        total_pages
      }
    }
        url_key
        level
        name
       uid
}
  }

  }
  }
}
}
`;
export default fetchSSGCategoriesQuery