import React from "react";

/**
 * ConfirmDelete
 */
export default function ConfirmDelete({ openItemName, onCancel, onConfirm }) {
  return (
    <div className="flex flex-col items-center bg-theme dark:bg-theme-dark shadow-md rounded-xl py-6 px-5 box-border max-w-[460px] w-full border border-gray-200 dark:border-slate-700/40 text-theme dark:text-white transition-colors">
      <div className="flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75"
            stroke="#DC2626"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="font-semibold mt-4 text-xl text-theme dark:text-white">
        Are you sure?
      </h2>

      <p className="text-sm mt-2 text-center text-theme-light dark:text-slate-300">
        Do you really want to delete 
        <strong className="text-primary">  {openItemName}</strong> ? This action
        cannot be undone.
      </p>

      <div className="flex items-center justify-center gap-4 mt-5 w-full">
        <button
          type="button"
          onClick={onCancel}
          className="w-full md:w-36 h-10 rounded-md border border-gray-300 dark:border-slate-700/60 bg-white dark:bg-transparent text-gray-700 dark:text-slate-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="w-full md:w-36 h-10 rounded-md !text-white !bg-red-600 font-medium text-sm hover:!bg-red-700 active:scale-95 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
