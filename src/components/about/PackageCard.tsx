import React from "react";
import { Check, Heart } from "lucide-react";
import Link from "next/link";

interface PackageFeature {
  text: string;
  included: boolean;
}

interface PackageCardProps {
  title: string;
  price: string;
  description: string;
  features: PackageFeature[];
  popular?: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({
  title,
  price,
  description,
  features,
  popular = false,
}) => {
  return (
    <div
      className={`relative rounded-2xl border p-8 shadow-lg backdrop-blur-sm
        ${
          popular
            ? "border-rose-200 bg-white/80"
            : "border-gray-100 bg-white/60"
        }`}
    >
      {popular && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-rose-400 px-4 py-1 text-sm font-medium text-white flex items-center gap-1">
          <Heart className="h-3 w-3" fill="currentColor" />
          <span>Most Popular</span>
          <Heart className="h-3 w-3" fill="currentColor" />
        </div>
      )}
      <div className="mb-5 text-center">
        <h3 className="text-2xl font-serif text-gray-900">{title}</h3>
        <p className="mt-2 text-base text-gray-600 font-light">{description}</p>
      </div>
      <div className="mb-5 text-center">
        <span className="text-sm text-gray-500">starting at: </span>
        <span className="text-4xl font-serif text-gray-900">{price}</span>
      </div>
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <Check
              className={`h-5 w-5 ${
                feature.included ? "text-rose-400" : "text-gray-300"
              }`}
            />
            <span
              className={`${
                feature.included ? "text-gray-700" : "text-gray-400"
              } font-light`}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      <Link href="/myinquiry/request">
        <button
          className={`mt-8 w-full rounded-lg px-4 py-3 text-center text-sm font-medium transition-all
          ${
            popular
              ? "bg-rose-400 text-white hover:bg-rose-500"
              : "bg-rose-50 text-rose-600 hover:bg-rose-100"
          }`}
        >
          Submit an Inquiry
        </button>
      </Link>
    </div>
  );
};

export default PackageCard;
