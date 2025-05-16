import { Client } from "@/graphql/client";

function Shipping({CMSPageData}:any){
    const sanitizedHtml = CMSPageData?.data?.cmsPage?.content;
    return(
        <>
      
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />

        </>
    )
}
export default Shipping

export async function getStaticProps() {
  const client = new Client();
  let CMSPageData = null;


  try {
    CMSPageData = await client.fetchShippingCMSPages();

  } catch (error) {

  }


  return {
    props: {
      CMSPageData,
   
    },

  };
}
