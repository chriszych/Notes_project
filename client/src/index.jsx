import React from "react";
import App from "./App";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container);

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (err) => {
         if (err.response) {
          console.error("Server error during data opration:", err.response);
          alert(
            err.response.data?.message || "Server error during data operation"
          );
        } else {
          console.error("Data operating error:", err);
          alert(err.message || "Problem with connection or data operation.");
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
