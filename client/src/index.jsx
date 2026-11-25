import App from "./App";
import { QueryClientProvider, QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";

import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container);

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      if (err.response?.status === 401) {
        const isUserQuery = query.queryKey.includes("user");
        if (isUserQuery) return;
        queryClient.clear();
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (err) => {
      if (err.response?.status === 401) {
        queryClient.clear();
        return;
      }
    },
  }),
  defaultOptions: {
    mutations: {
      onError: (err) => {
        const status = err.response?.status;

        if (status === 401) return;

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