import { useState } from "react";
import AuthenticityPromiseDescription from "./AuthenticityPromiseDescription";
import ReturnsBlock from "./ReturnsBlock";
import ShortDescription from "./ShortDescription";
import styles from "../../styles/ProductDetail.module.css";
import Image from "next/image";

function ShortDescriptionNavBars({ currentVariant, configurableOptions, Data, aggregations, ReturnDataCMSBlock }: any) {
  const [activeTab, setActiveTab] = useState("details");
console.log(activeTab,'activeTab')
  return (
    <>
      <ul className={styles.ShortDescriptionNavList}>
        <li
          className={activeTab == "details" ? styles.ShortDescriptionActiveTab : ""}
          onClick={() => setActiveTab("details")}
        >
          DETAILS
        </li>
        <li
          className={activeTab == "authenticity" ? styles.ShortDescriptionActiveTab : ""}
          onClick={() => setActiveTab("authenticity")}
        >
          <Image
            src="/Logo/favicon-32x32.png"
            height={18}
            width={18}
            alt="icon"
            style={{ marginRight: "4px" }}
          />
          AUTHENTICITY PROMISE
        </li>
        <li
          className={activeTab == "returns" ? styles.ShortDescriptionActiveTab : ""}
          onClick={() => setActiveTab("returns")}
        >
          RETURNS
        </li>
      </ul>

      {activeTab === "details" && (
        <ShortDescription
          currentVariant={currentVariant}
          configurableOptions={configurableOptions}
          aggregations={aggregations}
        />
      )}
      {activeTab === "authenticity" && <AuthenticityPromiseDescription />}
      {activeTab === "returns" && <ReturnsBlock ReturnDataCMSBlock={ReturnDataCMSBlock} Data={Data}/>}
    </>
  );
}

export default ShortDescriptionNavBars;
