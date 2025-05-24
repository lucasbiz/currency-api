import initialCurrencies from '../data/initialCurrencies.json';

export const initializeCurrencies = () => {
  const stored = localStorage.getItem("currencies");
  if (!stored) {
    localStorage.setItem("currencies", JSON.stringify(initialCurrencies));
    return initialCurrencies;
  }
  return JSON.parse(stored);
};
