"use client";
import React, { useState } from "react";
import MiniNavbar from "./MiniNavBar";
import ToggleButton from "./ToggleButton";
const Navbar = ({ active }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="w-full dark:bg-black lg:h-20 flex flex-wrap items-center justify-between lg:justify-between mt-0 py-4">
        <div className="px-0 lg:pl-4 flex items-center lg:mx-4 cursor-pointer text-primary dark:text-primary-dark text-md md:text-xl font-bold mx-3">
          <a href="/">
            <span>
              <b className="font-bold"></b> Raj. Govt. Exam PYQ
            </span>
          </a>
        </div>
        <ToggleButton />
        <div className="flex items-center mx-8 lg:hidden">
          <div className="text-primary dark:text-primary-dark text-md font-semibold">
            Menu
          </div>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 1024 1024"
            className="text-primary dark:text-primary-dark mt-1"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            onClick={toggleMenu}
          >
            <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
          </svg>
        </div>
        <div
          className={`w-full flex-grow lg:flex lg:flex-1 lg:content-center lg:justify-center lg:w-auto h-0 lg:h-auto overflow-hidden mt-2 lg:mt-0 z-20 transition-all ${isMenuOpen ? "h-auto" : ""
            }`}
          id="nav-content"
        >
          <ul className="flex items-center flex-col lg:flex-row">
            <li
              key="Home"
              className={` ${active == "Home" ? "font-bold" : ""
                } mx-2 my-2 text-primary dark:text-primary-dark hover:border-b-2 hover:border-purple-700 `}
            >
              <a href="/">Home</a>
            </li>
            <li
              key="OldPaper"
              className={` ${active == "Old Paper" ? "font-bold" : ""
                } mx-2 my-2 text-primary dark:text-primary-dark hover:border-b-2 hover:border-purple-700 `}
            >
              <a href="/OldPaper">Old Papers</a>
            </li>
            <li
              key="Contact"
              className={` ${active == "Contact" ? "font-bold" : ""
                } mx-2 my-2 text-primary dark:text-primary-dark hover:border-b-2 hover:border-purple-700 `}
            >
              <a href="/Contact">Contact</a>
            </li>
          </ul>
          <div></div>
        </div>
      </div>
      {/* <MiniNavbar /> */}
      <hr className=" border-0 border-b-2 border-primary/[0.5] dark:border-primary-dark/[0.5] "></hr>

    </>
  );
};

export default Navbar;
