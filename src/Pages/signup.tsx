import { useReducer, useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
 type User,
} from "firebase/auth";
import { auth } from "../Firebase/Firebase";
import { createUserDoc} from "../Firebase/firebase.utilities";

import { showError,showSuccess } from "../Components";
import { useAuth } from "../Context api";
const initialState = {
  name: "",
  email: "",
  password: "",
  error: "",
  nameError: "",
  emailError: "",
  passwordError: "",
};

type Action =
  | { type: "SET_FIELD"; field: string; value: string }
  | { type: "SET_ERROR"; error: string }
  | { type: "SET_FIELD_ERROR"; field: string; error: string }
  | { type: "RESET" };

function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_FIELD_ERROR":
      return { ...state, [`${action.field}Error`]: action.error };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const Signup = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
const {logout}=useAuth()

  useEffect(() => {
    // Prevent form resubmission on reload
    if (window.history.replaceState) {
      window.history.replaceState(null, "", window.location.href);
    }
  }, []);

  const validate = (): boolean => {
    let valid = true;

    // Name validation: only letters and spaces
    if (!/^[A-Za-z\s]{3,}$/.test(state.name)) {
      dispatch({
        type: "SET_FIELD_ERROR",
        field: "name",
        error: "Enter a valid name (min 3 letters, only alphabets).",
      });
      valid = false;
    } else {
      dispatch({ type: "SET_FIELD_ERROR", field: "name", error: "" });
    }

    // Email validation
    if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(state.email)
    ) {
      dispatch({
        type: "SET_FIELD_ERROR",
        field: "email",
        error: "Invalid email format.",
      });
      valid = false;
    } else {
      dispatch({ type: "SET_FIELD_ERROR", field: "email", error: "" });
    }

    // Password validation: at least 6 chars, 1 letter & 1 number
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(state.password)) {
      dispatch({
        type: "SET_FIELD_ERROR",
        field: "password",
        error:
          "Password must be at least 6 characters with letters and numbers.",
      });
      valid = false;
    } else {
      dispatch({ type: "SET_FIELD_ERROR", field: "password", error: "" });
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_ERROR", error: "" });

    if (!validate()) return;

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        state.email,
        state.password
      );
      const user: User = userCredential.user;
      console.log("✅ Firebase user created:", user.uid);
      
const logoutSuccess = await logout();  // 👈 is line se value assign hoti hai
if (logoutSuccess) {
  navigate("/login");
}
       await showSuccess({
  title: 'Account Created',
  text: 'Your account has been successfully created!',
});


      await updateProfile(user, { displayName: state.name });

      await createUserDoc(user); // Firestore document creation



      setSuccess(true);
      dispatch({ type: "RESET" });



    } catch (err: any) {
      dispatch({ type: "SET_ERROR", error: err.message });
 await showError({
  title: 'Oops',
  text: 'Somethings went wrong please Try again!',
});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm"
        noValidate
      >
        <h1 className="text-3xl font-bold text-center text-green-700 mb-4">
          نصر الإسلام
        </h1>
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-700">
          Create an Account
        </h2>

        {state.error && (
          <p className="text-red-500 mb-2 text-sm text-center">{state.error}</p>
        )}

        {success && (
          <p className="text-green-600 mb-2 text-sm text-center">
            Account created successfully ✅
          </p>
        )}

        <div className="mb-3">
          <input
            type="text"
            placeholder="Full Name"
            value={state.name}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          {state.nameError && (
            <p className="text-red-500 text-xs mt-1">{state.nameError}</p>
          )}
        </div>

        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            value={state.email}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          {state.emailError && (
            <p className="text-red-500 text-xs mt-1">{state.emailError}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={state.password}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "password",
                value: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
            required
          />
          {state.passwordError && (
            <p className="text-red-500 text-xs mt-1">{state.passwordError}</p>
          )}
        </div>

        <button
          type="submit"
          className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 w-full rounded ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/Auth/login"
            className="text-green-700 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
