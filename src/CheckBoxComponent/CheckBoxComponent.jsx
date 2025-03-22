import { useContext } from "react"
import styles from "./CheckBoxComponent.module.css"
import { CurrencyListDispatchContext } from "../CurrenciesContext";

function CheckBoxComponent (props) {

   const dispatch = useContext(CurrencyListDispatchContext);

   function handleChangeCurrencyList(e) {

      const currencyCode = props.currencyData.code;
      const newCheckedState = e.target.checked;

      dispatch({
            type: newCheckedState ? "checked" : "unchecked",
            code: currencyCode,
         });
   }

   return (
      <div className={styles.checkbox} >
         <label>
            <input type="checkbox" onChange={handleChangeCurrencyList} checked={props.currencyData.isChecked}></input>
            <p>{props.currencyData.name}</p>
         </label>
      </div>
   )
}

export default CheckBoxComponent
