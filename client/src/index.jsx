import React from "react";
import App from "./App";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container);

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
