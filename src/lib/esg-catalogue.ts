import { z } from "zod";
import type { EsgKpi } from "./esg";

const nullableText = z.string().nullable();
const mappingSchema = z.object({
  framework: z.enum(["GRI", "BRSR"]),
  reference: nullableText,
  title: nullableText.optional(),
  section: nullableText.optional(),
  principle: nullableText.optional(),
  alignment: z.enum(["Direct", "Partial", "Contextual", "No direct equivalent"]).nullable(),
  reviewStatus: z.literal("provisional"),
});

const catalogueSchema = z.object({
  schemaVersion: z.literal(1),
  indicators: z.array(z.object({
    id: z.string().min(1),
    framework: z.enum(["CDP", "CSA"]),
    topic: z.string().min(1),
    indicator: z.string().min(1),
    theme: z.string().min(1),
    questionReference: nullableText,
    referenceNeedsReview: z.boolean(),
    version: nullableText,
    industry: nullableText,
    applicability: z.literal("unconfirmed"),
    source: z.object({
      file: z.string(), sheet: z.string(), row: z.number().int().positive(),
      originalReference: z.union([z.string(), z.number()]).nullable(),
    }),
    mappings: z.array(mappingSchema),
  })).refine((items) => new Set(items.map((item) => item.id)).size === items.length, "Duplicate indicator IDs"),
});

export function parseKpiCatalogue(value: unknown): EsgKpi[] {
  return catalogueSchema.parse(value).indicators as EsgKpi[];
}
