import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABI TEAM Platform",
  description: "Hybrid Jira + Product Hunt workspace for engineering teams",
};

export default function AbiTeamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
