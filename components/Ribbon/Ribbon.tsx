import { useEffect, useState } from 'react';
import styles from '../../styles/Ribbon.module.css';
function Ribbon() {
   

    return (
        <>
            <div className={styles.ribbinContainer} >

                <div className={styles.header_ribbon} id="header_ribbon" >
                    <p>Main Website Store - Default Store View</p>
                    <p>|</p>
                    <p>$ USD</p>
                </div>
            </div>
        </>
    )   
}
export default Ribbon