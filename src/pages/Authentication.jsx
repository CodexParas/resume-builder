import React, { useEffect } from "react";
import { Logo } from "../assets";
import { AuthButton, Footer, MainSpinner } from "../components";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const { data, error, isLoading } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && data) {
      navigate("/", { replace: true });
    }
  }, [isLoading, data]);
  if (isLoading) {
    return <MainSpinner />;
  }

  return (
    <div className="auth-screen">
      {/* top section */}
      <img src={Logo} className="w-12 h-auto object-contain" alt="Logo" />
      {/* main section */}
      <div className="auth-main">
        <h1 className="text-3xl lg:text-4xl text-blue-700">
          Welcome to Express Resume
        </h1>
        <p className="text-base text-gray-600">Express Way to create Resume</p>
        <h2 className="text-2xl text-gray-600">Authenticate</h2>
        <div className="w-full lg:w-96 rounded-md flex flex-col items-center justify-start gap-6">
          <AuthButton
            Icon={FaGoogle}
            label={"Signin with Google"}
            provider={"GoogleAuthProvider"}
          />
          <AuthButton
            Icon={FaGithub}
            label={"Signin with Github"}
            provider={"GithubAuthProvider"}
          />
        </div>
      </div>
      {/* footer section */}
      <Footer />
    </div>
  );
};

export default Authentication;
