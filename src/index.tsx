import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components//App/App';
import reportWebVitals from './reportWebVitals';
import {FirebaseAppProvider} from "reactfire";

console.log("KEY: ", "")


const firebaseConfig = {
    apiKey: "AIzaSyCuLGF2vmTRjSxjljfKXRGiRg2uruH58Y0",
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// const app = initializeApp(firebaseConfig);

ReactDOM.render(
    <React.StrictMode>
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
                <App/>
        </FirebaseAppProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
