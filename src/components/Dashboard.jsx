import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../style";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = new URLSearchParams(location.search).get("jobId");

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        return;
      }
      try {
        const response = await fetch(
          "https://langley-webscarper.onrender.com/api/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setJobs(data); // Adjust based on your API response format
        } else {
          setError(data.error || "Failed to fetch jobs");
        }
      } catch (error) {
        setError("Network error. Please try again.");
      }
    };
    fetchJobs();
  }, []);

  const handleExecute = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://langley-webscarper.onrender.com/api/jobs/${id}/execute`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setJobs(
          jobs.map((job) =>
            job.ID === id
              ? { ...job, status: "completed", result: data.results }
              : job
          )
        );
      } else {
        setError(data.error || "Job execution failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <section className={`${styles.flexCenter} bg-primary min-h-screen`}>
      <div className="bg-black-gradient-2 p-8 sm:p-12 rounded-[20px] shadow-lg w-full max-w-2xl">
        <h2 className={`${styles.heading2} text-center`}>Dashboard</h2>
        {error && (
          <p className="text-red-500 text-center mb-4 font-poppins">{error}</p>
        )}
        <div className="mt-6">
          {jobs.length === 0 ? (
            <p className="text-dimWhite text-center">
              No jobs yet. Create one!
            </p>
          ) : (
            <ul className="space-y-4">
              {jobs.map((job) => (
                <li
                  key={job.ID}
                  className="bg-dimBlue p-4 rounded-lg text-white"
                >
                  <p>
                    <strong>URL:</strong> {job.URL}
                  </p>
                  <p>
                    <strong>Selector:</strong> {job.Selector}
                  </p>
                  <p>
                    <strong>Status:</strong> {job.Status}
                  </p>
                  {job.Result && (
                    <p>
                      <strong>Result:</strong> {job.Result}
                    </p>
                  )}
                  <button
                    onClick={() => handleExecute(job.ID)}
                    className="mt-2 bg-blue-gradient py-2 px-4 rounded-lg text-white font-poppins font-medium hover:opacity-90 transition duration-200"
                  >
                    Execute
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="text-dimWhite text-sm text-center mt-6">
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/create-job")}
          >
            Create New Job
          </span>
        </p>
      </div>
    </section>
  );
};

export default Dashboard;
