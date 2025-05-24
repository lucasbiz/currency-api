export function currencyListReducer(state, action) {
    switch (action.type) {
      case 'checked':
        return state.map(currency =>
          currency.code === action.code ? { ...currency, isChecked: true } : currency
        );
      case 'unchecked':
        return state.map(currency =>
          currency.code === action.code ? { ...currency, isChecked: false } : currency
        );
      case 'checkAll':
        return state.map(currency => ({ ...currency, isChecked: true }));
      case 'uncheckAll':
        return state.map(currency => ({ ...currency, isChecked: false }));
      default:
        return state;
    }
  }
  