import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import { AuthContext } from "../AuthContext";

function ProfileModal({ isOpen, onRequestClose }) {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const { isAuthenticated } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    // Fetch user data when the modal opens
    if (isOpen && isAuthenticated) {
      fetchUserData();
    }
  }, [isOpen, isAuthenticated]);

  const fetchUserData = async () => {
    try {
      // Replace with your actual fetch call
      const response = await fetch("http://localhost:9000/get-profile", {
        credentials: "include", // If you're using session cookies
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const profileData = await response.json();
      setUserData({ username: profileData.username, email: profileData.email });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSave = async () => {
    try {
      // Replace with your actual update API call
      const response = await fetch("http://localhost:9000/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include", // If you're using session cookies
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      onRequestClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch("http://localhost:9000/delete-profile", {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to delete profile");
        }

        logout();
        onRequestClose();
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="MyModal"
      overlayClassName="MyModalOverlay"
    >
      <div className="MyModalContent">
        <button onClick={onRequestClose}>X</button>
        <h2>User Profile</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={userData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
          />
          <button className="action-button" type="button" onClick={handleSave}>
            Save Changes
          </button>
          <button type="button" onClick={handleDelete}>
            Delete Profile
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default ProfileModal;
