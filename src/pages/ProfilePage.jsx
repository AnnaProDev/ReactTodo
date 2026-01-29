import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

const ProfilePage = () => {
	const { email, token } = useAuth();

	const [totalCount, setTotalCount] = useState(0);
	const [completedCount, setCompletedCount] = useState(0);
	const [activeCount, setActiveCount] = useState(0);

	const baseUrl = import.meta.env.VITE_BASE_URL;

	useEffect(() => {
		async function fetchTodosStats() {
			try {
				const response = await fetch(`${baseUrl}/tasks`, {
					method: "GET",
					headers: { "X-CSRF-TOKEN": token },
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error(`HTTP error ${response.status}`);
				}

				const data = await response.json();

				console.log("Profile data: ", data);

				const total = data.length;

				const completed = data.filter((todo) => todo.isCompleted).length;

				const active = total - completed;

				setTotalCount(total);
				setCompletedCount(completed);
				setActiveCount(active);

			} catch (error) {
				console.log(error?.message ?? "Unknown error");
			}
		}

		if (token) fetchTodosStats();
	}, [token, baseUrl]);

  return (
    <div className="card">
      <div className="header">
        <div>
          <h1 className="title">Profile</h1>
          <p className="subtitle">Your info and todo statistics</p>
        </div>
      </div>

      <div className="section">
        <h2 className="sectionTitle">User</h2>
        <p>
          <span className="label">Name: {email}</span> 
        </p>
      </div>

      <div className="section">
        <h2 className="sectionTitle">Todo stats</h2>
        <p>Total: {totalCount}</p>
        <p>Completed: {completedCount}</p>
        <p>Active: {activeCount}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
