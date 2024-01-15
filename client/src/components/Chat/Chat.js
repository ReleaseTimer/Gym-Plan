import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../AuthContext"; // Import AuthContext
import "./Chat.css";

// Establish a connection to the WebSocket server
const socket = io("http://localhost:9000");

function Chat() {
  const { isAuthenticated } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Fetch the user's profile to get the username
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:9000/get-profile", {
          method: "GET",
          credentials: "include", // Include credentials if needed
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const profileData = await response.json();
        setUsername(profileData.username);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();

    // Listen for chat messages from the server
    const receiveMessage = (newMessage) => {
      setMessages((msgs) => [...msgs, newMessage]);
    };

    socket.on("chat message", receiveMessage);

    return () => {
      socket.off("chat message", receiveMessage);
    };
  }, [isAuthenticated]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message && username) {
      const messageData = {
        text: message,
        username: username,
      };
      socket.emit("chat message", messageData);
      setMessage("");
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in to use the chat feature.</div>;
  }

  return (
    <>
      <aside id="chat">
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.username}:</strong> {msg.text}
            </li>
          ))}
        </ul>
      </aside>

      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default Chat;
