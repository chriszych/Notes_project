import React, { createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: user,
    isPending: loadingUser,
    isError,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axios.get("/api/user", { withCredentials: true });
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: logout, isPending: unLoadingUser } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        "/api/logout",
        {},
        { withCredentials: true }
      );
      if (!response.data.success) {
        throw new Error("Failed to log out");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
      navigate("/");
    },
    onError: (error) => {
      console.error("User logout on server error:", error);
    },
  });

  return (
    <UserContext.Provider
      value={{
        user: isError ? null : user,
        loadingUser,
        logout,
        unLoadingUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
