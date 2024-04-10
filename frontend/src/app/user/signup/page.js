"use client";
import { data } from "autoprefixer";
import axios from "axios";
import { useState } from "react";

export default function page() {
  const [firstname, setFirstname] = useState();
  const [lastname, setLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const submithandler = async (e) => {
    e.preventDefault();
    console.log(firstname, lastname, email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const data = JSON.stringify( {
        
          "firstName":firstname,
          "lastName":lastname,
          "password":password,
          "email":email
      }      );

      const response = await axios.post(
        "http://localhost:3001/user/signUp",
        data,
        config
      );

      // const data = await axios.post(
      //   "http://localhost:3001/user/signUp",
      //   { firstname, lastname, email, password },
      //   config
      // );
      console.log("Successful submission:", response.data); // Assuming the server response contains data
    } catch (error) {
      console.log("strt"+data+"end")
      console.log(error);
    }
  };
  return (
    <div className="mt-10 w-10 ml-7">
      <lable>firstname</lable>
      <input
        type="text"
        id="fname"
        placeholder="Firstname"
        onChange={(e) => setFirstname(e.target.value)}
      />{" "}
      <lable>lastname</lable>
      <input
        type="text"
        id="lastnameinput"
        placeholder="lastname"
        onChange={(e) => setLastName(e.target.value)}
      />{" "}
      <lable>email</lable>
      <input
        type="email"
        id="emailInput"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />{" "}
      <lable>password</lable>
      <input
        type="password"
        id="passswordinput"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />{" "}
      <button type="submit" onClick={submithandler}>
        submit
      </button>
    </div>
  );
}
