import React from "react";
import App from "./App";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container);

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
         if (err.response) {
          console.error("Server error during note opration:", err.response);
          alert(
            err.response.data?.message || "Server error during note operation"
          );
        } else {
          console.error("Note operating error:", err);
          alert(err.message || "Problem with connection or note operation.");
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
