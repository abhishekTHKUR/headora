import { Client } from "@/graphql/client";

function WatchWarranty({CMSPageData}:any){

    const sanitizedHtml = CMSPageData?.data?.cmsPage?.content;
    return(
        <>
      <div className="warranty-free-space"></div>
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    </>
)
}
export default WatchWarranty

export async function getStaticProps() {
  const client = new Client();
  let CMSPageData = null;


  try {
    CMSPageData = await client.fetchWatchWarrantyCMSPages();

  } catch (error) {

  }


  return {
    props: {
      CMSPageData,
   
    },

  };
}