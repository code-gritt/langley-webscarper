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
        const data = await response.json(); // Adjust based on your API
        if (response.ok) {
          setJobs(data); // Assuming API returns job list
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
    if (!token) {
      setError("No token found. Please log in again.");
      return;
    }
    try {
      const response = await fetch(
        `https://langley-webscarper.onrender.com/api/jobs/${id}/execute`,
        {
          method: "GET", // Match the backend route method
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Update the job state with the new result and status
        setJobs(
          jobs.map((job) =>
            job.ID === id
              ? { ...job, Status: "completed", Result: data.results }
              : job
          )
        );
      } else {
        setError(data.error || "Job execution failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.log("Execute Error:", error);
    }
  };

  const handleExport = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://langley-webscarper.onrender.com/api/jobs/${id}/export`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `job_export_${id}.csv`;
      a.click();
    } else {
      setError("Export failed");
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
          <h3 className={`${styles.heading3}`}>Your Jobs</h3>
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
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleExecute(job.ID)}
                      className="bg-blue-gradient py-2 px-4 rounded-lg text-white font-poppins font-medium hover:opacity-90 transition duration-200"
                    >
                      Execute
                    </button>
                    {job.Status === "completed" && (
                      <button
                        onClick={() => handleExport(job.ID)}
                        className="bg-green-gradient py-2 px-4 rounded-lg text-white font-poppins font-medium hover:opacity-90 transition duration-200"
                      >
                        Export
                      </button>
                    )}
                  </div>
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
