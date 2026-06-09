import { useEffect, useReducer, useState } from 'react'
import './App.css'
import { CurrencyListContext, CurrencyListDispatchContext, LastTimeUpdatedContext } from './CurrenciesContext';
import { currencyListReducer } from './reducers/currencyListReducer';
import { initializeCurrencies } from './utils/initializeCurrencies';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import CurrencyCard from './components/CurrencyCard/CurrencyCard';
import EmptyState from './components/EmptyState/EmptyState';
import SkeletonGrid from './components/Skeleton/Skeleton';

function App() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const [availableCurrencies, dispatch] = useReducer(currencyListReducer, [], initializeCurrencies);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("currencies", JSON.stringify(availableCurrencies));
  }, [availableCurrencies]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const checkedCurrencies = availableCurrencies
    .filter(c => c.isChecked)
    .sort((a, b) => {
      if (a.isFavorited && !b.isFavorited) return -1;
      if (!a.isFavorited && b.isFavorited) return 1;
      return 0;
    });

  return (
    <LastTimeUpdatedContext.Provider value={{ lastUpdated, setLastUpdated }}>
      <CurrencyListContext.Provider value={availableCurrencies}>
        <CurrencyListDispatchContext.Provider value={dispatch}>

          <Header
            theme={theme}
            setTheme={setTheme}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <div className="appLayout">
            <Sidebar
              open={sidebarOpen}
              searchTerm={searchTerm}
              onClose={() => setSidebarOpen(false)}
            />

            <main className={`mainArea ${sidebarOpen ? 'sidebarOpen' : ''}`}>
              {initialLoading && checkedCurrencies.length > 0 ? (
                <div className="currencyGrid">
                  <SkeletonGrid count={Math.min(checkedCurrencies.length, 6)} />
                </div>
              ) : checkedCurrencies.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="currencyGrid">
                  {checkedCurrencies.map((c) => (
                    <CurrencyCard key={c.code} currency={c} />
                  ))}
                </div>
              )}
            </main>
          </div>

        </CurrencyListDispatchContext.Provider>
      </CurrencyListContext.Provider>
    </LastTimeUpdatedContext.Provider>
  )
}

export default App
