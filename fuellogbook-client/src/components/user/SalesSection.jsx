import React from 'react'
import TitleUser from '../common/TitleUser'

const SalesSection = () => {
  return (
    <div className="flex flex-col items-center text-center justify-center mt-20">
                <TitleUser heading="Get Started" title="Track Your Fuel & Mileage Smarter" description="Join drivers who log their fuel, monitor mileage, and view detailed reports to save money and stay in control of their vehicles."/>
                <div className="flex items-center gap-4 mt-8">
                    <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition text-white rounded-md px-6 h-11">
                        Start free trial
                    </button>
                    <button className="border border-[var(--color-primary-dark)] transition text-slate-600 dark:text-white rounded-md px-6 h-11">
                        Enroll Now
                    </button>
                </div>
            </div>
  )
}

export default SalesSection