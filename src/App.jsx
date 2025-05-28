import CardComponent from './components/CardComponent/CardComponent'
import NavbarComponent from './components/NavbarComponent/NavbarComponent'
import './App.css'
import { useEffect, useReducer, useState } from 'react'
import { CurrencyListContext, CurrencyListDispatchContext, LastTimeUpdatedContext } from './CurrenciesContext';
import SwitchThemeComponent from './components/SwitchThemeComponent/SwitchThemeComponent';
import { currencyListReducer } from './reducers/currencyListReducer';
import { initializeCurrencies } from './utils/initializeCurrencies';
import { SpeedInsights } from "@vercel/speed-insights/next"


function App() {

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const [availableCurrencies, dispatch] = useReducer(currencyListReducer, [], initializeCurrencies);

  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    localStorage.setItem("currencies", JSON.stringify(availableCurrencies));
  }, [availableCurrencies]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("theme", theme);
  }, [theme]);


  let checkedCurrencies = availableCurrencies.filter((c) => c.isChecked == true )

  return (
    <div className= "main">
      <LastTimeUpdatedContext.Provider value={{ lastUpdated, setLastUpdated }}>
        <CurrencyListContext.Provider value={availableCurrencies}>
          <CurrencyListDispatchContext.Provider value={dispatch}>

            <NavbarComponent className="navbar" currencyList={availableCurrencies} />

          </CurrencyListDispatchContext.Provider>
        </CurrencyListContext.Provider>

        <div className="currency-container">
          {checkedCurrencies.map((c) => <CardComponent key={c.code} currency={c}></CardComponent>)}
        </div>

        <div className="switch-theme">
          <SwitchThemeComponent switchTheme={setTheme} theme={theme}></SwitchThemeComponent>
        </div>
      
        
          {lastUpdated && (
          <div className="last-updated">
            Última atualização: {lastUpdated.toLocaleString()}
          </div>)}
      </LastTimeUpdatedContext.Provider>
      <SpeedInsights />
    </div>
  )
}

export default App
