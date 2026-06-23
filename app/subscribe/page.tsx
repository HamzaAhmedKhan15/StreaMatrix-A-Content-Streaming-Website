import type { Metadata } from "next";
import { Plans } from "@/components/subscriptions/Plans";

export const metadata: Metadata = {
  title: "Subscription plans",
  description: "Choose a StreaMatrix subscription plan: Basic, Standard or Premium.",
};

export default function SubscribePage() {
  return <Plans />;
}
