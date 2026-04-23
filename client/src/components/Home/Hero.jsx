import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import heroImage from "../../assets/images/Hero.png"; 

const Hero = () => {

  
  const navigate = useNavigate();

  const handleStartSelling = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("You must be logged in to start selling!");
      return;
    }
    navigate("/add-products"); 
  };

  return (
    <section className="relative flex justify-center items-center min-h-[80vh] px-5 bg-base-200">
      {/* Glow / blur background */}
      <div
        className="absolute w-72 h-72 rounded-full filter blur-3xl opacity-40
        bg-primary/50 dark:bg-secondary/50
        animate-pulse"
      ></div>

      {/* Card */}
      <div className="relative z-10 bg-base-100 dark:bg-base-300 rounded-2xl shadow-xl flex flex-col md:flex-row items-center p-8 gap-8 max-w-6xl w-full">
        
        {/* Left Part */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Share Your <span className="text-primary">Products</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Discover the ultimate marketplace for tech enthusiasts! On our platform, you can easily buy
             and sell the latest gadgets, devices, and tech accessories all in one place. Whether you’re
             looking to upgrade your gear or find a great deal, our community-driven marketplace
             makes it simple, safe, and fast to connect buyers and sellers who share a passion for technology.
          </p>
          <button
            onClick={handleStartSelling}
            className="btn btn-primary btn-lg animate-pulse w-40"
          >
            Start Selling
          </button>
        </div>

        {/* Right Part */}
        <div className="flex-1 flex justify-center md:justify-end">
          <img
            src={heroImage}
            alt="Hero"
            className="w-64 md:w-80 rounded-xl shadow-2xl"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;