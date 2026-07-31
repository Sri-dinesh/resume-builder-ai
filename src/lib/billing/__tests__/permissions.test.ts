import { describe, it, expect } from "vitest";
import {
  canCreateResume,
  canUseAITools,
  canUseCustomizations,
} from "../permissions";
import type { SubscriptionLevel } from "../subscription";

describe("canCreateResume", () => {
  it("allows free user to create 1 resume", () => {
    expect(canCreateResume("free", 0)).toBe(true);
  });

  it("blocks free user from creating more than 1 resume", () => {
    expect(canCreateResume("free", 1)).toBe(false);
  });

  it("allows pro user to create up to 3 resumes", () => {
    expect(canCreateResume("pro", 0)).toBe(true);
    expect(canCreateResume("pro", 1)).toBe(true);
    expect(canCreateResume("pro", 2)).toBe(true);
  });

  it("blocks pro user from creating more than 3 resumes", () => {
    expect(canCreateResume("pro", 3)).toBe(false);
  });

  it("allows pro_plus user to create unlimited resumes", () => {
    expect(canCreateResume("pro_plus", 0)).toBe(true);
    expect(canCreateResume("pro_plus", 100)).toBe(true);
    expect(canCreateResume("pro_plus", 9999)).toBe(true);
  });
});

describe("canUseAITools", () => {
  it("blocks free users from AI tools", () => {
    expect(canUseAITools("free")).toBe(false);
  });

  it("allows pro users to use AI tools", () => {
    expect(canUseAITools("pro")).toBe(true);
  });

  it("allows pro_plus users to use AI tools", () => {
    expect(canUseAITools("pro_plus")).toBe(true);
  });
});

describe("canUseCustomizations", () => {
  it("blocks free users from customizations", () => {
    expect(canUseCustomizations("free")).toBe(false);
  });

  it("blocks pro users from customizations", () => {
    expect(canUseCustomizations("pro")).toBe(false);
  });

  it("allows pro_plus users to use customizations", () => {
    expect(canUseCustomizations("pro_plus")).toBe(true);
  });

  const levels: SubscriptionLevel[] = ["free", "pro", "pro_plus"];
  it("returns boolean for all subscription levels", () => {
    for (const level of levels) {
      expect(typeof canUseCustomizations(level)).toBe("boolean");
    }
  });
});
