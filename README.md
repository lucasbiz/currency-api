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

## Project Structure

currency-api-project/
├── node_modules/         # Contains all the dependencies installed via npm for the project
├── public/               # Stores static assets like favicon, images, or other files served directly
├── src/                  # Main source code directory for the application
│   ├── assets/           # Holds static assets like images, fonts, or other media used in the app
│   ├── components/       # Contains reusable React components for the application
│   ├── data/             # Stores static data files, such as JSON files for initial data
│   ├── reducers/         # Contains Redux reducers for state management
│   └── utils/            # Holds utility functions or helper scripts used across the app
├── .env                  # Stores environment variables (e.g., API keys) for the project
├── .gitignore            # Specifies files and directories to be ignored by Git (e.g., node_modules)
├── eslint.config.js      # Configuration file for ESLint to enforce code quality and style rules
├── index.html            # The main HTML entry point for the application
├── package-lock.json     # Auto-generated file that locks the versions of dependencies installed
├── package.json          # Defines project metadata, scripts, and dependencies
├── README.md             # Project documentation with setup instructions and information (this file)
└── vite.config.js        # Configuration file for Vite, the build tool used for the project
