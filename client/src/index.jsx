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
        const status = err.response && err.response.status;

        // ==========================================
        // WYJĄTEK 1: Obsługa wygasłej sesji / braku autoryzacji (401)
        // ==========================================
        if (status === 401) {
          console.warn("Sesja wygasła lub użytkownik nieautoryzowany.");
          
          // Tutaj wrzucasz globalną akcję, np.:
          // localStorage.removeItem("token");
          // window.location.href = "/login";
          
          // Możesz też pokazać alert lub przerwać dalsze działanie
          alert("Twoja sesja wygasła. Zaloguj się ponownie.");
          return; 
        }

        // ==========================================
        // KROK STANDARDOWY: Inne błędy klienta / walidacji (np. 400, 409)
        // ==========================================
        // Te błędy ignorujemy globalnie, żeby komponent (formularz) 
        // mógł je wyświetlić użytkownikowi (np. "zły email", "błędne hasło").
        if (status && status >= 400 && status < 500) {
          return;
        }

        // ==========================================
        // RESZTA BŁĘDÓW: Poważne błędy serwera (500+) lub brak internetu
        // ==========================================
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