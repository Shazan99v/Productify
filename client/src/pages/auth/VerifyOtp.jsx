import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("No email found. Please signup again.");
      navigate("/signup");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>

        <p className="text-center mb-4">
          Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="input input-bordered w-full mb-6"
          required
        />

        <button type="submit" className="btn btn-primary w-full">
          Verify OTP
        </button>

        <p className="mt-4 text-center">
          Didn't receive OTP?{" "}
          <span
            className="text-secondary cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Signup again
          </span>
        </p>
      </form>
    </div>
  );
};

export default VerifyOtp;