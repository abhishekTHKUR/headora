
import { Client } from "@/graphql/client";



function BitpayTerms({ CMSPageData }: any) {
    const sanitizedHtml = CMSPageData?.data?.cmsPage?.content;

    return (

        <>
            <div
                dangerouslySetInnerHTML={{
                    __html: sanitizedHtml,
                }}
            />
        </>
    )
}
export default BitpayTerms


export async function getStaticProps() {
    const client = new Client();
    let CMSPageData = null;

    try {
        CMSPageData = await client.fetchBitpayTermsPage();
    } catch (error) {

    }

    return {
        props: {
            CMSPageData,
        },
    };
}
