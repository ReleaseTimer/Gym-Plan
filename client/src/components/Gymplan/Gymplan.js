import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { jwtDecode } from "jwt-decode";
import "./Gymplan.css";
const Gymplan = () => {
  const [gymPlanData, setGymPlanData] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);
  const [selectedPlan, setSelectedPlan] = useState(null);

  let cookieValue = document.cookie.replace(
    /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  let userID = null;
  if (cookieValue.length) {
    userID = jwtDecode(cookieValue).id;
  }

  const fetchGymPlanData = async () => {
    try {
      const response = await fetch(
        `http://localhost:9000/get-gymplan/?` +
          new URLSearchParams({ userID }).toString(),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setGymPlanData(data);
      }
    } catch (error) {
      console.error("Failed to fetch gym plan data:", error);
    }
  };
  console.log(`Current userID state: ${userID}`);

  useEffect(() => {
    console.log(userID);
    if (isAuthenticated) {
      fetchGymPlanData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Please log in to see your gym plan.</div>;
  }

  if (!gymPlanData) {
    return <div>Loading your gym plan... W{}</div>;
  }

  // Function to handle selecting a plan
  const selectPlan = (planId) => {
    const plan = gymPlanData.find((p) => p._id === planId);
    setSelectedPlan(plan);
  };

  const addPlan = async (event) => {
    event.preventDefault();
    const planName = event.target.planName.value;

    if (!planName.trim()) {
      alert("Please enter a plan name.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:9000/create-gym`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: planName,
          userID: userID,
          exercises: [],
        }),
        credentials: "include",
      });
      if (response.ok) {
        fetchGymPlanData();
      } else {
        console.error("Failed to add plan:");
      }
    } catch (error) {
      console.error("Error adding plan:", error);
    }
  };

  // Function to handle deleting a plan
  const deletePlan = async (planId) => {};

  // Function to handle editing a plan
  const editPlan = (planId) => {};

  return (
    <div id="gymplan">
      <h2>My Gym Plans</h2>
      <form onSubmit={addPlan}>
        <input
          type="text"
          id="addPlan"
          name="planName"
          placeholder="Enter Plan Name"
        />
        <button type="submit">Add Plan</button>
      </form>
      <ul>
        {gymPlanData.map((plan) => (
          <li key={plan._id}>
            <span onClick={() => selectPlan(plan._id)}>{plan.planName}</span>
            <button onClick={() => editPlan(plan._id)}>Edit</button>
            <button onClick={() => deletePlan(plan._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {selectedPlan && (
        <div>
          <h3>Exercises for {selectedPlan.planName}</h3>
          <ul>
            {selectedPlan.exercises.map((exercise, index) => (
              <li key={index}>{exercise.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Gymplan;
