import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import { persistor, store } from "./app/store.js";
import Routes from "./exams/router/Routes.jsx";
import "./index.css";

// 🟢 GTM import
import TagManager from "react-gtm-module";

// 🟢 GTM initialize
TagManager.initialize({ gtmId: "GTM-MNR4PLP2" });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          locale={enUS}
          direction="ltr"
          theme={{
            token: {
              borderRadius: 4,
              fontSize: 16,
              fontFamily: "'Sen', sans-serif",
            },
          }}
          componentSize="middle"
        >
          <RouterProvider router={Routes} />
          <Toaster
            position="top-center"
            visibleToasts={2}
            toastOptions={{
              style: {
                borderRadius: "5px", // Smooth corners
                padding: "10px 17px",
                fontSize: "14px",
                background:"black",
                color:"white"
              },
            }}
          />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
