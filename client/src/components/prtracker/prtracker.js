import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { jwtDecode } from "jwt-decode";
import "./PrTracker.css";

const PrTracker = () => {
  const [prs, setPrs] = useState([]);
  const [editingPrId, setEditingPrId] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  let userID = null;

  if (isAuthenticated) {
    let cookieValue = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (cookieValue) {
      try {
        userID = jwtDecode(cookieValue).id;
      } catch (error) {
        console.error("Error decoding the token:", error);
      }
    }
  }
  useEffect(() => {
    if (isAuthenticated && userID) {
      fetchPrs();
    }
  }, [isAuthenticated, userID]);

  const fetchPrs = async () => {
    try {
      const response = await fetch(
        `http://localhost:9000/get-pr?userID=${userID}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch PRs");
      }
      const data = await response.json();
      setPrs(data);
    } catch (error) {
      console.error("Error fetching PRs:", error);
    }
  };

  const addPr = async (name, weightKg) => {
    try {
      const response = await fetch("http://localhost:9000/add-pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, weightKg, userID }),
      });
      if (!response.ok) {
        throw new Error("Failed to add PR");
      }
      fetchPrs();
    } catch (error) {
      console.error("Error adding PR:", error);
    }
  };

  const handleEditPrWeight = async (id, newWeight) => {
    try {
      const response = await fetch(`http://localhost:9000/update-pr/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prs.find((pr) => pr._id === id).name,
          weightKg: newWeight,
          id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update PR weight");
      }
      fetchPrs();
      setEditingPrId(null);
    } catch (error) {
      console.error("Error updating PR weight:", error);
    }
  };

  const handleDeletePr = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:9000/delete-pr/?_id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete PR");
      }
      fetchPrs();
    } catch (error) {
      console.error("Error deleting PR:", error);
    }
  };
  if (!isAuthenticated) {
    return <div>Please log in to see your gym personal records.</div>;
  }
  return (
    <aside id="prtracker">
      <h2>My Gym Personal Record</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addPr(e.target.prName.value, parseFloat(e.target.prWeight.value));
          e.target.prName.value = "";
          e.target.prWeight.value = "";
        }}
      >
        <input
          type="text"
          id="prName"
          name="prName"
          placeholder="Enter Exercise Name"
          required
        />
        <input
          type="number"
          id="prWeight"
          name="prWeight"
          placeholder="Weight (KG)"
          required
        />
        <button type="submit">Add PR</button>
      </form>
      <ul>
        {prs.map((pr) => (
          <li key={pr._id}>
            {editingPrId === pr._id ? (
              <input
                type="number"
                defaultValue={pr.weightKg}
                onBlur={(e) =>
                  handleEditPrWeight(pr._id, parseFloat(e.target.value))
                }
                autoFocus
              />
            ) : (
              <span>
                {pr.name} - {pr.weightKg} KG
              </span>
            )}
            <button onClick={() => setEditingPrId(pr._id)}>Edit Weight</button>
            <button onClick={() => handleDeletePr(pr._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default PrTracker;
