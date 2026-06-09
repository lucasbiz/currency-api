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
      case 'checkCategory':
        return state.map(currency =>
          action.codes.includes(currency.code) ? { ...currency, isChecked: true } : currency
        );
      case 'uncheckCategory':
        return state.map(currency =>
          action.codes.includes(currency.code) ? { ...currency, isChecked: false } : currency
        );
      case 'toggleFavorite':
        return state.map(currency =>
          currency.code === action.code ? { ...currency, isFavorited: !currency.isFavorited } : currency
        );
      default:
        return state;
    }
  }
