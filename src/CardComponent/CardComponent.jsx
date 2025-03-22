import CurrencyComponent from "../CurrencyComponent/CurrencyComponent";
import styles from "./CardComponent.module.css"

function CardComponent (props) {

    return(<div className={styles.cardComponent}>
        <CurrencyComponent currency={props.currency}></CurrencyComponent>
    </div>);
}

export default CardComponent
