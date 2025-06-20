import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { UserProvider } from "./context/UserContext";
import { FlightsProvider } from "./context/FlightsContext";
import { SearchProvider } from "./context/FlightSearchContext";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
console.log("Stripe Key:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <FlightsProvider>
        <SearchProvider>
          <Elements stripe={stripePromise}>
            <App />
          </Elements>
        </SearchProvider>
      </FlightsProvider>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
