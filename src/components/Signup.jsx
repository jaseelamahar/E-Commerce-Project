import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Check if email already exists in Firestore with admin role
      const snapshot = await getDoc(doc(db, "users", email));
      if (snapshot.exists() && snapshot.data().role === "admin") {
        setError("This email is reserved for admin and cannot register here.");
        return;
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Save role in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        role: "user",
      });

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 dark:bg-gray-900 p-4 pt-10">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Sign Up
        </h2>
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute top-8 right-3 text-gray-500 dark:text-gray-400"
              tabIndex={-1}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm Password
            </label>
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() =>
                setConfirmPasswordVisible(!confirmPasswordVisible)
              }
              className="absolute top-8 right-3 text-gray-500 dark:text-gray-400"
              tabIndex={-1}
            >
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Centered small rounded button like Login */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-1.5 px-6 rounded-full transition text-sm"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-yellow-500 hover:underline font-semibold"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
