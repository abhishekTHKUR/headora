import Head from "next/head";
function Layout({ children }: any) {
    return (
        <>
            <Head>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
                <link rel="icon" type="image/png" sizes="64x64" href="/favicon.ico" />
            </Head>
            <main>
                {children}
            </main>
        
        </>
    )
}
export default Layout