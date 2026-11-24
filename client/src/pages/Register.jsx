import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema } from "../../../shared/index.js";
import { useState, useEffect } from "react";

const TICK_INTERVAL = 1000;
const TOTAL_DELAY = TICK_INTERVAL * 4;
const COUNTDOWN_SECONDS = TOTAL_DELAY / TICK_INTERVAL;

function Register() {
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    if (errors.root) clearErrors("root");

    registerUserMutation({
      username: data.email,
      password: data.password,
    });
  };

  function handleLoginClick() {
    navigate("/");
  }

  const {
    mutate: registerUserMutation,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (credentials) => {
      const response = await axios.post("/api/register", credentials, {
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error during registration");
      }

      return response.data;
    },
    onSuccess: (data) => {
      reset();
      setTimeout(() => {
        navigate("/");
      }, TOTAL_DELAY);
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
          message: responseData?.message || "Error during registration",
        });
      }
    },
  });

  useEffect(() => {
    if (!isSuccess) return;

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(timer);
  }, [isSuccess]);

  const handleInputChange = (fieldName) => {
    if (errors[fieldName]) clearErrors(fieldName);
    if (errors.root) clearErrors("root");
  };

  return (
    <div className="login-wrapper">
      <form className="login" onSubmit={handleSubmit(onSubmit)}>
        <h2>User registration</h2>
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
              marginBottom: "5px",
            }}
          >
            {errors.email.message}
          </span>
        )}

        <input
          type="password"
          placeholder="password"
          autoComplete="new-password"
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
              marginBottom: "5px",
            }}
          >
            {errors.password.message}
          </span>
        )}

        {errors.root && (
          <div
            className="error-alert"
            style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}
          >
            {errors.root.message}
          </div>
        )}
        {isSuccess && (
          <div
            className="error-alert"
            style={{ color: "green", marginBottom: "15px", fontSize: "14px" }}
            role="status"
            aria-live="polite"
          >
            Account created! Redirecting in {countdown}s…
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={{ flex: 1 }} disabled={isPending}>
            {isPending ? "Registering..." : "Register"}
          </button>
          <button type="button" style={{ flex: 1 }} onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
