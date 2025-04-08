import React from "react";

import { Heart } from "lucide-react";
import PackageCard from "@/components/about/PackageCard";

const packages = [
  {
    title: "Paws of Honour",
    price: "$300",
    description: "Perfect for couples with one furry friend",
    popular: false,
    features: [
      { text: "2-hour pet service during ceremony", included: true },
      { text: "Professional pet handler", included: true },
      { text: "Wedding photo session with pet", included: true },
      { text: "Pet bow tie/flower crown", included: true },
      { text: "Wedding day pet transport", included: false },
      { text: "Pet boarding", included: false },
    ],
  },
  {
    title: "All Paws In",
    price: "$500",
    description: "Ideal for couples with multiple pets",
    popular: true,
    features: [
      { text: "8-hour comprehensive pet care", included: true },
      { text: "Professional pet handler", included: true },
      { text: "Wedding photo session with pets", included: true },
      { text: "Pet bow tie/flower crown", included: true },
      { text: "Wedding day pet transport", included: true },
      { text: "Pet boarding", included: false },
    ],
  },
  {
    title: "Royal Treatment",
    price: "$599",
    description: "The ultimate pet wedding experience",
    popular: false,
    features: [
      { text: "8-hour comprehensive pet care", included: true },
      { text: "Professional pet handler", included: true },
      { text: "Wedding photo session with pets", included: true },
      { text: "Pet bow tie/flower crown", included: true },
      { text: "Wedding day pet transport", included: true },
      { text: "pet boarding", included: true },
    ],
  },
  {
    title: "Pet Boarding",
    price: "$200",
    description: "The ultimate pet slumber after their big day",
    popular: false,
    features: [
      { text: "8-hour comprehensive pet care", included: true },
      { text: "Professional pet handler", included: true },
      { text: "Wedding photo session with pets", included: true },
      { text: "Pet bow tie/flower crown", included: true },
      { text: "Wedding day pet transport", included: true },
      { text: "pet boarding", included: true },
    ],
  },
];

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-blush py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-rose-400" fill="currentColor" />
            <h2 className="text-4xl font-serif tracking-tight text-gray-900">
              Pawfect Wedding Day
            </h2>
            <Heart className="h-8 w-8 text-rose-400" fill="currentColor" />
          </div>
          <p className="mt-4 text-lg text-gray-600 font-light">
            Let us take care of your beloved pets while you say "I do"
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg, index) => (
            <PackageCard
              key={index}
              title={pkg.title}
              price={pkg.price}
              description={pkg.description}
              features={pkg.features}
              popular={pkg.popular}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
