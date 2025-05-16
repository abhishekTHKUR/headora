import { useState } from 'react';
import styles from '../../styles/Consignment.module.css';
import BrandAutocomplete from '@/components/consignment/BrandAutocomplete';

function Consignment() {
  const [items, setItems] = useState<{ type: string; brand: string; value: string }[]>([]);
  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');
  const [value, setValue] = useState('');

  const addItem = () => {
    if (type && value) {
      setItems([...items, { type, brand, value }]);
      setType('');
      setBrand('');
      setValue('');
    }
  };

  const deleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>CONSIGNMENT STEP 1 OF 2</h2>
      <p className={styles.subheading}>Tell us about the piece(s) you are shipping in.</p>

      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label>Item Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="">Select Item</option>
            <option value="Watch">Watch</option>
            <option value="Bag">Jewelry</option>
            {/* Add more as needed */}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Brand (If known)</label>
          <BrandAutocomplete />
        </div>

        <div className={styles.inputGroup}>
          <label>
            Approximate Value<br />
            <small>(so we can securely insure your shipment)</small>
          </label>
          <div className={styles.valueInput}>
            <span>$</span>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              min="0"
            />
          </div>
        
        </div>
      </div>

      <div className={styles.itemList}>
        <p>Item(s) You Are Consigning:</p>
        <hr />
        {items.map((item, index) => (
          <div key={index} className={styles.item}>
            {`${index + 1}. ${item.type}, ${item.brand || 'N/A'}, $${item.value}`}
            <button
              type="button"
              onClick={() => deleteItem(index)}
              className={styles.deleteBtn}
            >
              DELETE
            </button>
          </div>
        ))}
        <hr />
      </div>

      <button className={styles.nextBtn}>NEXT</button>
    </div>
  );
}

export default Consignment;
