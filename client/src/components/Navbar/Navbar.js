import React, { useState, useContext } from "react";
import "./Navbar.css";
import AuthModal from "./AuthModal";
import { AuthContext } from "../AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("login");

  const openModal = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="title">Gym Plan</div>
      <div className="buttons">
        {isAuthenticated ? (
          <button className="action-button" onClick={logout}>
            Logout
          </button>
        ) : (
          <>
            <button
              className="action-button"
              onClick={() => openModal("register")}
            >
              Sign Up
            </button>
            <button
              className="action-button"
              onClick={() => openModal("login")}
            >
              Login
            </button>
          </>
        )}
      </div>

      <AuthModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        content={modalContent}
      />
    </nav>
  );
};

export default Navbar;
