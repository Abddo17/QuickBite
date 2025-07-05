import { useState, useEffect, useRef } from "react";
import {
    navLists,
    bagImg,
    favorite,
    searchImg,
    profileImg,
    menuIcon,
    rightArrow,
    closeIcon,
} from "../constants";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, logoutUser } from "../features/authSlice";
import {
    selectIsAuthenticated,
    selectUser,
    selectCartItemCount,
    selectFavoritesCount,
    selectFetchStatus,
} from "../selectors/authSelectors";
import NavSearch from "./NavSearch.jsx";
import { fetchProducts, resetFilters } from "../features/productsSlice.jsx";

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchBar, setSearchBar] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const userStatus = useSelector(selectFetchStatus);
    const cartItemCount = useSelector(selectCartItemCount);
    const favoritesCount = useSelector(selectFavoritesCount);
    useEffect(() => {
        if (userStatus === "loading" || userStatus === "idle") {
            dispatch(fetchUser());
        }
    }, [userStatus, dispatch]);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    const closeDropdown = () => setIsDropdownOpen(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                closeDropdown();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser());
            closeDropdown();
            closeMenu();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleCartClick = () => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            navigate("/cart");
        }
        closeMenu();
    };

    const handleFavoritesClick = () => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            navigate("/favorites");
        }
        closeMenu();
    };

    const handleHomeClick = () => {
        // Optional: Reset Redux filters if needed
        dispatch(resetFilters());

        // Dispatch fetch with default parameters
        dispatch(
            fetchProducts({
                page: 1,
                per_page: 50,
                sort_by: "created_at",
                sort_dir: "desc",
            })
        );

        // Navigate to home route
        navigate("/");
    };

    return (
        <>
            <div className="w-full  top-0 z-[100] ">
                <header className="w-full py-4 px-4 sm:px-6 lg:px-10 flex justify-between items-center relative text-black bg-main-100 poppins transition-all duration-300">
                    <nav className="w-full flex items-center justify-between max-w-7xl mx-auto">
                        <div className="text-2xl sm:text-3xl cursor-pointer font-bold tracking-tight">
                            <Link
                                to="/"
                                className="transition-colors duration-200"
                            >
                                QuickBite
                            </Link>
                        </div>

                        {/* Desktop  */}
                        <ul className="hidden md:flex flex-1 justify-center items-center space-x-4 pt-2">
                            {navLists.map((item, i) => (
                                <li key={i}>
                                    <Link
                                        to={item.path}
                                        onClick={
                                            item.name === "Home"
                                                ? handleHomeClick
                                                : undefined
                                        }
                                        className="px-4 py-2 text-base font-medium cursor-pointer hover:text-yellow-500 text-gray-800 rounded-md transition-all duration-200"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Icons */}
                        <div className="flex justify-center items-center space-x-2 sm:space-x-4 cursor-pointer">
                            <div
                                className="hidden lg:flex md:flex border border-[#B4B4B4] rounded-full p-2 hover:border-gray-400 transition-all duration-200 items-center space-x-2"
                                onClick={() => setSearchBar(!searchBar)}
                            >
                                <img
                                    src={searchImg}
                                    alt="search"
                                    width={16}
                                    height={16}
                                    className="opacity-80 hover:opacity-100 transition-opacity duration-200"
                                />
                            </div>

                            {/* Authentication-based Links */}
                            {isAuthenticated ? (
                                <div className="relative " ref={dropdownRef}>
                                    <img
                                        src={profileImg}
                                        alt="profile"
                                        width={40}
                                        height={40}
                                        className="mx-2 sm:mx-3 p-1 cursor-pointer rounded-full hover:ring-2 hover:ring-gray-400 transition-all duration-200"
                                        onClick={toggleDropdown}
                                        aria-expanded={isDropdownOpen}
                                        aria-haspopup="true"
                                    />
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-black border border-gray-700 rounded-lg shadow-xl z-50 transform transition-all duration-200 ease-in-out">
                                            <div className="py-2">
                                                <div className="px-4 py-3 border-b border-gray-900">
                                                    <p className="text-lg font-medium text-center text-white">
                                                        {user?.username ||
                                                            "User"}
                                                    </p>
                                                    <p className="text-sm pt-2 text-center text-gray-100 truncate">
                                                        {user?.email ||
                                                            "user@example.com"}
                                                    </p>
                                                </div>
                                                <Link
                                                    to="/profile"
                                                    className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 hover:text-white transition-all duration-150 flex items-center space-x-2"
                                                    onClick={closeDropdown}
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        ></path>
                                                    </svg>
                                                    <span>Profile</span>
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-200 cursor-pointer hover:bg-gray-800 hover:text-white transition-all duration-150 flex items-center space-x-2"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                        ></path>
                                                    </svg>
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden sm:flex items-center space-x-2 ">
                                    <Link
                                        to="/register"
                                        className="max-md:hidden max-lg:hidden mx-2 sm:mx-3 text-sm text-gray-700 bg-transparent border border-[#B4B4B4] px-4 py-2 rounded-3xl transition-all duration-200"
                                    >
                                        Sign up
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="text-sm text-black bg-yellow-500 hover:bg-yellow-400 px-4 sm:px-6 py-2 sm:py-3 rounded-3xl transition-all duration-200"
                                    >
                                        Login
                                    </Link>
                                </div>
                            )}

                            {/* Favorites Icon */}
                            <div
                                className="hidden  relative cursor-pointer lg:flex "
                                onClick={handleFavoritesClick}
                            >
                                <img
                                    src={favorite}
                                    alt="bag"
                                    width={24}
                                    height={24}
                                    className="mx-2 sm:mx-3 hover:opacity-80 transition-opacity duration-200"
                                />
                                {isAuthenticated && (
                                    <span className="absolute -top-2 -right-0 sm:-right-1 font-sans text-xs font-medium text-white bg-red-600 rounded-full px-2 py-0.5 shadow-md">
                                        {favoritesCount > 0
                                            ? favoritesCount
                                            : 0}
                                    </span>
                                )}
                            </div>

                            {/* Cart Icon */}
                            <div
                                className="relative cursor-pointer max-md:hidden "
                                onClick={handleCartClick}
                            >
                                <img
                                    src={bagImg}
                                    alt="bag"
                                    width={24}
                                    height={24}
                                    className="mx-2 sm:mx-3 hover:opacity-80 transition-opacity duration-200"
                                />
                                {isAuthenticated && (
                                    <span className="absolute -top-2 -right-0 sm:-right-1 font-sans text-xs font-medium text-white bg-red-600 rounded-full px-2 py-0.5 shadow-md">
                                        {cartItemCount > 0 ? cartItemCount : 0}
                                    </span>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <div
                                className="md:hidden mt-2 sm:mt-3"
                                onClick={toggleMenu}
                            >
                                <img
                                    src={isMenuOpen ? closeIcon : menuIcon}
                                    alt="menu"
                                    width={36}
                                    height={36}
                                    className={`border border-gray-600 rounded-full hover:bg-gray-700 p-2 mb-2 sm:mb-3 mx-2 sm:mx-3 transform transition-transform duration-300 ${
                                        isMenuOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </div>
                        </div>
                    </nav>
                </header>
            </div>

            {/* Mobile Menu */}
            <ul
                className={` left-0 top-16 w-full bg-main-100 z-[100] md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                    isMenuOpen
                        ? "max-h-screen translate-y-0 opacity-100"
                        : "max-h-0 -translate-y-4 opacity-0"
                }`}
            >
                <NavSearch />
                {navLists.map((item, i) => (
                    <li key={i} className="cursor-pointer" onClick={closeMenu}>
                        <div className="flex justify-between items-center px-4 py-3">
                            <Link
                                to={item.path}
                                className="text-base font-medium cursor-pointer text-gray-900 hover:text-yellow-500 transition-all duration-200"
                            >
                                {item.name}
                            </Link>
                            <div>
                                <img
                                    src={rightArrow}
                                    alt="arrow"
                                    width={28}
                                    height={28}
                                    className="mr-4 sm:mr-6 hover:translate-x-2 transition-transform duration-300 ease-in-out"
                                />
                            </div>
                        </div>
                        <hr className="border-[0.03px] border-gray-700 my-1 mx-4" />
                    </li>
                ))}
                {/* Mobile Authentication Links */}
                {isAuthenticated ? (
                    <>
                        <li className="cursor-pointer" onClick={closeMenu}>
                            <div className="flex justify-between items-center px-4 py-3">
                                <Link
                                    to="/profile"
                                    className="text-base font-medium cursor-pointer text-gray-200 hover:text-white transition-all duration-200"
                                >
                                    Profile
                                </Link>
                                <div>
                                    <img
                                        src={rightArrow}
                                        alt="arrow"
                                        width={28}
                                        height={28}
                                        className="mr-4 sm:mr-6 hover:translate-x-2 transition-transform duration-300 ease-in-out"
                                    />
                                </div>
                            </div>
                            <hr className="border-[0.03px] border-gray-700 my-1 mx-4" />
                        </li>
                        <li className="cursor-pointer" onClick={handleLogout}>
                            <div className="flex justify-between items-center px-4 py-3">
                                <span className="text-base font-medium cursor-pointer text-gray-200 hover:text-white transition-all duration-200">
                                    Logout
                                </span>
                                <div>
                                    <img
                                        src={rightArrow}
                                        alt="arrow"
                                        width={28}
                                        height={28}
                                        className="mr-4 sm:mr-6 hover:translate-x-2 transition-transform duration-300 ease-in-out"
                                    />
                                </div>
                            </div>
                            <hr className="border-[0.03px] border-gray-700 my-1 mx-4" />
                        </li>
                    </>
                ) : (
                    <>
                        <li className="cursor-pointer" onClick={closeMenu}>
                            <div className="flex justify-between items-center px-4 py-3">
                                <Link
                                    to="/login"
                                    className="text-base font-medium cursor-pointer text-black hover:text-gray-100 transition-all duration-200"
                                >
                                    Login
                                </Link>
                                <div>
                                    <img
                                        src={rightArrow}
                                        alt="arrow"
                                        width={28}
                                        height={28}
                                        className="mr-4 sm:mr-6 hover:translate-x-2 transition-transform duration-300 ease-in-out"
                                    />
                                </div>
                            </div>
                            <hr className="border-[0.03px] border-gray-700 my-1 mx-4" />
                        </li>
                        <li className="cursor-pointer" onClick={closeMenu}>
                            <div className="flex justify-between items-center px-4 py-3">
                                <Link
                                    to="/register"
                                    className="text-base font-medium cursor-pointer text-black hover:text-gray-100 transition-all duration-200"
                                >
                                    Register
                                </Link>
                                <div>
                                    <img
                                        src={rightArrow}
                                        alt="arrow"
                                        width={28}
                                        height={28}
                                        className="mr-4 sm:mr-6 hover:translate-x-2 transition-transform duration-300 ease-in-out"
                                    />
                                </div>
                            </div>
                            <hr className="border-[0.03px] border-gray-700 my-1 mx-4" />
                        </li>
                    </>
                )}
                {/* Mobile Favorites Link */}
                <li className="cursor-pointer" onClick={handleFavoritesClick}>
                    <div className="flex justify-between items-center px-4 py-3">
                        <span className="text-base font-medium cursor-pointer text-black hover:text-gray-100 transition-all duration-200">
                            Favorites{" "}
                            {isAuthenticated ? `(${favoritesCount})` : ""}
                        </span>
                        <div>
                            <img
                                src={rightArrow}
                                alt="arrow"
                                width={28}
                                height={28}
                                className="mr-4 sm:mr-6 hover:translate-x-2 transition-transform duration-300 ease-in-out"
                            />
                        </div>
                    </div>
                    <hr className="border-[0.03px] border-gray-700 my-1 mx-4" />
                </li>
                {/* Mobile Cart Link */}
                <li className="cursor-pointer" onClick={handleCartClick}>
                    <div className="flex justify-between items-center px-4 py-3">
                        <span className="text-base font-medium cursor-pointer text-black hover:text-gray-100 transition-all duration-200">
                            Cart {isAuthenticated ? `(${cartItemCount})` : ""}
                        </span>
                        <div>
                            <img
                                src={rightArrow}
                                alt="arrow"
                                width={28}
                                height={28}
                                className="mr-4 sm:mr-6 hover:translate-x-2 transition-transform duration-300 ease-in-out"
                            />
                        </div>
                    </div>
                    <hr className="border-[0.03px] border-gray-700 my-1 mx-4" />
                </li>
            </ul>

            {/* Search Bar Overlay */}
            {searchBar && <NavSearch setSearchBar={setSearchBar} />}
        </>
    );
};

export default NavBar;
