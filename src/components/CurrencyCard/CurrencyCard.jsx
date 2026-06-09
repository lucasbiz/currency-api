import { useState, useEffect, useContext, useRef } from "react";
import styles from "./CurrencyCard.module.css";
import { LastTimeUpdatedContext, CurrencyListDispatchContext } from "../../CurrenciesContext";

const CRYPTO_CODES = ["BTC-BRL", "LTC-BRL", "ETH-BRL", "XRP-BRL"];

function isCrypto(code) {
  return CRYPTO_CODES.includes(code);
}

function formatValue(value, code) {
  const num = parseFloat(value || 0);
  if (isCrypto(code)) {
    return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function parseError(err) {
  if (err.name === "TypeError" && err.message === "Failed to fetch") {
    return "Sem conexão com o servidor";
  }
  if (err.message?.startsWith("HTTP ")) {
    const code = err.message.split(" ")[1];
    if (code === "522") return "API temporariamente indisponível (522)";
    if (code === "404") return "Par não encontrado na API (404)";
    if (code === "429") return "Muitas requisições (429)";
    return `Erro HTTP ${code}`;
  }
  return err.message || "Erro desconhecido";
}

function CurrencyCard({ currency }) {
  const [cotacaoAtual, setCotacaoAtual] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stale, setStale] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const { setLastUpdated } = useContext(LastTimeUpdatedContext);
  const dispatch = useContext(CurrencyListDispatchContext);
  const currencyWithoutDash = currency.code.replace("-", "");
  const hasDataRef = useRef(false);

  function handleToggleFavorite(e) {
    e.stopPropagation();
    dispatch({ type: "toggleFavorite", code: currency.code });
  }

  useEffect(() => {
    let isMounted = true;
    let retries = 0;
    const MAX_RETRIES = 3;

    async function fetchCurrency() {
      const url = `${import.meta.env.VITE_API_URL}${currency.code}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const cotacao = await response.json();
        if (!isMounted) return;
        setCotacaoAtual(cotacao);
        hasDataRef.current = true;
        setError(null);
        setStale(false);
        setLastUpdated(new Date());
        setIsLoading(false);
        retries = 0;
      } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === "AbortError" || !isMounted) return;

        if (!hasDataRef.current && retries < MAX_RETRIES) {
          retries++;
          const delay = Math.min(1000 * Math.pow(2, retries), 8000);
          await new Promise((r) => setTimeout(r, delay));
          if (!isMounted) return;
          return fetchCurrency();
        }

        if (isMounted) {
          setError(parseError(err));
          if (hasDataRef.current) {
            setStale(true);
          }
          setIsLoading(false);
        }
      }
    }

    fetchCurrency();
    const intervalId = setInterval(fetchCurrency, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [currency.code, retryTrigger, setLastUpdated]);

  function handleRetry() {
    setRetryTrigger((n) => n + 1);
  }

  if (isLoading && !cotacaoAtual[currencyWithoutDash]) {
    return (
      <div className={styles.card}>
        <div className={styles.loadingState}>
          <div className={styles.skeleton}>
            <div className={styles.skeletonLine} style={{ width: "40%" }} />
            <div className={styles.skeletonLine} style={{ width: "60%", height: 32, marginTop: 16 }} />
            <div className={styles.skeletonGrid}>
              <div className={styles.skeletonLine} style={{ width: "80%" }} />
              <div className={styles.skeletonLine} style={{ width: "80%" }} />
              <div className={styles.skeletonLine} style={{ width: "80%" }} />
              <div className={styles.skeletonLine} style={{ width: "80%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !cotacaoAtual[currencyWithoutDash]) {
    return (
      <div className={styles.card}>
        <div className={styles.errorState}>
          <span className="material-symbols-outlined" aria-hidden="true">cloud_off</span>
          <p className={styles.errorText}>{error}</p>
          <p className={styles.errorHint}>A API pode estar temporariamente indisponível para este par.</p>
          <button className={styles.retryBtn} onClick={handleRetry}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const cotacao = cotacaoAtual[currencyWithoutDash] || {};
  const code = currency.code.replace("-", "/");
  const bid = cotacao.bid || "0";
  const ask = cotacao.ask || "0";
  const high = cotacao.high || "0";
  const low = cotacao.low || "0";
  const pctChange = parseFloat(cotacao.pctChange || 0);
  const isPositive = pctChange >= 0;

  return (
    <article
      className={`${styles.card} ${stale ? styles.stale : ""}`}
      aria-label={`Cotação ${code}${stale ? " (dados desatualizados)" : ""}`}
    >
      {stale && (
        <div className={styles.staleBanner}>
          <span className="material-symbols-outlined" aria-hidden="true">error_outline</span>
          <span>Dados offline</span>
          <button className={styles.staleRetry} onClick={handleRetry} aria-label="Tentar novamente">
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      )}
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.code}>{code}</h2>
          <span className={styles.name}>{currency.name.split("/")[0]}</span>
        </div>
        <button
          className={`${styles.favBtn} ${currency.isFavorited ? styles.favorited : ""}`}
          onClick={handleToggleFavorite}
          aria-label={currency.isFavorited ? `Remover ${code} dos favoritos` : `Favoritar ${code}`}
          aria-pressed={currency.isFavorited}
        >
          <span className="material-symbols-outlined">
            {currency.isFavorited ? "star" : "star"}
          </span>
        </button>
      </div>

      <div className={styles.bidRow}>
        <span className={styles.bidValue}>R$ {formatValue(bid, currency.code)}</span>
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Compra</span>
          <span className={styles.metaValue}>R$ {formatValue(bid, currency.code)}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Venda</span>
          <span className={styles.metaValue}>R$ {formatValue(ask, currency.code)}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Máxima</span>
          <span className={styles.metaValue}>R$ {formatValue(high, currency.code)}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Mínima</span>
          <span className={styles.metaValue}>R$ {formatValue(low, currency.code)}</span>
        </div>
      </div>

      <div className={styles.variationRow}>
        <span className={`${styles.variationBadge} ${isPositive ? styles.positive : styles.negative}`}>
          <span className="material-symbols-outlined" aria-hidden="true">
            {isPositive ? "trending_up" : "trending_down"}
          </span>
          <span className={styles.variationValue}>
            {isPositive ? "+" : ""}{pctChange.toFixed(2)}%
          </span>
        </span>
      </div>
    </article>
  );
}

export default CurrencyCard;
