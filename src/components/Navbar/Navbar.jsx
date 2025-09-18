
import { useEffect, useRef, useState, useMemo } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useProducts } from "../../context/ProductContext";
import { useNavigate, Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import Logo from "../../assets/Logo.jpeg";

const Navbar = () => {
  const { products } = useProducts();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const menu = useMemo(
    () => [{ id: 1, name: "Home", link: "/" }, ...categories],
    [categories]
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const categoriesData = snapshot.docs.map((doc, index) => ({
        id: index + 2,
        name: doc.data().name,
        link: `/category/${doc.data().name}`,
      }));
      setCategories(categoriesData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const cartRef = collection(db, "users", currentUser.uid, "cart");
        const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
          const count = snapshot.docs.reduce(
            (total, doc) => total + (doc.data().quantity || 1),
            0
          );
          setCartCount(count);
        });
        return () => unsubscribeCart();
      } else {
        setCartCount(0);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div>
      {/* Upper Navbar */}
      <div className="bg-gradient-to-r from-pink-100 via-sky-100 to-pink-100 dark:from-gray-950 dark:via-gray-900 transition-colors duration-500">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center py-3 px-4">
          <Link
            to="/"
            className="font-bold text-2xl sm:text-3xl flex gap-2 items-center mb-2 sm:mb-0"
          >
            <img src={Logo} alt="Logo" className="w-16 sm:w-20 rounded-lg shadow-md" />
          </Link>

          {/* Search, Cart & Auth */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto group" ref={searchRef}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-400 dark:border-gray-600 px-3 py-1 focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <IoMdSearch
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 cursor-pointer"
              />
            </div>

            <button
              onClick={() => navigate("/cart")}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-2 px-4 rounded-full flex items-center gap-2 transition shadow-md hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <FaCartShopping size={20} />
              {cartCount > 0 && (
                <span className="text-white font-bold">{cartCount}</span>
              )}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 text-pink-700 hover:text-black-500 transition w-full sm:w-auto justify-center"
              >
                <VscAccount size={24} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-50">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-700"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-700"
                      >
                        Signup
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Navbar */}
      <div className="bg-white border-t border-b border-pink-50 dark:bg-gray-900">
        <ul className="flex flex-wrap justify-center gap-6 text-pink-400 dark:text-blue-100 py-2 font-medium">
          {menu.map((data) => (
            <li key={data.id}>
              <Link
                to={data.link}
                className="hover:text-pink-500 dark:hover:text-pink-400 transition"
              >
                {data.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
