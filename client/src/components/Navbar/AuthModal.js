import React, { useContext } from "react";
import Modal from "react-modal";
import { AuthContext } from "../AuthContext";

Modal.setAppElement("#root");

function AuthModal({ isOpen, onRequestClose, content }) {
  const { login, register } = useContext(AuthContext);
  const isLogin = content === "login";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");

    if (isLogin) {
      await login(username, password);
    } else {
      const email = formData.get("email");
      await register(username, email, password);
    }
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="MyModal"
      overlayClassName="MyModalOverlay"
    >
      <div className="MyModalContent">
        <h2 className="MyModalHeader">{isLogin ? "Login" : "Register"}</h2>
        <form className="MyModalForm" onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" name="username" />
          {!isLogin && <input type="email" placeholder="Email" name="email" />}
          <input type="password" placeholder="Password" name="password" />
          <button type="submit" className="MyModalButton">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <button onClick={onRequestClose} className="MyModalCloseButton">
          Close
        </button>
      </div>
    </Modal>
  );
}

export default AuthModal;
