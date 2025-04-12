import { useState, useEffect } from "react";
import styles from "./CurrencyComponent.module.css"


function CurrencyComponent (props) {


    const [cotacaoAtual, setCotacaoAtual] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const currency = props.currency
    const currencyWithoutDash = currency.code.replace("-","")

    useEffect(() => {

        const fetchCurrency = async () => {
            try {

                const cotacao = await cotacaoMoeda(currency.code);
                setCotacaoAtual(cotacao);
                setIsLoading(false);
                setError(null);

            } catch (err) {
                console.error("Erro ao solicitar os dados:", err);
                setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
                setIsLoading(false);

            }

        }

        fetchCurrency();

        let intervalCurrency = setInterval(() => {
            fetchCurrency();
        }, 60000);


        return () => {
            clearInterval(intervalCurrency);
        };

    },[currency]);


    useEffect(()=> {
        console.log(`Cotacao atualizou: ${cotacaoAtual}`)
    }, [cotacaoAtual])
   
   
    async function cotacaoMoeda(currency) {

        const cotacaoMoeda = await fetch(`https://economia.awesomeapi.com.br/json/last/${currency}`).then(
        response => response.json());

        return cotacaoMoeda
    }



    if (isLoading) return <div>Carregando...</div>;


    if (error) return <div>{error}</div>;


    
    return (<div className={styles.cardDetails}>
            <h2 className={styles.textTitle}>{cotacaoAtual[currencyWithoutDash].name}</h2>
            <p>Código: {cotacaoAtual[currencyWithoutDash].code}</p>
            <p>Compra: R${parseFloat(cotacaoAtual[currencyWithoutDash].bid).toFixed(2)}</p>
            <p>Venda: R${parseFloat(cotacaoAtual[currencyWithoutDash].ask).toFixed(2)}</p>
            <p>Máximo: R${parseFloat(cotacaoAtual[currencyWithoutDash].high).toFixed(2)}</p>
            <p>Mínimo: R${parseFloat(cotacaoAtual[currencyWithoutDash].low).toFixed(2)}</p>
        </div>);

}

export default CurrencyComponent
