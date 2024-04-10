"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function page({ handleClose, signuptologin }) {
  const [firstname, setFirstname] = useState();
  const router = useRouter();
  const [lastname, setLastName] = useState();
  const [email, setEmail] = useState();
  const [error, setError] = useState(""); 

  const [password, setPassword] = useState();

  const [confirmPassword, setConfirmPassword] = useState("");
  const submithandler = async (e) => {
    e.preventDefault();
    //
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      console.log("passsword error");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const data = JSON.stringify({
        firstName: firstname,
        lastName: lastname,
        password: password,
        email: email,
      });

      const response = await axios.post(
        "http://localhost:3001/user/signUp",
        data,
        config
      );
      console.log("Successful submission:", response.data); // Assuming the server response contains data
    } catch (error) {
      console.log(error);
    }
    signuptologin();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl mb-4">Login</h1>
        <div className="mb-4">
          <label htmlFor="first-name">Firstname</label>
          <input
            type="text"
            id="fname"
            placeholder="Firstname"
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName">lastname</label>
          <input
            type="text"
            id="lastnameinput"
            placeholder="lastname"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
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
            id="passswordinput"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>{" "}
        <div className="mb-4">
          <label htmlFor="confirmPasswordInput">Confirm Password</label>
          <input
            type="password"
            id="confirmPasswordInput"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" onClick={submithandler}>
          Signup
        </button>
        <button onClick={signuptologin}>Switch to Signup</button>
        <button className="btn" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
}
