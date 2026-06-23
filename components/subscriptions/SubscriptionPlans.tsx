import Link from "next/link";
import { cn } from "@/lib/cn";
import { buttonStyles } from "@/components/ui/Button";
import { CheckIcon, ChevronLeftIcon } from "@/components/ui/icons";

interface Plan {
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Basic",
    price: "$6.99",
    period: "/mo",
    tagline: "Casual viewing, anytime.",
    features: ["HD (720p) streaming", "Watch on 1 device", "Mobile & tablet", "Cancel anytime"],
    cta: "Choose Basic",
  },
  {
    name: "Standard",
    price: "$12.99",
    period: "/mo",
    tagline: "The sweet spot for most.",
    features: [
      "Full HD (1080p)",
      "Watch on 2 devices",
      "Ad-free experience",
      "Offline downloads",
      "Cancel anytime",
    ],
    cta: "Choose Standard",
    popular: true,
  },
  {
    name: "Premium",
    price: "$18.99",
    period: "/mo",
    tagline: "Everything, in the best quality.",
    features: [
      "4K + HDR Ultra HD",
      "Watch on 4 devices",
      "Ad-free experience",
      "Offline downloads",
      "Immersive spatial audio",
    ],
    cta: "Choose Premium",
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 transition-all duration-300",
        plan.popular
          ? "border-brand/50 bg-surface-2 shadow-[0_24px_70px_-24px_rgba(45,200,170,0.5)] sm:-translate-y-2"
          : "surface-card hover:-translate-y-1 hover:border-foreground/20",
      )}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-brand px-3 py-1 text-xs font-semibold text-black shadow-lg">
          Most popular
        </span>
      )}

      <h2 className="text-lg font-semibold">{plan.name}</h2>
      <p className="mt-1 text-sm text-muted">{plan.tagline}</p>

      <div className="mt-5 flex items-baseline gap-1">
        <span
          className={cn(
            "text-4xl font-bold tracking-tight",
            plan.popular && "text-gradient",
          )}
        >
          {plan.price}
        </span>
        <span className="text-sm text-muted">{plan.period}</span>
      </div>

      <ul className="mt-6 space-y-3 text-sm">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
              <CheckIcon className="size-3.5" />
            </span>
            <span className="text-foreground/90">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        <button
          type="button"
          className={buttonStyles({
            variant: plan.popular ? "primary" : "secondary",
            size: "md",
            className: "w-full",
          })}
        >
          {plan.cta}
        </button>
      </div>
    </div>
  );
}

/** Pricing page: three plans with the middle one highlighted. */
export function SubscriptionPlans() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ChevronLeftIcon className="size-4" />
        Back to browse
      </Link>

      <div className="mx-auto mt-6 max-w-2xl space-y-3 text-center">
        <span className="inline-block rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand">
          Plans &amp; pricing
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Pick the plan that <span className="text-gradient">fits you</span>
        </h1>
        <p className="text-muted">
          Every plan unlocks the full StreaMatrix catalog. Upgrade, downgrade or cancel anytime —
          no contracts, no surprises.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3 sm:gap-6">
        {PLANS.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        Prices shown in USD. Taxes may apply. This is a demo — no payment is taken.
      </p>
    </div>
  );
}
