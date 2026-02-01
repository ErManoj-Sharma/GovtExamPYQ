import React from "react";

function Chip({ name, selected, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
                text-xs font-medium px-3 py-1 rounded-full border
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-dark-400

                ${selected
                    ? `
                        bg-primary-600 text-white border-primary-600 dark:border-primary-dark-600
                        dark:bg-primary-dark-500 dark:text-white dark:border-primary-dark-500
                      `
                    : `
                        bg-primary-200 text-black border-primary-200
                        hover:bg-primary-300
                        dark:bg-primary-dark-200 dark:text-primary-dark dark:border-primary-dark-200
                        dark:hover:bg-primary-dark-300
                      `
                }
            `}
        >
            {name}
        </button>
    );
}

export default Chip;
