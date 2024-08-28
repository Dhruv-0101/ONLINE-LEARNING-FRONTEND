import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import { store } from "./redux/store/store.js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";



//query client
const queryClient = new QueryClient();

//configure stripe
const stripePromise = loadStripe(
  "pk_test_51O7iHlSAP8eyRYOVMSRmnh22wxkhX33MCA93aTN90g3LXaW2h7RYvnb3sM85JRRUxFTsLGXiexCqLo426Pu10thG000RTns3P6"
);

//stripe options
const options = {
  mode: "payment",
  currency: "usd",
  amount: 1099,
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <Elements stripe={stripePromise} options={options}>
        <App />
      </Elements>
      <ReactQueryDevtools initialIsOpen={false} />
    </Provider>
  </QueryClientProvider>
);
