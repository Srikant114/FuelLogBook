import { CheckIcon } from "lucide-react";

export const pricingData = [
  {
    title: "Starter Plan",
    price: 299,
    features: [
      { name: "Log up to 50 fuel entries", icon: CheckIcon },
      { name: "View basic mileage report", icon: CheckIcon },
      { name: "Monthly cost summary", icon: CheckIcon },
      { name: "Community support", icon: CheckIcon },
    ],
    buttonText: "Get Started",
  },
  {
    title: "Pro Plan",
    price: 799,
    mostPopular: true,
    features: [
      { name: "Unlimited fuel entries", icon: CheckIcon },
      { name: "Detailed mileage analytics", icon: CheckIcon },
      { name: "Cost & expenditure reports", icon: CheckIcon },
      { name: "Vehicle-wise tracking", icon: CheckIcon },
      { name: "Priority support", icon: CheckIcon },
    ],
    buttonText: "Upgrade Now",
  },
  {
    title: "Enterprise Plan",
    price: 1499,
    features: [
      { name: "Multiple vehicles management", icon: CheckIcon },
      { name: "Advanced analytics & charts", icon: CheckIcon },
      { name: "Team access & collaboration", icon: CheckIcon },
      { name: "Custom integrations", icon: CheckIcon },
      { name: "Dedicated support", icon: CheckIcon },
    ],
    buttonText: "Contact Sales",
  },
];
