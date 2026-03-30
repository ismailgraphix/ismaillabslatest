"use client";
import { useState } from "react";

const plans = [
  {
    name: "Basic Plan",
    priceMonthly: 39,
    priceYearly: 29,
    desc: "Basic features for up to 10 Users",
    features: ["5 Projects", "10 GB Storage", "Basic Analytics", "Email Support", "API Access"],
    popular: false,
  },
  {
    name: "Standard Plan",
    priceMonthly: 49,
    priceYearly: 39,
    desc: "Best for growing teams",
    features: ["15 Projects", "50 GB Storage", "Advanced Analytics", "Priority Support", "API Access", "Custom Domain"],
    popular: true,
  },
  {
    name: "Premium Plan",
    priceMonthly: 59,
    priceYearly: 49,
    desc: "Enterprise-grade for large teams",
    features: ["Unlimited Projects", "500 GB Storage", "Full Analytics Suite", "24/7 Support", "API Access", "Custom Domain", "White Label"],
    popular: false,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#4A6CF7]/10 rounded-full px-4 py-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7]" />
            <span className="font-heading font-semibold text-sm text-[#4A6CF7] uppercase tracking-widest">Pricing Plans</span>
          </div>
          <h2 className="font-heading font-black text-[clamp(2rem,4vw,3.5rem)] leading-tight text-[#0A0A0A] mb-8">
            Our Flexible Pricing
          </h2>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-[#F7F5F0] rounded-full p-1.5">
            <button
              onClick={() => setYearly(false)}
              className={`font-heading font-semibold text-sm px-5 py-2 rounded-full transition-all ${!yearly ? "bg-white text-[#0A0A0A] shadow-sm" : "text-gray-500"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`font-heading font-semibold text-sm px-5 py-2 rounded-full transition-all flex items-center gap-2 ${yearly ? "bg-white text-[#0A0A0A] shadow-sm" : "text-gray-500"}`}
            >
              Yearly
              <span className="bg-[#4A6CF7] text-white text-xs px-2 py-0.5 rounded-full">-30%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 border-2 transition-all duration-300 ${
                plan.popular
                  ? "bg-[#0A0A0A] border-[#0A0A0A] scale-105 shadow-2xl"
                  : "bg-white border-gray-100 hover:border-[#4A6CF7]/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4A6CF7] text-white font-heading font-bold text-xs px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <p className={`font-heading font-bold text-sm uppercase tracking-wider mb-2 ${plan.popular ? "text-[#4A6CF7]" : "text-gray-500"}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1">
                  <span className={`font-heading font-black text-6xl ${plan.popular ? "text-white" : "text-[#0A0A0A]"}`}>
                    ${yearly ? plan.priceYearly : plan.priceMonthly}
                  </span>
                  <span className={`font-body text-sm mb-3 ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>/mo</span>
                </div>
                <p className={`font-body text-sm ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>{plan.desc}</p>
              </div>

              <div className={`w-full h-px mb-6 ${plan.popular ? "bg-white/10" : "bg-gray-100"}`} />

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? "bg-[#4A6CF7]" : "bg-[#0A0A0A]"}`}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className={`font-body text-sm ${plan.popular ? "text-gray-300" : "text-gray-600"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block w-full text-center font-heading font-bold py-3.5 rounded-full transition-all duration-300 ${
                  plan.popular
                    ? "bg-[#4A6CF7] text-white hover:bg-white hover:text-[#0A0A0A]"
                    : "bg-[#0A0A0A] text-white hover:bg-[#4A6CF7]"
                }`}
              >
                Get in Touch
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
