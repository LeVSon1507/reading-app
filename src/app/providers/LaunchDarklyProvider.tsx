"use client";

import { LDProvider } from "launchdarkly-react-client-sdk";
import type { LDContext } from "launchdarkly-js-client-sdk";

const context: LDContext = {
  kind: "user",
  key: "test",
  name: "Test User",
  department: "engineering",
  region: "asia",
  segment: "premium-users",
  email: "son.lev@one-line.com",
  level: "premium",
};

const ldConfig = {
  clientSideID: "67ad6f9aa2d5470c918be544",
  context,
  // Optional: Add other configurations
  // streaming: true,
  // evaluationReasons: true,
};

interface ProviderProps {
  children: React.ReactNode;
}

export function LaunchDarklyProvider({ children }: ProviderProps) {
  return <LDProvider {...ldConfig}>{children}</LDProvider>;
}
