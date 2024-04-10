"use client";
import React, { useState } from "react";
import LoginModal from "./@login/page";
import SignupModal from "./@signup/page";
import { useRouter } from "next/navigation";

const Page = () => {
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const router = useRouter();

  const handleOpenLogin = () => {
    setShowLoginModal(true);
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
    router.push("/");
  };

  const handleOpenSignup = () => {
    setShowSignupModal(true);
  };

  const closeall = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    router.push("/");
  };
  const signtologin = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
  };

  return (
    <>
      <div className="flex w-full bg-red-200 justify-between space-x-2">
        <nav>Navbar</nav>
        <button className="flex" onClick={handleOpenLogin}>
          Login
        </button>
      </div>
      {showLoginModal && (
        <LoginModal
          handleClose={handleCloseLogin}
          handleOpenSignup={handleOpenSignup}
        />
      )}
      {showSignupModal && (
        <SignupModal signuptologin={signtologin} handleClose={closeall} />
      )}
    </>
  );
};

export default Page;
