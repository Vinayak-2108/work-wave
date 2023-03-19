import MenuOutlined from "@mui/icons-material/Menu";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logopic from "../assets/logo.png";
import MenuItems from "./MenuItems";
import "../styles/navbar.css";
const Header = () => {
    const [active, setActive] = useState(true);
    const [navbar, setNavbar] = useState(false);

    // navToggle.addEventListener("click", () => {

    // });
    const handleToggle = () => {
      setActive(!active);
    };

    const navigate = useNavigate();

    // const changeBackground = () => {
    //     if (window.scrollY >= 80) {
    //         setNavbar(true);
    //     } else setNavbar(false);
    // };
    // window.addEventListener("scroll", changeBackground);

    return (
        <header>
            <div class="container row">
                <button
                    onClick={handleToggle}
                    class="nav-toggle"
                    aria-label="open navigation"
                >
                    <span class="hamburger"></span>
                </button>
                <a class="logo" href="#">
                    <img src={logopic} />
                </a>
                <nav className={active ? "nav" : "nav--visible"}>
                    <ul class="nav__list nav__list--primary">
                        <li class="nav__item">
                            <Link to="/" class="nav__link">
                                Home
                            </Link>
                        </li>
                        <li class="nav__item">
                            <Link to="/about" class="nav__link">
                                About
                            </Link>
                        </li>
                        <li class="nav__item">
                            <Link to="/services" class="nav__link">
                                Services
                            </Link>
                        </li>
                        <li class="nav__item">
                            <Link to="/privacy" class="nav__link">
                                Terms
                            </Link>
                        </li>
                    {localStorage.getItem("user_token") ||
                    localStorage.getItem("admin_token") ? (
                        localStorage.getItem("user_token") ? (
                            <>
                                <li className="nav__item">
                                    <button
                                        className="uppercase nav__link"
                                        onClick={() => {
                                            navigate("/userdashboard");
                                        }}
                                    >
                                        Dashboard
                                    </button>
                                </li>
                                <li class="nav__item">
                                    <button
                                        className="uppercase nav__link"
                                        onClick={() => {
                                            localStorage.removeItem(
                                                "user_token"
                                            );
                                            navigate("/");
                                            window.location.reload();
                                        }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li class="nav__item">
                                    <div
                                        className="uppercase nav__link"
                                        onClick={() => {
                                            navigate("/admindashboard");
                                        }}
                                    >
                                        Dashboard
                                    </div>
                                </li>
                                <li class="nav__item">
                                    <div
                                        className="uppercase nav__link"
                                        onClick={() => {
                                            localStorage.removeItem(
                                                "admin_token"
                                            );
                                            navigate("/");
                                            window.location.reload();
                                        }}
                                    >
                                        Logout
                                    </div>
                                </li>
                            </>
                        )
                    ) : (
                        <li class="nav__item">
                            <Link to="/signup" class="nav__link nav__link--button">Signup</Link>
                        </li>
                    )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
