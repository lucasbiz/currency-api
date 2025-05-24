import { useState, useEffect, useContext } from "react";
import styles from "./CurrencyComponent.module.css";
import { LastTimeUpdatedContext } from "../../CurrenciesContext";

function CurrencyComponent({ currency }) {
  const [cotacaoAtual, setCotacaoAtual] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setLastUpdated } = useContext(LastTimeUpdatedContext);
  const currencyWithoutDash = currency.code.replace("-", "");

  async function cotacaoMoeda(currencyCode) {
    const url = `${import.meta.env.VITE_API_URL}${currencyCode}`;

    const response = await fetch(url);

    if (!response.ok) throw new Error("Erro na requisição");
    
    return await response.json();
  }
  

  useEffect(() => {
    let isMounted = true;

    async function fetchCurrency() {
      setIsLoading(true);
      try {
        const cotacao = await cotacaoMoeda(currency.code);
        if (!isMounted) return;
        setCotacaoAtual(cotacao);
        setError(null);
        setLastUpdated(new Date());
      } catch (err) {
        if (!isMounted) return;
        console.error("Erro ao solicitar os dados:", err);
        setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    fetchCurrency();
    const intervalId = setInterval(fetchCurrency, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [currency.code, setLastUpdated]);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  const cotacao = cotacaoAtual[currencyWithoutDash] || {};

  return (
    <div className={styles.cardDetails}>
      <h2 className={styles.textTitle}>{cotacao.name || "N/A"}</h2>
      <p>Código: {cotacao.code || "N/A"}</p>
      <p>Compra: R${parseFloat(cotacao.bid || 0).toFixed(2)}</p>
      <p>Venda: R${parseFloat(cotacao.ask || 0).toFixed(2)}</p>
      <p>Máximo: R${parseFloat(cotacao.high || 0).toFixed(2)}</p>
      <p>Mínimo: R${parseFloat(cotacao.low || 0).toFixed(2)}</p>
    </div>
  );
}

export default CurrencyComponent;
