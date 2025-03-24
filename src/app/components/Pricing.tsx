import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Basic",
    price: "$9",
    features: [
      "5 team members",
      "10 projects",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    features: [
      "Unlimited team members",
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Custom features",
      "Dedicated account manager",
      "On-premise deployment",
      "24/7 phone support",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-gray-50 py-20">
      <div className="container mx-auto">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div key={index} className="rounded-lg bg-white p-8 shadow-md">
              <h3 className="mb-4 text-2xl font-bold">{plan.name}</h3>
              <p className="mb-6 text-4xl font-bold">
                {plan.price}
                <span className="text-lg font-normal text-gray-600">
                  /month
                </span>
              </p>
              <ul className="mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="mb-2 flex items-center">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={index === 1 ? "default" : "outline"}
              >
                {index === 2 ? "Contact Sales" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
