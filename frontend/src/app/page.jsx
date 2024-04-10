// "use client";

// import { useState } from "react";

// export default function () {
//   const [isloggedin, setIsLoggedIn] = useState(false);
//   useState(() => {
//     const isLoggedIn = localStorage.getItem("name") !== null;
//     setIsLoggedIn(isLoggedIn);
//   }, []);
//   return (
//     <div>
//       <div className="bg-red-800 w-10 h-10 ">
//         {isloggedin ? <h1>heeeeello loggin</h1> : <h1>hello plz login</h1>}
//       </div>
//       <br />
//       <br />
//       <br />
//       <button
//         onClick={() => {
//           localStorage.setItem("name", "name");
//         }}
//       >
//         click to login
//       </button>
//     </div>
//   );
// }

export default function page() {
  return <a href="/login">Login</a>;
}
