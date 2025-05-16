import { Client } from "@/graphql/client";
import styles from "../../styles/AuthenticityPromise.module.css"
import Link from "next/link";

function AuthenticityPromise({ CMSPageData }: any) {
    const sanitizedHtml = CMSPageData?.data?.cmsPage?.content;

    return (

        <>
        <div className={styles.navBarSpace}></div>
        <nav className={styles.breadcrumbNav}>
                <Link className={styles.breadcrumbItem} href={'/'}>Home</Link>
                <span className={styles.breadcrumbSeparator}>/</span>
                <span className={styles.breadcrumbItemEnd}>Authenticity Promise</span>
            </nav>
            <div
                dangerouslySetInnerHTML={{
                    __html: sanitizedHtml,
                }}
            />
        </>
    )
}
export default AuthenticityPromise


export async function getStaticProps() {
    const client = new Client();
    let CMSPageData = null;

    try {
        CMSPageData = await client.fetchAuthenticityPromisePage();
    } catch (error) {

    }

    return {
        props: {
            CMSPageData,
        },
    };
}
