import { Client } from "@/graphql/client";


function returns({CMSPageData}:any){
    const sanitizedHtml = CMSPageData?.data?.cmsPage?.content;
    return(
        <>
        <div className="returns_page_free_space"></div>
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        </>
    )
}
export default returns

export async function getStaticProps() {
  const client = new Client();
  let CMSPageData = null;


  try {
    CMSPageData = await client.fetchReturnsCMSPages();

  } catch (error) {

  }


  return {
    props: {
      CMSPageData,
   
    },

  };
}