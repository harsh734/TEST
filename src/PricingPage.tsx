import { useState, useEffect } from "react";
import { Check, Tag, ArrowRight, CheckCircle2 } from "lucide-react";

type CycleId = "monthly" | "quarterly" | "yearly";

type CycleOption = {
  id: CycleId;
  label: string;
  save: string | null;
};

type SlidingToggleProps = {
  options: CycleOption[];
  value: CycleId;
  onChange: (value: CycleId) => void;
};

const CYCLES: CycleOption[] = [
  { id: "monthly", label: "Monthly", save: null },
  { id: "quarterly", label: "Quarterly", save: "Save 8%" },
  { id: "yearly", label: "Yearly", save: "Save 16%" },
];

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For beginners",
    price: { monthly: 5, quarterly: 5, yearly: 5 },
    features: [
      "Up to 10 products",
      "70+ site templates",
      "Free company.site domain",
      "Email support",
    ],
  },
  {
    id: "venture",
    name: "Venture",
    tagline: "For solo visionaries",
    popular: true,
    price: { monthly: 35, quarterly: 32, yearly: 29 },
    features: [
      "Up to 100 products + e-goods",
      "Sell on Instagram & Facebook",
      "Mobile store management app",
      "Live chat support",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "For small but mighty teams",
    price: { monthly: 65, quarterly: 57, yearly: 49 },
    features: [
      "Up to 2,500 products",
      "Sell on marketplaces",
      "Sell subscriptions",
      "Phone support",
    ],
  },
  {
    id: "unlimited",
    name: "Unlimited",
    tagline: "For businesses focused on growth",
    price: { monthly: 149, quarterly: 134, yearly: 119 },
    features: [
      "Unlimited products",
      "In-person POS integration",
      "Unlimited staff accounts",
      "Priority support",
    ],
  },
];

