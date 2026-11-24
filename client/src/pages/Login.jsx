import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "../../../shared/index.js";

function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutate: LoginUserMutation,
    isPending,
  } = useMutation({
    mutationFn: async (credentials) => {
      const response = await axios.post("/api/login", credentials, {
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Login error");
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/notes");
    },

    onError: (err) => {
      setValue("password", "");
      setFocus("password");

      const responseData = err.response?.data;

      if (responseData.errors) {
        Object.keys(responseData.errors).forEach((field) => {
          const serverMessage = Array.isArray(responseData.errors[field])
            ? responseData.errors[field][0]
            : responseData.errors[field];

          setError(field, {
            type: "server",
            message: serverMessage,
          });
        });
      } else {
        setError("root", {
          type: "server",
          message: responseData?.message || "Login error",
        });
      }
    },
  });

  const onSubmit = (data) => {
    LoginUserMutation({
      username: data.email,
      password: data.password,
    });
  };

  function handleRegisterClick() {
    navigate("/register");
  }

  const handleInputChange = (fieldName) => {
    if (errors[fieldName]) clearErrors(fieldName);
    if (errors.root) clearErrors("root");
  };

  return (
    <div className="login-wrapper">
      <form className="login" onSubmit={handleSubmit(onSubmit)}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="e-mail"
          autoComplete="username"
          {...register("email", { 
            onChange: () => {
            handleInputChange("email");
          },
          })}
        />
        {errors.email && (
          <span
            style={{
              color: "red",
              fontSize: "12px",
              display: "block",
              marginBottom: "10px",
            }}
          >
            {errors.email.message}
          </span>
        )}

        <input
          type="password"
          placeholder="password"
          autoComplete="current-password"
          {...register("password", {
            onChange: () => {
              handleInputChange("password");
            },
          })}
        />
        {errors.password && (
          <span
            style={{
              color: "red",
              fontSize: "12px",
              display: "block",
              marginBottom: "10px",
            }}
          >
            {errors.password.message}
          </span>
        )}


        {errors.root && (
          <div
            className="error-alert"
            style={{ 
              color: "red", 
              marginBottom: "15px", 
              fontSize: "14px" 
              }}
          >
            {errors.root.message}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={{ flex: 1 }} disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            style={{ flex: 1 }}
            onClick={handleRegisterClick}
            disabled={isPending}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
