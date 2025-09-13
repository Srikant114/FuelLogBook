import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import { useThemeContext } from '../../context/ThemeContext'
import TitleUser from '../common/TitleUser'
import { faqsData } from '../../data/faqsData'
import { colorSplash, colorSplashLight } from '../../assets'

const FAQSection = () => {
  const { theme } = useThemeContext()
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="relative max-w-2xl mx-auto flex flex-col items-center justify-center px-4 md:px-0">
      <img
        className="absolute -mb-120 -left-40 -z-10 pointer-events-none"
        src={theme === "dark" ? colorSplash : colorSplashLight}
        alt="color-splash"
        width={1000}
        height={1000}
        priority
        fetchPriority="high"
      />

      <TitleUser
        heading="FAQ's"
        title="Frequently asked questions"
        description="Track fuel expenses, calculate mileage, and generate cost reports — all in one simple dashboard."
      />

      <div className="mt-8">
        {faqsData.map((faq, index) => (
          <div
            className="border-b border-slate-300 dark:border-[var(--color-primary-dark)] py-4 cursor-pointer w-full"
            key={index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">{faq.question}</h3>
              <ChevronDown
                size={18}
                className={`${openIndex === index && "rotate-180"} transition-all duration-500 ease-in-out`}
                style={{ color: openIndex === index ? "var(--color-primary)" : "inherit" }}
              />
            </div>
            <p
              className={`text-sm text-slate-600 dark:text-slate-300 transition-all duration-500 ease-in-out max-w-xl ${
                openIndex === index
                  ? "opacity-100 max-h-[500px] translate-y-0 pt-4"
                  : "opacity-0 max-h-0 overflow-hidden -translate-y-2"
              }`}
            >
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
      
    </div>
  )
}

export default FAQSection
