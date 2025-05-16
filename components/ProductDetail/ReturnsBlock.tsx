import Link from "next/link";
import styles from "../../styles/ProductDetail.module.css";
import { useEffect, useState } from "react";

function ReturnsBlock({ PDPReturnCMSBlock, Data }: any) {
  const [filteredHtml, setFilteredHtml] = useState<string>("");

  useEffect(() => {
    setTimeout(() => {
    const sanitizedHtml = PDPReturnCMSBlock?.data?.cmsPage?.content;

    if (sanitizedHtml && Data?.return_policy) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(sanitizedHtml, "text/html");
      const targetDiv = doc.getElementById(Data.return_policy);

      if (targetDiv) {
        setFilteredHtml(targetDiv.outerHTML);
      } else {
        setFilteredHtml(""); // Fallback if no match
      }
    }
      }, 2000);
  }, [PDPReturnCMSBlock, Data]);

  return (
    <>
      {filteredHtml && (
        <div className={styles.returnDescribtionConatiner}>
          <div dangerouslySetInnerHTML={{ __html: filteredHtml }} />
          <span>
            <Link href={"/returns"}>VIEW RETURN POLICY</Link>
          </span>
        </div>
      )}
    </>
  );
}

export default ReturnsBlock;
