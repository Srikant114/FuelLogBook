import React from 'react'

const TitleUser = ({heading, title, description }) => {
  return (
    <>
    <p className="text-center font-medium text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mt-28 px-10 py-2 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 w-max mx-auto">
        {heading}
      </p>

      <h3 className="text-3xl font-semibold text-center mx-auto mt-4">
        {title}
      </h3>

      <p className="text-slate-600 dark:text-slate-300 text-center mt-2 max-w-lg mx-auto">
        {description}
      </p>
    </>
    
  )
}

export default TitleUser