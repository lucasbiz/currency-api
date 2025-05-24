# Currency Exchange Dashboard

A React web application that displays real-time currency exchange rates, allowing users to select which currencies they want to view using checkboxes in an expandable sidebar. The exchange rates are fetched from the [AwesomeAPI](https://economia.awesomeapi.com.br/).

## Features

- Fetches currency data from [AwesomeAPI](https://economia.awesomeapi.com.br) every 60 seconds  
- User can select/deselect currencies to display  
- Global state management with React Context API  
- Last data update timestamp shown globally  

## Technologies

- React 18+ with Hooks (`useState`, `useEffect`, `useContext`, `useRef`)  
- CSS Modules  
- Vite or Create React App (for bundling)  
- Public currency API
