import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../redux/features/userSlice";

export default function Login() {

  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser({
      username,
      password
    }));
  };

  return (
    <form onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Username"
        onChange={(e)=>setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button type="submit">
        Login
      </button>

    </form>
  );
}