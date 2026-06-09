import { useContext, useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import { LastTimeUpdatedContext } from "../../CurrenciesContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

function Header({ theme, setTheme, searchTerm, setSearchTerm, sidebarOpen, setSidebarOpen }) {
  const { lastUpdated } = useContext(LastTimeUpdatedContext);
  const [relativeTime, setRelativeTime] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    function updateRelativeTime() {
      if (!lastUpdated) {
        setRelativeTime("");
        return;
      }
      const diff = Math.floor((new Date() - lastUpdated) / 1000);
      if (diff < 5) setRelativeTime("agora");
      else if (diff < 60) setRelativeTime(`há ${diff}s`);
      else setRelativeTime(`há ${Math.floor(diff / 60)}min`);
    }
    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 5000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  function handleSearchChange(e) {
    setSearchTerm(e.target.value);
  }

  function handleSearchClear() {
    setSearchTerm("");
    searchRef.current?.focus();
  }

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.menuButton}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Fechar painel" : "Abrir painel"}
          aria-expanded={sidebarOpen}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className={styles.logo}>
          <span className={styles.logoIcon} aria-hidden="true">$</span>
          <span className={styles.logoText}>Currency Dashboard</span>
        </div>
      </div>

      <div className={styles.searchWrapper}>
        <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
        <input
          ref={searchRef}
          type="text"
          className={styles.searchInput}
          placeholder="Buscar par (USD, EUR, BTC...)"
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Buscar pares"
        />
        {searchTerm && (
          <button className={styles.searchClear} onClick={handleSearchClear} aria-label="Limpar busca">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      <div className={styles.right}>
        {lastUpdated && (
          <div className={styles.timestamp} title={lastUpdated.toLocaleString()} aria-live="polite">
            <span className="material-symbols-outlined" aria-hidden="true">schedule</span>
            <span>{relativeTime}</span>
          </div>
        )}
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
}

export default Header;
