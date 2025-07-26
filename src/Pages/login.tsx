import { useState, useRef, useCallback } from "react";
import { login, loginWithGoogle, createUserDoc } from "../Firebase/firebase.utilities";
import { useNavigate } from "react-router-dom";
import type { User } from "firebase/auth";
import { Link } from "react-router-dom";
import { showError,showSuccess } from "../Components";

export default function  Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = useCallback(() => {
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    if (!email || !password) {
      setError("Both fields are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    return true;
  }, []);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const email = emailRef.current!.value;
      const password = passwordRef.current!.value;

      await login(email, password);
       await showSuccess({
  title: 'Login Sucessfully',
  text: 'Thanks for Login!',
});

      navigate("/");
    } catch (error: any) {
      setError(error.message);
      await showError({
        title: 'Oops',
  text: 'Somethings went wrong ! Please try Again',}); 

    }
  }, [navigate, validateForm]);

const handleGoogleLogin = useCallback(async () => {
try {
  const userCredential = await loginWithGoogle();
  const user: User = userCredential.user;

      await showSuccess({
  title: 'Login Sucessfully',
  text: 'Thanks for Login!',
});

  await createUserDoc(user);

   navigate("/");
} catch (error: any) {
  console.error("❌ Login Error:", error.message);
  setError(error.message);

await showError({
        title: 'Oops',
  text: 'Somethings went wrong ! Please try Again',}); 
}

}, [navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-sm p-6">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          نصر الاسلام (Nasr-ul-Islam)
        </h1>

        <input
          ref={emailRef}
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          className="w-full mb-3 px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {error && (
          <div className="mb-3 text-sm text-red-600 text-center">{error}</div>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Login
        </button>

   <p className="mt-4 text-center text-sm text-gray-600">
        if had'nt signUp yet?{" "}
        <Link to="/Auth/signup" className="text-green-700 font-medium hover:underline">
  Sign up here
</Link>
        </p>
        <div className="my-4 text-gray-400 text-center">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-green-500 text-green-700 font-semibold py-2 rounded-lg hover:bg-green-50 transition duration-200"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
