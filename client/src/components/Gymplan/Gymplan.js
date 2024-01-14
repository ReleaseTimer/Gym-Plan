import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { jwtDecode } from "jwt-decode";
import "./Gymplan.css";
const Gymplan = () => {
  const [gymPlanData, setGymPlanData] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingExerciseId, setEditingExerciseId] = useState(null);

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
    return <div>Loading your gym plan...</div>;
  }

  // Function to handle selecting a plan
  const selectPlan = (_id) => {
    const plan = gymPlanData.find((p) => p._id === _id);
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
      const response = await fetch(`http://localhost:9000/create-gymplan`, {
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
  const deletePlan = async (_id) => {
    try {
      const response = await fetch(
        `http://localhost:9000/delete-gymplan/?` +
          new URLSearchParams({ _id }).toString(),
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchGymPlanData();
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  // Function to handle editing a plan
  const editPlan = async (_id, newPlanName) => {
    try {
      const response = await fetch(`http://localhost:9000/update-gymplan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName: newPlanName, _id: _id }),
        credentials: "include",
      });
      if (response.ok) {
        // Update the local state with the new plan name
        const updatedPlans = gymPlanData.map((plan) =>
          plan._id === _id ? { ...plan, planName: newPlanName } : plan
        );
        setGymPlanData(updatedPlans);
        setEditingPlanId(null); // Stop editing mode
      } else {
        console.error("Failed to update plan:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  const addExercise = async (_id, exercise) => {
    try {
      const response = await fetch(`http://localhost:9000/add-exercise`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: _id, exercises: exercise }),
      });
      console.log(_id, exercise);
      if (response.ok) {
        fetchGymPlanData();
        selectPlan(_id);
      }
    } catch (error) {
      console.error("Error adding exercise to plan:", error);
    }
  };

  const editExercise = async (_id, exerciseId, newName) => {};

  const deleteExercise = async (_id, exerciseId) => {};

  return (
    <main>
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
            <li key={plan._id} id={plan._id}>
              {editingPlanId === plan._id ? (
                <input
                  type="text"
                  defaultValue={plan.planName}
                  onBlur={(e) => editPlan(plan._id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      editPlan(plan._id, e.target.value);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <span onClick={() => selectPlan(plan._id)}>
                  {plan.planName}
                </span>
              )}
              <button onClick={() => setEditingPlanId(plan._id)}>Edit</button>
              <button onClick={() => deletePlan(plan._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedPlan && (
        <div id="exercises">
          <h3>Exercises for {selectedPlan.planName}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const newExercise = {
                name: form.name.value,
                reps: parseInt(form.reps.value),
                sets: parseInt(form.sets.value),
                weightKg: parseFloat(form.weightKg.value),
                duration: parseInt(form.duration.value),
              };
              addExercise(selectedPlan._id, newExercise);
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Exercise Name"
              required
            />
            <input type="number" name="reps" placeholder="Reps" />
            <input type="number" name="sets" placeholder="Sets" />
            <input type="number" name="weightKg" placeholder="Weight (kg)" />
            <input
              type="number"
              name="duration"
              placeholder="Duration (minutes)"
            />
            <button type="submit">Add Exercise</button>
          </form>
          <ul>
            {selectedPlan.exercises.map((exercise) => (
              <li key={exercise._id}>
                <span>{exercise.name}</span> -<span>{exercise.reps} reps</span>{" "}
                -<span>{exercise.sets} sets</span> -
                <span>{exercise.weightKg} kg</span> -
                <span>{exercise.duration} (M)</span>
                <button
                  onClick={() => editExercise(selectedPlan._id, exercise._id)}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteExercise(selectedPlan._id, exercise._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
};

export default Gymplan;
