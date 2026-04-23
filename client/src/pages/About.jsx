import React from "react";
import { FaRocket, FaLock, FaGlobe, FaLightbulb, FaChartLine, FaHandsHelping } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const About = () => {
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
    <div className="min-h-screen bg-base-200 px-6 py-12 space-y-20">

      {/* Hero Section */}
      <section className="relative text-center py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-10 blur-3xl -z-10"></div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">About Productify</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Productify is the ultimate platform for sellers and buyers. Share your products, reach thousands of customers, and grow your business effortlessly.
        </p>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card bg-base-100 shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
          <FaRocket className="text-5xl text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Easy to Use</h2>
          <p className="text-gray-600">Add products in minutes and start selling immediately.</p>
        </div>

        <div className="card bg-base-100 shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
          <FaLock className="text-5xl text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Secure</h2>
          <p className="text-gray-600">Your data and transactions are fully protected.</p>
        </div>

        <div className="card bg-base-100 shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
          <FaGlobe className="text-5xl text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Reach Customers</h2>
          <p className="text-gray-600">Showcase your products to thousands of buyers worldwide.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-4xl font-bold text-primary flex items-center gap-3">
            <FaLightbulb /> Our Mission
          </h2>
          <p className="text-gray-600 text-lg">
            To empower sellers to grow their business online easily by providing a user-friendly, secure, and modern platform.
          </p>
        </div>
        <div className="flex justify-center">
          <FaRocket className="text-8xl text-primary" />
        </div>
      </section>

      {/* Vision Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center md:order-2">
          <FaGlobe className="text-8xl text-accent" />
        </div>
        <div className="flex flex-col justify-center space-y-4 md:order-1">
          <h2 className="text-4xl font-bold text-secondary flex items-center gap-3">
            <FaChartLine /> Our Vision
          </h2>
          <p className="text-gray-600 text-lg">
            To create a global marketplace where every seller, no matter how small, can reach their audience and scale efficiently.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-8">Why Choose Productify?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: <FaRocket />, title: "Fast Setup", desc: "Get started in minutes." },
            { icon: <FaLightbulb />, title: "Smart Tools", desc: "Manage products easily." },
            { icon: <FaChartLine />, title: "Grow Sales", desc: "Reach thousands of customers." },
            { icon: <FaHandsHelping />, title: "Support", desc: "We are here to help 24/7." },
          ].map((item, idx) => (
            <div key={idx} className="card bg-base-100 shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-3 mx-auto">{item.icon}</div>
              <h3 className="text-xl font-bold mb-1">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Selling?</h2>
        <p className="text-gray-600 mb-6">
          Join Productify today and grow your business online effortlessly!
        </p>
        <button
          className="btn btn-primary btn-lg animate-pulse"
          onClick={handleStartSelling}
        >
          Start Selling
        </button>
      </section>
    </div>
  );
};

export default About;