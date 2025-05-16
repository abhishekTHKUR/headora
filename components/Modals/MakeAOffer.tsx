// components/MakeAOffer.tsx
import React, { useEffect, useState } from "react";
import styles from "../../styles/MakeAOffer.module.css";



const MakeAOffer = ({ sku, productName, price, specialPrice, productID,customerID }:any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    cname: "",
    cemail: "",
    psku: sku,
    pname: productName,
    pprice: price.replace(/^\$/, ""),       // Removes $ from the beginning
    spprice: specialPrice.replace(/^\$/, ""), // Same here
    psprice: "", // user input
    your_message: "",
    product_id: productID,
    customer_id: customerID,
  });
  

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${process.env.baseURLWithoutTrailingSlash}/pricebargain/enquiry/index/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const result = await response.json();
      console.log("API Response:", result);
     
      toggleModal();
    } catch (error) {
      console.error("Submission error:", error);

    }
  };
  
  return (
    <>
      <button onClick={toggleModal} className={styles.offerButton}>
        Make an Offer
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={toggleModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <h2>Make an Offer</h2>
            <div className={styles.inputWrapper}>
              <div className={styles.inputGroup}>
              <label>Name</label>
              <input name="cname" value={formData.cname} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
              <label>Email</label>
              <input name="cemail" value={formData.cemail} onChange={handleChange} required />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Product SKU</label>
              <input name="psku" value={formData.psku} onChange={handleChange} readOnly />
            </div>
            <div className={styles.inputGroup}>
            <label>Product Name</label>
              <input name="pname" value={formData.pname} onChange={handleChange} readOnly />
            </div>
            <div className={styles.inputWrapper}>
            <div className={styles.inputGroup}>
              <label>Product Price</label>
              <input name="pprice" value={'$'+formData.pprice} onChange={handleChange} readOnly />
            </div>
            <div className={styles.inputGroup}> 
              <label>Special Price</label>      
              <input type="spprice" name="specialPrice" value={'$'+formData.spprice} onChange={handleChange} readOnly />
            </div>  
            </div>
            <div className={styles.inputGroup}> 
              <label>Make A Offer</label>      
              <input type="psprice" name="makeAOffer" value={'$'+formData.psprice} onChange={handleChange} />
            </div>  
            <div className={styles.inputGroup}>
              <label>Message</label>
              <textarea name="your_message" value={formData.your_message} onChange={handleChange} />
            </div>
            <div className={styles.ButtonGroup}>
              <button type="submit" className={styles.submitButton}>Submit Offer</button>
              <button type="button" className={styles.closeButton} onClick={toggleModal}>Close</button>
            </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MakeAOffer;
