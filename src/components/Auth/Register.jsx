import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../style"; // reuse your global styles (fonts, colors, spacing)

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      navigate("/login");
    } else {
      const data = await response.json();
      setError(data.error || "Registration failed");
    }
  };

  return (
    <section className={`${styles.flexCenter} bg-primary min-h-screen`}>
      <div className="bg-black-gradient-2 p-8 sm:p-12 rounded-[20px] shadow-lg w-full max-w-md">
        <h2 className={`${styles.heading2} text-center`}>Create Account</h2>
        <p className={`${styles.paragraph} text-center mb-6`}>
          Sign up to start scraping smarter with Langley.
        </p>

        {error && (
          <p className="text-red-500 text-center mb-4 font-poppins">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-3 rounded-lg bg-dimBlue text-white font-poppins outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-3 rounded-lg bg-dimBlue text-white font-poppins outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="mt-4 bg-blue-gradient py-3 rounded-lg text-white font-poppins font-medium hover:opacity-90 transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-dimWhite text-sm text-center mt-6">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </section>
  );
};

export default Register;
