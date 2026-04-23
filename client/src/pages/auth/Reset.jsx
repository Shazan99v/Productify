import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("No email found. Please try Forgot Password again.");
      navigate("/forgot-password");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: formData.otp, newPassword: formData.newPassword }),
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
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        <p className="text-center mb-4">
          Enter OTP sent to <span className="font-semibold">{email}</span> and your new password
        </p>

        <input
          type="text"
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          placeholder="Enter OTP"
          className="input input-bordered w-full mb-4"
          required
        />

        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="New Password"
          className="input input-bordered w-full mb-6"
          required
        />

        <button type="submit" className="btn btn-primary w-full">
          Reset Password
        </button>

        <p className="mt-4 text-center">
          Remembered your password?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;