const CYCLE_CAPTION: Record<CycleId, string> = {
  monthly: "billed monthly",
  quarterly: "billed every 3 months",
  yearly: "billed annually",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SlidingToggle({ options, value, onChange }: SlidingToggleProps) {
  const pillPosition =
    value === "monthly"
      ? "translate-x-0"
      : value === "quarterly"
      ? "translate-x-full"
      : "translate-x-[200%]";

  return (
    <div className="relative flex w-full max-w-sm items-center overflow-hidden rounded-full border border-[#e0ddf0] bg-[#f0eef8] p-1">
      <span
        className={`absolute inset-y-1 left-1 w-1/3 rounded-full bg-[linear-gradient(135deg,#c8b8f0_0%,#f0b8d8_100%)] transition-transform duration-300 ease-out ${pillPosition}`}
      />
      {options.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`relative z-10 flex-1 rounded-full px-3 py-2 text-center font-sans text-xs font-semibold whitespace-nowrap transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 sm:px-5 sm:text-sm ${
            value === c.id ? "text-[#2d1a5e]" : "text-[#777]"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

export default function PricingPage() {
  const [cycle, setCycle] = useState<CycleId>("monthly");
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [scrolled, setScrolled] = useState(false);
  const activeCycle = CYCLES.find((c) => c.id === cycle);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCheckbox = (planId: string) => {
    setChecked((prev) => {
      const next = { ...prev, [planId]: !prev[planId] };
      // Clear email/error when unchecking
      if (!next[planId]) {
        setEmails((e) => ({ ...e, [planId]: "" }));
        setErrors((er) => ({ ...er, [planId]: null }));
      }
      return next;
    });
  };

  const handleEmailChange = (planId: string, value: string) => {
    setEmails((prev) => ({ ...prev, [planId]: value }));
    if (errors[planId]) setErrors((prev) => ({ ...prev, [planId]: null }));
  };

  const handleClaim = (planId: string) => {
    const value = emails[planId] || "";
    if (!EMAIL_RE.test(value)) {
      setErrors((prev) => ({ ...prev, [planId]: "Enter a valid email to continue" }));
      return;
    }
    setErrors((prev) => ({ ...prev, [planId]: null }));
    setSelectedPlan(planId);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#e8eaf6_0%,#f3e8f5_40%,#fce8e8_100%)]">
      {/* Top Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${
          scrolled ? "border-[#e0ddf0] bg-white/95" : "border-transparent bg-white/50"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div className="font-serif text-xl font-semibold text-[#241742] sm:text-2xl">
            Logo
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <button className="font-sans text-xs font-medium text-[#5c3eaf] transition-colors hover:text-[#241742] sm:text-sm">
              Resources
            </button>
            <button className="font-sans text-xs font-medium text-[#5c3eaf] transition-colors hover:text-[#241742] sm:text-sm">
              Pricing
            </button>
            <button className="font-sans text-xs font-medium text-[#5c3eaf] transition-colors hover:text-[#241742] sm:text-sm">
              Login
            </button>
          </div>
        </div>
      </nav>

      <div className="px-4 py-16 pt-32 sm:px-6 sm:py-20 sm:pt-24">
        <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#7f6bb3]">
            Pricing
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#241742] sm:text-5xl">
            Pick the plan that <em className="italic">fits</em> where you're selling
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-sans text-sm text-[#6f6382] sm:text-base">
            Every plan includes hosting, security, and zero transaction fees.
            Switch cycles or cancel anytime.
          </p>
        </div>

        {/* Billing cycle toggle */}
        <div className="mt-10 flex flex-col items-center gap-3 px-0">
          <SlidingToggle options={CYCLES} value={cycle} onChange={setCycle} />
          <div className="h-5">
            {activeCycle?.save && (
              <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-[#b57824]">
                <Tag size={13} strokeWidth={2.5} />
                {activeCycle.save} vs monthly
              </span>
            )}
          </div>
        </div>

        {/* Plan cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {PLANS.map((plan) => {
            const isConfirmed = selectedPlan === plan.id;
            const isPlanChecked = !!checked[plan.id];
            const price = plan.price[cycle];
            const showSavings = cycle !== "monthly" && plan.price.monthly !== price;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 bg-white/90 p-5 shadow-[0_14px_38px_rgba(93,64,151,0.10)] backdrop-blur transition-all duration-300 motion-reduce:transition-none sm:p-6 ${
                  isConfirmed
                    ? "scale-[1.03] border-[#9b7fe0] shadow-[0_22px_55px_rgba(111,80,190,0.22)] ring-4 ring-[#c8b8f0]/30"
                    : isPlanChecked
                    ? "border-[#c8b8f0] shadow-[0_18px_44px_rgba(111,80,190,0.16)]"
                    : "border-[#e0ddf0] hover:border-[#c8b8f0] hover:shadow-[0_18px_44px_rgba(111,80,190,0.14)]"
                }`}
              >
                {/* Selected stamp */}
                {isConfirmed && (
                  <div className="absolute -right-3 -top-3 rotate-[-8deg] rounded-sm border-2 border-dashed border-[#e05a83] bg-white px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-[#e05a83] shadow-sm">
                    Selected ✓
                  </div>
                )}

                {/* Most popular badge */}
                {/* {plan.popular && !isConfirmed && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E2A33B] px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-[#1A2118]">
                    Most popular
                  </div>
                )} */}

                <h3 className="font-serif text-xl font-semibold text-[#241742] sm:text-2xl">
                  {plan.name}
                </h3>
                <p className="mt-1 font-sans text-sm text-[#7a718a]">{plan.tagline}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-mono text-xl font-bold text-[#241742] sm:text-2xl">$</span>
                  <span className="font-mono text-3xl font-bold text-[#241742] sm:text-4xl">
                    {price}
                  </span>
                  <span className="font-sans text-sm text-[#7a718a]">/mo</span>
                </div>
                <p className="mt-1 font-sans text-xs text-[#7a718a]">
                  {CYCLE_CAPTION[cycle]}
                  {showSavings && (
                    <span className="ml-2 font-semibold text-[#b57824]">
                      vs ${plan.price.monthly}/mo
                    </span>
                  )}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-sans text-xs text-[#3d3154] sm:text-sm">
                      <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#8a6ed8]" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Bottom section — no divider */}
                <div className="mt-6">
                  {isConfirmed ? (
                    <div className="flex items-start gap-2 rounded-lg bg-[#f0eef8] p-3 font-sans text-sm text-[#5c3eaf]">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                      <span>
                        You opted for this pack
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Checkbox */}
                      <label className="flex cursor-pointer items-center gap-2.5 select-none">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={isPlanChecked}
                            onChange={() => handleCheckbox(plan.id)}
                            className="peer sr-only"
                          />
                          <div
                            className={`h-5 w-5 rounded-md border-2 transition-colors duration-200 flex items-center justify-center ${
                              isPlanChecked
                                ? "border-[#9b7fe0] bg-[#9b7fe0]"
                                : "border-[#d5d0e8] bg-white"
                            }`}
                          >
                            {isPlanChecked && (
                              <Check size={12} strokeWidth={3} className="text-white" />
                            )}
                          </div>
                        </div>
                        <span className="font-sans text-sm font-medium text-[#3d3154]">
                          I'm selecting this plan
                        </span>
                      </label>

                      {/* Email + claim — only shown when checked */}
                      {isPlanChecked && (
                        <div className="space-y-2">
                          <input
                            type="email"
                            inputMode="email"
                            placeholder="you@business.com"
                            value={emails[plan.id] || ""}
                            onChange={(e) => handleEmailChange(plan.id, e.target.value)}
                            className="w-full rounded-lg border-2 border-[#e0ddf0] bg-white px-3 py-2 font-sans text-sm text-[#241742] placeholder:text-[#aaa1bd] focus:outline-none focus-visible:border-[#9b7fe0] focus-visible:ring-2 focus-visible:ring-[#c8b8f0]"
                          />
                          {errors[plan.id] && (
                            <p className="font-sans text-xs font-medium text-[#d94f73]">
                              {errors[plan.id]}
                            </p>
                          )}
                          <button
                            onClick={() => handleClaim(plan.id)}
                            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#9b7fe0] px-4 py-2.5 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8b8f0] focus-visible:ring-offset-2"
                          >
                            Claim plan
                            <ArrowRight size={15} strokeWidth={2.5} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center font-sans text-xs text-[#7a718a]">
          Demo pricing for illustration purposes — see ecwid.com/pricing for current rates.
        </p>
        </div>
      </div>
    </div>
  );
}
