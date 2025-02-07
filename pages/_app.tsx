import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Layout from "@/components/Layout/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextPageContext } from "next";
import { Client } from "@/graphql/client";
import Ribbon from "@/components/Ribbon/Ribbon";
import { useEffect, useState } from "react";
import MobileHeader from "@/components/Header/MobileHeader";

function App({ categoriesList, Component, pageProps }: any) {
  const [showRibbon, setShowRibbon] = useState<any>(false);
  const [isMobile, setIsMobile] = useState<any>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowRibbon(window.scrollY === 0); // Hide Ribbon if the user has scrolled
    };

    window.addEventListener("scroll", handleScroll);
    const timer = setTimeout(() => {
      setShowRibbon(true);
    }, 1000);
    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <Layout>
      {!isMobile && showRibbon && <Ribbon />}
        {isMobile ? (
          <MobileHeader categoriesList={categoriesList} />
        ) : (
          <Header categoriesList={categoriesList} />
        )}
        <Component {...pageProps} />
        <Footer />
      </Layout>
    </>
  )
}
App.getInitialProps = async (ctx: NextPageContext) => {
  const client = new Client
  const response = await client.fetchCategories();

  return { categoriesList: response }

}
export default App