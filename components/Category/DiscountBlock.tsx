import React from 'react'
import styles from '../../styles/Categories.module.css'
function DiscountBlock() {
  return (
    <>
      <div className={styles.dicountBlockContainer}>
      <div className={styles.dicountBlockContent}>
      <h4>Sign up and get 10% off*</h4>
      <p>Be first to receive updates on new collections, style inspiration, gift ideas and exclusive access. Sign up to the eCommerce Club today and receive 10% off* on your next online purchase (full-price items only). *Terms and conditions apply</p>
      <button>Join the Club</button>
      </div>  
      </div>
    </>
  )
}

export default DiscountBlock