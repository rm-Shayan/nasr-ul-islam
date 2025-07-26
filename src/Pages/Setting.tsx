import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db } from "../Firebase/Firebase";
import { useAuth } from "../Context api";
import { showSuccess,showError } from "../Components";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dfqk1mldk/image/upload";
const CLOUDINARY_PRESET = "profileImageNasrUlIslam";

const Settings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photoURL: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // For profile fetch


useEffect(() => {
  const fetchProfile = async () => {
    if (!user) return;

    setInitialLoading(true); // ✅ Start loading
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          name: data.name || user.displayName || "",
          email: user.email || "",
          photoURL: data.photoURL || user.photoURL || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    } finally {
      setInitialLoading(false); // ✅ End loading
    }
  };

  fetchProfile();
}, [user]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    setLoading(true);
    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.secure_url) {
        const transformedURL = data.secure_url.replace(
          "/upload/",
          "/upload/w_300,h_300,c_limit/"
        );

        setProfile((prev) => ({ ...prev, photoURL: transformedURL }));
      } else {
  
      }
    } catch (err) {
    await showError({
  title: "Upload Failed",
  text: "Please try uploading your profile image again.",
});
    } finally {
      setLoading(false);
    }
  };

 const handleSave = async () => {
  if (!user) return;

  setLoading(true); // ✅ Set true before the operation starts

  try {
    const docRef = doc(db, "users", user.uid);
    const updatedProfile = {
      name: profile.name || "",
      email: profile.email || "",
      ...(profile.photoURL ? { photoURL: profile.photoURL } : {}),
    };

    await setDoc(docRef, updatedProfile, { merge: true });

    await updateProfile(user, {
      displayName: profile.name,
      photoURL: profile.photoURL || null,
    });

    await showSuccess({
      title: "Saved Successfully",
      text: "Your profile has been updated.",
    });
  } catch (error) {
    await showError({
      title: "Update Failed",
      text: "Something went wrong. Please try again.",
    });
  } finally {
    setLoading(false); // ✅ Always reset at the end
  }
};


if (initialLoading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
    </div>
  );
}

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-green-300">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-green-600">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-green-600">Email</label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full p-2 bg-gray-100 border border-green-300 rounded cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-1 text-green-600">Profile Image</label>
            {profile.photoURL && (
              <img
                src={profile.photoURL}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-green-300"
              />
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Profile Preview Card */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-green-300 text-center">
        <h3 className="text-xl font-semibold text-green-700 mb-4">Live Preview</h3>
        <div className="flex flex-col items-center gap-2">
          <img
            src={
              profile.photoURL ||
              "https://via.placeholder.com/150x150.png?text=No+Image"
            }
            alt="Preview"
            className="w-32 h-32 object-cover rounded-full border-2 border-green-300"
          />
          <p className="text-lg font-medium">{profile.name || "Your Name"}</p>
          <p className="text-sm text-gray-600">{profile.email || "you@example.com"}</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
