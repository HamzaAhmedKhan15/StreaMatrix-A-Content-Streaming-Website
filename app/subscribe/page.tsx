import type { Metadata } from "next";
import { SubscriptionPlans } from "@/components/subscriptions/SubscriptionPlans";

export const metadata: Metadata = {
  title: "Subscription plans",
  description: "Choose a StreaMatrix subscription plan — Basic, Standard or Premium.",
};

export default function SubscribePage() {
  return <SubscriptionPlans />;
}
