import CardComponent from './CardComponent/CardComponent'
import NavbarComponent from './NavbarComponent/NavbarComponent'
import './App.css'
import { useEffect, useReducer } from 'react'
import { CurrencyListContext, CurrencyListDispatchContext } from './CurrenciesContext'

const initializeCurrencies = () => {

  const stored = localStorage.getItem("currencys");
  if (!stored) {
    const initialCurrencies = [
      { code: "USD-BRL", name: "Dólar Americano/Real Brasileiro", isChecked: false },
      { code: "USD-BRLT", name: "Dólar Americano/Real Brasileiro Turismo", isChecked: false },
      { code: "CAD-BRL", name: "Dólar Canadense/Real Brasileiro", isChecked: false },
      { code: "EUR-BRL", name: "Euro/Real Brasileiro", isChecked: false },
      { code: "GBP-BRL", name: "Libra Esterlina/Real Brasileiro", isChecked: false },
      { code: "ARS-BRL", name: "Peso Argentino/Real Brasileiro", isChecked: false },
      { code: "BTC-BRL", name: "Bitcoin/Real Brasileiro", isChecked: false },
      { code: "LTC-BRL", name: "Litecoin/Real Brasileiro", isChecked: false },
      { code: "JPY-BRL", name: "Iene Japonês/Real Brasileiro", isChecked: false },
      { code: "CHF-BRL", name: "Franco Suíço/Real Brasileiro", isChecked: false },
      { code: "AUD-BRL", name: "Dólar Australiano/Real Brasileiro", isChecked: false },
      { code: "CNY-BRL", name: "Yuan Chinês/Real Brasileiro", isChecked: false },
      { code: "ILS-BRL", name: "Novo Shekel Israelense/Real Brasileiro", isChecked: false },
      { code: "ETH-BRL", name: "Ethereum/Real Brasileiro", isChecked: false },
      { code: "XRP-BRL", name: "XRP/Real Brasileiro", isChecked: false }
    ];
    localStorage.setItem("currencys", JSON.stringify(initialCurrencies));
    return initialCurrencies;
  }
  return JSON.parse(stored);
};


// Função reducer que gerencia o estado da lista de moedas com base em ações despachadas
function currencyListReducer(availableCurrencies, action) {
  // O switch verifica o tipo da ação ('checked' ou 'unchecked') para decidir o que fazer
  switch (action.type) {
    // Caso a ação seja 'checked': marca uma moeda como selecionada (isChecked: true)
    case 'checked': {
      // Retorna um novo array mapeando cada moeda da lista atual
      return availableCurrencies.map(currency =>
        // Se o código da moeda atual for igual ao código da ação, atualiza isChecked para true
        // Usa o spread (...currency) para copiar todas as propriedades e só mudar isChecked
        currency.code === action.code ? { ...currency, isChecked: true } : currency
      );
    }
    // Caso a ação seja 'unchecked': desmarca uma moeda (isChecked: false)
    case 'unchecked': {
      // Retorna um novo array mapeando cada moeda da lista atual
      return availableCurrencies.map(currency =>
        // Se o código da moeda atual for igual ao código da ação, atualiza isChecked para false
        // Mantém as outras propriedades com o spread (...currency)
        currency.code === action.code ? { ...currency, isChecked: false } : currency
      );
    }

    case "checkAll": {
      // Marca todas as moedas como checked
      return availableCurrencies.map((currency) => ({ ...currency, isChecked: true }));
    }

    case "uncheckAll": {
      // Desmarca todas as moedas
      return availableCurrencies.map((currency) => ({ ...currency, isChecked: false }));
    }
    // Caso padrão: se a ação não for reconhecida, retorna o estado atual sem alterações
    
    default:
      return availableCurrencies;
  }
}


function App() {

  const [availableCurrencies, dispatch] = useReducer(currencyListReducer, [], initializeCurrencies);

  useEffect(() => {
    localStorage.setItem("currencys", JSON.stringify(availableCurrencies));
    console.log(availableCurrencies);
  }, [availableCurrencies]);


  let checkedCurrencies = availableCurrencies.filter((c) => c.isChecked == true )

  return (
    <div className= "main">
      
      <CurrencyListContext.Provider value={availableCurrencies}>
        <CurrencyListDispatchContext.Provider value={dispatch}>
          <NavbarComponent className="navbar" currencyList={availableCurrencies} />
        </CurrencyListDispatchContext.Provider>
      </CurrencyListContext.Provider>

      <div className="currency-container">
        {checkedCurrencies.map((c) => <CardComponent key={c.code} currency={c}></CardComponent>)}
      </div>
    
    
    </div>
  )
}

export default App
