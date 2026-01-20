import React from 'react';

const MiniNavbar = () => {
  return (
    <>
    <hr className=" border-0 border-b-2 border-primary/[0.5] dark:border-primary-dark/[0.5] "></hr>
    <div className='overflow-x-auto scrollbar-hide w-full z-10 sticky bg-white dark:bg-black top-0  shadow-md dark:bg-gray-800 dark:border-black'>
    <div className="max-h-[6vh] min-h-[40px] flex  items-center justify-center ml-3 mr-3 md:ml-10 md:mr-10">
    <ul className="space-x-7 text-primary font-semibold flex items-center overflow-x-auto whitespace-nowrap px-4 no-scrollbar">
        <li className="cursor-pointer hover:border-b-2 hover:border-primary  dark:hover:border-primary-dark active:border-b-4 dark:text-primary-dark">
          <a href="/tutorial/docker/">Docker</a>
        </li>
        <li className="cursor-pointer hover:border-b-2 hover:border-primary  dark:hover:border-primary-dark active:border-b-4 dark:text-primary-dark">
          <a href="/tutorial/next/">Next</a>
        </li>
        <li className="cursor-pointer hover:border-b-2 hover:border-primary  dark:hover:border-primary-dark active:border-b-4 dark:text-primary-dark">
          <a href="/tutorial/redux_toolkit_next/">Redux Toolkit</a>
        </li>
        <li className="cursor-pointer hover:border-b-2 hover:border-primary  dark:hover:border-primary-dark active:border-b-4 dark:text-primary-dark">
          <a href="/tutorial/Vim/">Vim</a>
        </li>
         <li className="cursor-pointer hover:border-b-2 hover:border-primary  dark:hover:border-primary-dark active:border-b-4 dark:text-primary-dark">
          <a href="/tutorial/Maptiler/">MapTiler</a>
        </li>
        <li className="cursor-pointer hover:border-b-2 hover:border-primary  dark:hover:border-primary-dark active:border-b-4 dark:text-primary-dark">
          <a href="/tutorial/telebot/">Telegram Bot(Python)</a>
        </li>
        
        <li className="cursor-pointer hover:border-b-2 hover:border-primary  dark:hover:border-primary-dark active:border-b-4 dark:text-primary-dark">
          <a href="/tutorial/apionly/">Rails Api App</a>
        </li>
        <li className="cursor-pointer hover:border-b-2 hover:border-primary  dark:hover:border-primary-dark active:border-b-4 dark:text-primary-dark">
          <a href="/tutorial/expo/">Expo</a>
        </li>
        <li className="cursor-pointer hover:border-b-2 hover:border-primary  dark:hover:border-primary-dark active:border-b-4 dark:text-primary-dark">
          <a href="/tutorial/prisma/">Prisma</a>
        </li>
         {/*
        <li className="cursor-pointer hover:border-b-2 hover:border-primary  dark:hover:border-primary-dark active:border-b-4 dark:text-primary-dark">
          <a href="/tutorial/react-home/">REACT JS</a>
        </li> */}
      </ul>
    </div>
    </div>
    </>
  );
};

export default MiniNavbar;
