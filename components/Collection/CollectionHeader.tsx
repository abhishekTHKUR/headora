// import React from 'react'
// import styles from '../../styles/CollectionPage.module.css'
// import { useRouter } from 'next/router'
// import Image from 'next/image'

// function CollectionHeader({ Data }: any) {

//   const router = useRouter()
//   // const HtmlData = Data?.description
//   const HtmlData = Data?.short_description || null;
 
//   return (
//     <>
//   <div className={styles.collectionBanner}>
//         <section 
//           className={styles.collectionHeroContainer} 
//           style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${Data?.image || "/Images/placeholder-banner.png"})` }} // Add dynamic background image
//         >
//           <div className={styles.collectionHeroContent}>
//             <h1>{Data?.name}</h1>
//             <div className={styles.descrWrapper}>
//               <div className={styles.descr}>
//                 <div dangerouslySetInnerHTML={{ __html:  HtmlData}} />
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   )
// }
// export default CollectionHeader
import React from 'react';
import styles from '../../styles/CollectionPage.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';

function CollectionHeader({ Data }: any) {
  const router = useRouter();
  const HtmlData = Data?.short_description || null;

  return (
    <>
     <div className={styles.freeSpace}></div>
    <div className={styles.collectionHeaderContainer} style={{ background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${Data?.image || "#1a1e25"})` }}> 
      <div className={styles.textContainer}>
        <h1>{Data?.name}</h1>
        <p dangerouslySetInnerHTML={{ __html:  HtmlData}} />
        <div className={styles.underline}></div>
      </div>
      {/* <div className={styles.imageContainer}>
        <Image
          src={Data?.image || "/Images/placeholder-banner.png"}
          alt="Customer Support"
          width={600}
          height={350}
          className={styles.headerImage}
        />
      </div> */}
    </div>
    </>
  );
}

export default CollectionHeader;
