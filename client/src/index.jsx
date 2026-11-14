import App from "./App";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container);

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (err) => {
        const status = err.response && err.response.status;

        if (status && status >= 400 && status < 500) {
          return;
        }

        if (err.response) {
          console.error(
            `Server error [${err.response.status}]:`,
            "Server side error during data operation"
          );
          alert("Server side error during data operation");
        } else {
          console.error("Data operation error:", err.message);
          alert(err.message || "Connection or data operation problem.");
        }
      },
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);