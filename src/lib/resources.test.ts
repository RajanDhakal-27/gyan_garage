import { describe, it, expect } from "vitest";
import {
  validateResourceInput,
  filterResources,
  extractSubjects,
  extractTopics,
} from "./resources";
import { LearningItem } from "@/types/database";

describe("validateResourceInput", () => {
  it("rejects empty title", () => {
    const result = validateResourceInput({ title: "" });
    expect(result.isValid).toBe(false);
    expect(result.errors.title).toBeDefined();
  });

  it("rejects titles shorter than 3 chars", () => {
    const result = validateResourceInput({ title: "ab" });
    expect(result.isValid).toBe(false);
    expect(result.errors.title).toContain("at least 3 characters");
  });

  it("rejects invalid URLs", () => {
    const result = validateResourceInput({
      title: "Valid Title",
      external_url: "not-a-valid-url",
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.external_url).toBeDefined();
  });

  it("accepts valid resource input", () => {
    const result = validateResourceInput({
      title: "Class 10 Opt Math Notes",
      external_url: "https://example.com/math.pdf",
      subject: "Mathematics",
      topic: "Trigonometry",
      resource_type: "Notes",
    });
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });
});

describe("filterResources", () => {
  const sampleItems: LearningItem[] = [
    {
      id: "1",
      item_type: "resource",
      title: "Trigonometry Formulas",
      description: "Quick revision notes",
      resource_type: "Notes",
      subject: "Mathematics",
      topic: "Trigonometry",
      external_url: "https://example.com/trig.pdf",
      instructions: null,
      due_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      item_type: "resource",
      title: "Newton's Laws Video",
      description: "Comprehensive lecture",
      resource_type: "Video Lesson",
      subject: "Science",
      topic: "Force & Motion",
      external_url: "https://youtube.com/watch?v=123",
      instructions: null,
      due_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      item_type: "homework", // Should be ignored in resource filtering
      title: "Homework 1",
      description: "Do exercises",
      resource_type: null,
      subject: "Mathematics",
      topic: null,
      external_url: null,
      instructions: "Page 20",
      due_at: null,
      created_at: new Date().toISOString(),
    },
  ];

  it("filters by subject", () => {
    const filtered = filterResources(sampleItems, { subject: "Science" });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("Newton's Laws Video");
  });

  it("filters by search term", () => {
    const filtered = filterResources(sampleItems, { searchQuery: "revision" });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("Trigonometry Formulas");
  });

  it("filters by resource type", () => {
    const filtered = filterResources(sampleItems, { resourceType: "Notes" });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("Trigonometry Formulas");
  });

  it("excludes homework items", () => {
    const filtered = filterResources(sampleItems, {});
    expect(filtered).toHaveLength(2);
    expect(filtered.some((i) => i.item_type === "homework")).toBe(false);
  });
});

describe("extractSubjects and extractTopics", () => {
  const sampleItems: LearningItem[] = [
    {
      id: "1",
      item_type: "resource",
      title: "Math 1",
      description: null,
      resource_type: "Notes",
      subject: "Mathematics",
      topic: "Algebra",
      external_url: null,
      instructions: null,
      due_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      item_type: "resource",
      title: "Math 2",
      description: null,
      resource_type: "Notes",
      subject: "Mathematics",
      topic: "Geometry",
      external_url: null,
      instructions: null,
      due_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      item_type: "resource",
      title: "Science 1",
      description: null,
      resource_type: "Notes",
      subject: "Science",
      topic: "Optics",
      external_url: null,
      instructions: null,
      due_at: null,
      created_at: new Date().toISOString(),
    },
  ];

  it("extracts sorted unique subjects", () => {
    const subjects = extractSubjects(sampleItems);
    expect(subjects).toEqual(["Mathematics", "Science"]);
  });

  it("extracts topics filtered by subject", () => {
    const mathTopics = extractTopics(sampleItems, "Mathematics");
    expect(mathTopics).toEqual(["Algebra", "Geometry"]);
  });
});
