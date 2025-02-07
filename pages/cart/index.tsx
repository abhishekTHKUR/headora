import React from 'react';
import styles from '../../styles/Cart.module.css';


function Cart() {


  const Data = {
    related_products: [
      {
        uid: "prod1",
        name: "Rolex Datejust 36mm Steel Watch Diamonds Emeralds Bezel/Lugs/Gray Diamond Dial ",
        image: { url: "/Images/Rolex_test_watch.jpg" },
        price: { regularPrice: { amount: { value: 29.99 } } }
      },
      {
        uid: "prod2",
        name: "Rolex Datejust 36mm Steel Watch Diamonds Emeralds Bezel/Lugs/Gray Diamond Dial",
        image: { url: "/Images/Rolex_test_watch.jpg" },
        price: { regularPrice: { amount: { value: 49.99 } } }
      },
      {
        uid: "prod3",
        name: "Rolex Datejust 36mm Steel Watch Diamonds Emeralds Bezel/Lugs/Gray Diamond Dial",
        image: { url: "/Images/Rolex_test_watch.jpg" },
        price: { regularPrice: { amount: { value: 19.99 } } }
      },
      {
        uid: "prod4",
        name: "Rolex Datejust 36mm Steel Watch Diamonds Emeralds Bezel/Lugs/Gray Diamond Dial",
        image: { url: "/Images/Rolex_test_watch.jpg" },
        price: { regularPrice: { amount: { value: 39.99 } } }
      },
      {
        uid: "prod5",
        name: "Rolex Datejust 36mm Steel Watch Diamonds Emeralds Bezel/Lugs/Gray Diamond Dial",
        image: { url: "/Images/Rolex_test_watch.jpg" },
        price: { regularPrice: { amount: { value: 24.99 } } }
      }
    ]
  };
  
  return (
    <>
      <div className={styles.navBarSpace}></div>
      <div className={styles.body}>

        <div className={styles.steps}>
        <a href="/" className={styles.active} >1. Cart</a>
          <a href="/" className={`${styles.inactive} ${styles.hide}`}>---------------------</a>
          <a href="/" className={styles.inactive}>2. Shipping</a>
          <a href="/" className={`${styles.inactive} ${styles.hide}`}>---------------------</a>
          <a href="/" className={styles.inactive}>3. Payment</a>
        </div>

        <div className={styles.container}>
          <div className={styles.shoppingCart}>
            <h1>Shopping Cart</h1>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th className={styles.price}>Price</th>
                  <th>Qty</th>
                  <th className={styles.subtotal}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.imageTitle}>
                    <img src="/Images/Rolex_test_watch.jpg" alt="Watch" />
                   <p> Rolex Datejust 36mm Steel Watch Diamonds &amp; Emeralds Bezel/Lugs/Gray Diamond Dial </p>
                  </td>
                  <td className={styles.price}>$7,600.00</td>
                  <td className={styles.qty}><input type="text" value="1" /></td>
                  <td className={styles.subtotal}>$7,600.00</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.giftOptions}>
              <h3>Gift options</h3>
              <p>Pick a paper of your choice (optional)</p>
              <label><input type="checkbox" /> Gift Receipt</label>
              <label><input type="checkbox" /> Printed card</label>
            </div>

            <div className={styles.giftCardsWrapper}>
              <h3>Gift Cards</h3>
              <div className={styles.giftCards}>
                <input type="text" placeholder="Enter the gift card code" />
                <button>ADD GIFT CARD</button>
              </div>
            </div>

            <div className={styles.discountCodeWrapper}>
              <h3>Apply Discount Code</h3>
              <div className={styles.discountCode}>
                <input type="text" placeholder="Enter discount code" />
                <button>APPLY DISCOUNT</button>
              </div>
            </div>
          </div>

          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>

            <div className={styles.shippingOptions}>
              <h3>Estimate Shipping and Tax</h3>

              <label>Country</label>
              <select>
                <option>United States</option>
              </select>
              <label>State/Province</label>
              <select>
                <option>State/Province</option>
              </select>
              <label>Zip/Postal Code</label>
              <input type="text" placeholder="Zip/Postal Code" />
            </div>
            <div className={styles.amount_wrapper}>
            <div className={styles.flatRate}>
              <input type="radio" name="shipping" checked /> Flat Rate ($5.00)
            </div>
            <div className={styles.bestWay}>
              <input type="radio" name="shipping" /> Best Way (Table Rate $15.00)
            </div>
            </div>
            <div className={styles.totalPrice}>
              <p>Subtotal <span>$7,600.00</span></p>
              <p>Shipping <span>$5.00</span></p>
              <p className={styles.total}>Order Total <span>$7,605.00</span></p>
            </div>

            <div className={styles.proceed_section}>
              <button>PROCEED TO CHECKOUT</button>
              <span>Check Out with Multiple Addresses</span>
            </div>
          </div>
        </div>
      </div>


<div className={styles.shippingContainer}>
  <div>
    <img src="/Images/black delivery.png" alt="delivery" />
    <p>Free <br />U.S. Shipping</p>
  </div>
  <div>
    <img src="/Images/black return.png" alt="delivery" />
    <p>30 DAY <br /> FREE RETURN</p>
  </div>
  <div>
    <img src="/Images/black saving.png" alt="delivery" />
    <p>30 DAY <br />FREE RETURN</p>
  </div>
  <div>
    <img src="/Images/black guarantee.png" alt="delivery" />
    <p>30 DAY <br />FREE RETURN</p> 
  </div>
  
</div>
    </>
  );
}

export default Cart;