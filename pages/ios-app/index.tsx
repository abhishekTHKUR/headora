
import { Client } from "@/graphql/client";


function IOSAppPage({ CMSPageData }: any) {
    const sanitizedHtml = CMSPageData?.data?.cmsPage?.content;

    return (

        <>
     <div className="FreeSpaceForIOSApp"></div>
            <div
                dangerouslySetInnerHTML={{
                    __html: sanitizedHtml,
                }}
            />
        </>
    )
}
export default IOSAppPage


export async function getStaticProps() {
    const client = new Client();
    let CMSPageData = null;

    try {
        CMSPageData = await client.fetchIosAppPage();
    } catch (error) {

    }

    return {
        props: {
            CMSPageData,
        },
    };
}
