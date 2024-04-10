"use client";
import * as jwt_decode from "jwt-decode";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginModal = ({ handleClose, handleOpenSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let router = useRouter();
  const [loading, setloading] = useState(false);
  const [issignup, setIsSignup] = useState(false);
  const submithandler = async () => {
    try {
      const config = {
        Headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:3001/auth/login",
        { email, password },
        config
      );
      // THIS function converts tokento data
      function parseJwt(token) {
        if (!token) {
          return;
        }

        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        // return json.parse  atob means token to deconded data
        return JSON.parse(window.atob(base64));
      }
      const userdata = parseJwt(data.token);
      // role is defind  in db and payload
      console.log(userdata.role);

      setloading(false);
      if (userdata.role === "admin") {
        router.push("/admin"); // redirect  admin page if role=admin
      } else {
        router.replace("/user"); // redirect  users page if role=NORMAL_USER
      }
    } catch (error) {
      setloading(false);
      alert(error.message || "An error occurred while logging in.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl mb-4">Login</h1>
        <div className="mb-4">
          <label htmlFor="emailInput">Email</label>
          <input
            type="email"
            id="emailInput"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="passwordInput">Password</label>
          <input
            type="password"
            id="passwordInput"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" onClick={submithandler}>
          Login
        </button>
        <button onClick={handleOpenSignup}>Switch to Signup</button>
        <button className="btn" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};
export default LoginModal;
