// Update Navbar component (assuming it's in src/components/Navbar.jsx or similar)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { close, logo, menu } from "../assets";
import { navLinks } from "../constants";
import useAuthStore from "../store/authStore"; // Adjust path if needed

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-primary px-6 py-4 flex justify-between items-center navbar">
      {/* <img src={logo} alt="Langley" className="w-[124px] h-[32px]" /> */}

      <ul className="list-none sm:flex hidden justify-start items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              active === nav.title ? "text-white" : "text-dimWhite"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
        ))}
      </ul>

      <div className="sm:flex hidden items-center">
        {user ? (
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {getInitials(user.email)}
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <p className="px-4 py-2 text-sm text-gray-700">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="mr-4 font-poppins text-white"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="font-poppins text-white bg-blue-gradient px-4 py-2 rounded"
            >
              Register
            </button>
          </>
        )}
      </div>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-white" : "text-dimWhite"
                } ${index === navLinks.length - 1 ? "mb-4" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
            {!user ? (
              <>
                <li
                  className="font-poppins font-medium cursor-pointer text-[16px] text-dimWhite mb-4"
                  onClick={() => {
                    setToggle(false);
                    navigate("/login");
                  }}
                >
                  Login
                </li>
                <li
                  className="font-poppins font-medium cursor-pointer text-[16px] text-dimWhite"
                  onClick={() => {
                    setToggle(false);
                    navigate("/register");
                  }}
                >
                  Register
                </li>
              </>
            ) : (
              <>
                <li className="font-poppins font-medium text-[16px] text-dimWhite mb-4">
                  {user.email}
                </li>
                <li
                  className="font-poppins font-medium cursor-pointer text-[16px] text-dimWhite"
                  onClick={() => {
                    setToggle(false);
                    handleLogout();
                  }}
                >
                  Logout
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
