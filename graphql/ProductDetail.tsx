const fetchProductdetailallURLKey = (currentPage: number = 1) =>`
query {
  products(filter: { }
  pageSize:300
  currentPage:${currentPage},
 ) {
    page_info{
    page_size
      total_pages
    current_page}
    items{
url_key
sku
    }
    }
  }`

export default fetchProductdetailallURLKey