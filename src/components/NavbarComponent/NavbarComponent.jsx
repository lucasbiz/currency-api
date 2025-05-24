import { useState, useContext, useEffect, useRef } from "react";
import styles from "./NavbarComponent.module.css"
import CheckBoxComponent from "../CheckBoxComponent/CheckBoxComponent";
import { CurrencyListContext, CurrencyListDispatchContext } from "../../CurrenciesContext";


function NavbarComponent () {

    const [isExpanded, setIsExpanded] = useState(false);
    const menuRef = useRef(null);

    const currencies = useContext(CurrencyListContext)

    const [allChecked, setAllChecked] = useState(false)
    const [allUnchecked, setAllUnchecked] = useState(false)

    const dispatch = useContext(CurrencyListDispatchContext);

    const expandMenu = () => {
        setIsExpanded(prevState => !prevState);
    }

    const checkAllCurrencies = () => {
        dispatch({type: "checkAll"})
    }

    const uncheckAllCurrencies = () => {
        dispatch({type: "uncheckAll"})
    }

    useEffect(() => {
        const areAllChecked = currencies.every((currency) => {
            return currency.isChecked === true;
        });
        setAllChecked(areAllChecked);

        const areAllUnchecked = currencies.every((currency) => {
            return currency.isChecked === false;
        })
        setAllUnchecked(areAllUnchecked);
    },[currencies])

    useEffect(() => {
        const handleClickOutside = (event) => {

            if (isExpanded && menuRef.current && !menuRef.current.contains(event.target)) {
                expandMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isExpanded]);

    return(<>

        <nav ref={menuRef} className={`${styles.currencySelectorContainer} ${isExpanded ? styles.expanded : styles.notExpanded}`}>
            <span className={`${styles.menuButton } material-symbols-outlined`} onClick={expandMenu}>menu</span>
            <div className={styles.allCheckboxesAndButtons}>
                <div className={styles.currencyCheckBoxes}>
                    {currencies.map((o) => (<CheckBoxComponent key={o.code} currencyData={o}></CheckBoxComponent>))} 
                </div>
                <div className={styles.allCheckBoxesButtonContainer}>
                    <button className={`${styles.allCheckboxesButton} ${allChecked? styles.disabled : ''}`} role="button" onClick={checkAllCurrencies}>Marcar todos</button>
                    <button className={`${styles.allCheckboxesButton} ${allUnchecked? styles.disabled : ''}`} role="button" onClick={uncheckAllCurrencies}>Desmarcar todos</button>
                </div>
            </div>
        </nav>
    
    </>);

}

export default NavbarComponent
