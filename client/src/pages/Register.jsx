// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema } from "../../../shared/index.js";

function Register() {
  const navigate = useNavigate();

  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: "",
  // });

  // const [successMessage, setSuccessMessage] = useState("");

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

   const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
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
    isError,
    error,
    isSuccess,
    reset: resetMutation,
  } = useMutation({
    //mutationFn: async ({ username, password }) => {
    mutationFn: async ( credentials ) => {
      const response = await axios.post(
        "/api/register", credentials,
        //{ username, password },
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Error during registration");
      }

      return response.data;
    },
     onSuccess: (data) => {
      reset();
      setTimeout(() => { navigate("/");}, 3000);
    //   //setFormData({ email: "", password: "" });
    //   setSuccessMessage(data.message || "User added, try login");
     },
    onError: (err) => {
      setValue("password", "");
      setFocus("password");
      //setFormData((prev) => ({ ...prev, password: "" }));
    },
  });

  // async function handleRegisterClick(e) {
  //   e.preventDefault();

  //   registerUserMutation({
  //     username: formData.email,
  //     password: formData.password,
  //   });
  // }

  return (
    <div className="login-wrapper">
      {/* <form className="login" onSubmit={handleRegisterClick}> */}
      <form className="login" onSubmit={handleSubmit(onSubmit)}>
        <h2>User registration</h2>
        <input
          type="email"
          //name="email"
          //required
          placeholder="e-mail"
          autoComplete="username"
          {...register("email", {onChange: () => {if(isError) resetMutation()}})}
          //value={formData.email}
          //onChange={handleChange}
        />
        {errors.email && (
          <span style={{ color: "red", fontSize: "12px", display: "block", marginBottom: "5px" }}>
            {errors.email.message}
          </span>
        )}

        <input
          type="password"
          //name="password"
          //required
          placeholder="password"
          autoComplete="new-password"
          {...register("password", {onChange: () => {if(isError) resetMutation()}})}
          //value={formData.password}
          //onChange={handleChange}
        />
        {errors.password && (
          <span style={{ color: "red", fontSize: "12px", display: "block", marginBottom: "5px" }}>
            {errors.password.message}
          </span>
        )}

        {isError && (
          <div
            className="error-alert"
            style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}
          >
            {error?.response?.data?.message || error.message || "Error during registration."}
          </div>
        )}
        {/* {isSuccess && successMessage && ( */}
        {isSuccess && (
          <div
            className="error-alert"
            style={{ color: "green", marginBottom: "15px", fontSize: "14px" }}
          >
            {/* {successMessage} */}
            User added successfully. Please login.
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
