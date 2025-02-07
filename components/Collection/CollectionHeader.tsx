import React from 'react'
import styles from '../../styles/CollectionPage.module.css'
import { useRouter } from 'next/router'
import Image from 'next/image'

function CollectionHeader({ Data }: any) {
console.log(Data,'Data')
  const router = useRouter()
  // const HtmlData = Data?.description
  const HtmlData = Data?.short_description || null;
 
  return (
    <>
  <div className={styles.collectionBanner}>
        <section 
          className={styles.collectionHeroContainer} 
          style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${Data?.image || "/Images/placeholder-banner.png"})` }} // Add dynamic background image
        >
          <div className={styles.collectionHeroContent}>
            <h1>{Data?.name}</h1>
            <div className={styles.descrWrapper}>
              <div className={styles.descr}>
                <div dangerouslySetInnerHTML={{ __html:  HtmlData}} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
export default CollectionHeader
