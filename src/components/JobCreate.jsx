import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../style";

const JobCreate = () => {
  const [url, setUrl] = useState("");
  const [selector, setSelector] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Add this to debug
    if (!token) {
      setError("No token found. Please log in again.");
      return;
    }
    const response = await fetch(
      "https://langley-webscarper.onrender.com/api/jobs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url, selector }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      navigate("/dashboard");
    } else {
      const data = await response.json();
      setError(data.error || "Job creation failed");
      console.log("Error Response:", data);
    }
  };

  return (
    <section className={`${styles.flexCenter} bg-primary min-h-screen`}>
      <div className="bg-black-gradient-2 p-8 sm:p-12 rounded-[20px] shadow-lg w-full max-w-md">
        <h2 className={`${styles.heading2} text-center`}>Create a Job</h2>
        <p className={`${styles.paragraph} text-center mb-6`}>
          Enter a target website and a CSS selector to scrape.
        </p>

        {error && (
          <p className="text-red-500 text-center mb-4 font-poppins">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL (https://example.com)"
            className="p-3 rounded-lg bg-dimBlue text-white font-poppins outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            placeholder="Enter CSS Selector (e.g., h1, .title)"
            className="p-3 rounded-lg bg-dimBlue text-white font-poppins outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="mt-4 bg-blue-gradient py-3 rounded-lg text-white font-poppins font-medium hover:opacity-90 transition duration-200"
          >
            Create Job
          </button>
        </form>

        <p className="text-dimWhite text-sm text-center mt-6">
          Want to see your jobs?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </span>
        </p>
      </div>
    </section>
  );
};

export default JobCreate;
