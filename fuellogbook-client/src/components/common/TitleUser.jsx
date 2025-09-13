import React from 'react'

const TitleUser = ({ heading, title, description }) => {
  return (
    <>
      {/* Heading Badge */}
      <p className="text-center font-medium text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mt-20 sm:mt-24 px-4 sm:px-6 md:px-10 py-1.5 sm:py-2 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 w-max mx-auto text-sm sm:text-base md:text-[1rem]">
        {heading}
      </p>

      {/* Title */}
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mx-auto mt-3 sm:mt-4 leading-snug md:leading-tight px-2 sm:px-0">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 text-center mt-2 max-w-full sm:max-w-md md:max-w-lg mx-auto px-2 sm:px-0">
        {description}
      </p>
    </>
  )
}

export default TitleUser
