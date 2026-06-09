import { useContext, useMemo } from "react";
import styles from "./Sidebar.module.css";
import { CurrencyListContext, CurrencyListDispatchContext } from "../../CurrenciesContext";

const FIAT_CODES = ["USD-BRL", "USD-BRLT", "CAD-BRL", "EUR-BRL", "GBP-BRL", "ARS-BRL", "JPY-BRL", "CHF-BRL", "AUD-BRL", "CNY-BRL", "ILS-BRL"];
const CRYPTO_CODES = ["BTC-BRL", "LTC-BRL", "ETH-BRL", "XRP-BRL"];

function isFiat(code) {
  return FIAT_CODES.includes(code);
}

function isCrypto(code) {
  return CRYPTO_CODES.includes(code);
}

function Sidebar({ open, searchTerm, onClose }) {
  const currencies = useContext(CurrencyListContext);
  const dispatch = useContext(CurrencyListDispatchContext);

  const filtered = useMemo(() => {
    if (!searchTerm) return currencies;
    const term = searchTerm.toLowerCase();
    return currencies.filter(c =>
      c.code.toLowerCase().includes(term) ||
      c.name.toLowerCase().includes(term)
    );
  }, [currencies, searchTerm]);

  const fiatCurrencies = useMemo(() => filtered.filter(c => isFiat(c.code)), [filtered]);
  const cryptoCurrencies = useMemo(() => filtered.filter(c => isCrypto(c.code)), [filtered]);

  const fiatChecked = useMemo(() => fiatCurrencies.filter(c => c.isChecked).length, [fiatCurrencies]);
  const cryptoChecked = useMemo(() => cryptoCurrencies.filter(c => c.isChecked).length, [cryptoCurrencies]);

  const allFiatChecked = fiatCurrencies.length > 0 && fiatCurrencies.every(c => c.isChecked);
  const allCryptoChecked = cryptoCurrencies.length > 0 && cryptoCurrencies.every(c => c.isChecked);
  const allFiatUnchecked = fiatCurrencies.every(c => !c.isChecked);
  const allCryptoUnchecked = cryptoCurrencies.every(c => !c.isChecked);

  function handleCheck(code, checked) {
    dispatch({ type: checked ? "checked" : "unchecked", code });
  }

  function handleCheckAll(codes) {
    dispatch({ type: "checkCategory", codes });
  }

  function handleUncheckAll(codes) {
    dispatch({ type: "uncheckCategory", codes });
  }

  const totalChecked = currencies.filter(c => c.isChecked).length;
  const total = currencies.length;

  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} aria-hidden="true" />}
      <aside
        className={`${styles.sidebar} ${open ? styles.open : styles.closed}`}
        aria-label="Painel de moedas"
        role="complementary"
      >
        <div className={styles.header}>
          <span className={styles.title}>Moedas</span>
          <span className={styles.count}>{totalChecked} de {total}</span>
        </div>

        {filtered.length === 0 && searchTerm && (
          <div className={styles.noResults}>
            Nenhum par encontrado para &quot;{searchTerm}&quot;
          </div>
        )}

        {fiatCurrencies.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Moedas Fiat</span>
              <span className={styles.sectionCount}>{fiatChecked}/{fiatCurrencies.length}</span>
              <div className={styles.sectionActions}>
                <button
                  className={`${styles.actionBtn} ${allFiatChecked ? styles.disabled : ""}`}
                  onClick={() => handleCheckAll(fiatCurrencies.map(c => c.code))}
                  disabled={allFiatChecked}
                  aria-label="Marcar todas as moedas fiat"
                >
                  <span className="material-symbols-outlined">select_all</span>
                </button>
                <button
                  className={`${styles.actionBtn} ${allFiatUnchecked ? styles.disabled : ""}`}
                  onClick={() => handleUncheckAll(fiatCurrencies.map(c => c.code))}
                  disabled={allFiatUnchecked}
                  aria-label="Desmarcar todas as moedas fiat"
                >
                  <span className="material-symbols-outlined">deselect</span>
                </button>
              </div>
            </div>
            <div className={styles.list} role="group" aria-label="Lista de moedas fiat">
              {fiatCurrencies.map(c => (
                <label key={c.code} className={styles.checkboxLabel}>
                  <span className={`${styles.checkbox} ${c.isChecked ? styles.checked : ""}`}>
                    <input
                      type="checkbox"
                      className={styles.checkboxInput}
                      checked={c.isChecked}
                      onChange={(e) => handleCheck(c.code, e.target.checked)}
                      aria-label={c.name}
                    />
                    <span className={styles.checkmark} aria-hidden="true">
                      {c.isChecked && <span className="material-symbols-outlined">check</span>}
                    </span>
                  </span>
                  <span className={styles.labelContent}>
                    <span className={styles.labelCode}>{c.code.replace("-", "/")}</span>
                    <span className={styles.labelName}>{c.name.split("/")[0]}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {cryptoCurrencies.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Criptomoedas</span>
              <span className={styles.sectionCount}>{cryptoChecked}/{cryptoCurrencies.length}</span>
              <div className={styles.sectionActions}>
                <button
                  className={`${styles.actionBtn} ${allCryptoChecked ? styles.disabled : ""}`}
                  onClick={() => handleCheckAll(cryptoCurrencies.map(c => c.code))}
                  disabled={allCryptoChecked}
                  aria-label="Marcar todas as criptomoedas"
                >
                  <span className="material-symbols-outlined">select_all</span>
                </button>
                <button
                  className={`${styles.actionBtn} ${allCryptoUnchecked ? styles.disabled : ""}`}
                  onClick={() => handleUncheckAll(cryptoCurrencies.map(c => c.code))}
                  disabled={allCryptoUnchecked}
                  aria-label="Desmarcar todas as criptomoedas"
                >
                  <span className="material-symbols-outlined">deselect</span>
                </button>
              </div>
            </div>
            <div className={styles.list} role="group" aria-label="Lista de criptomoedas">
              {cryptoCurrencies.map(c => (
                <label key={c.code} className={styles.checkboxLabel}>
                  <span className={`${styles.checkbox} ${c.isChecked ? styles.checked : ""}`}>
                    <input
                      type="checkbox"
                      className={styles.checkboxInput}
                      checked={c.isChecked}
                      onChange={(e) => handleCheck(c.code, e.target.checked)}
                      aria-label={c.name}
                    />
                    <span className={styles.checkmark} aria-hidden="true">
                      {c.isChecked && <span className="material-symbols-outlined">check</span>}
                    </span>
                  </span>
                  <span className={styles.labelContent}>
                    <span className={styles.labelCode}>{c.code.replace("-", "/")}</span>
                    <span className={styles.labelName}>{c.name.split("/")[0]}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
