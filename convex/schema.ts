import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
export default defineSchema({
  ...authTables,
  students: defineTable({
    name: v.string(),
    location: v.string(),
    level: v.string(), // Primary, IGCSE, A Level
    subjects: v.array(v.string()),
    createdAt: v.number(),
    lastPaidDate: v.optional(v.number()),
    paymentInterval: v.optional(v.union(v.literal("weekly"), v.literal("monthly"))),
  }),
  tutors: defineTable({
    name: v.string(),
    contact: v.string(),
    subjects: v.array(v.string()),
    mode: v.string(), // Online, In-person
    studentIds: v.array(v.id("students")),
    rate: v.number(),
    createdAt: v.number(),
  }),
  schedules: defineTable({
    ownerId: v.union(v.id("students"), v.id("tutors")),
    ownerType: v.union(v.literal("student"), v.literal("tutor")),
    day: v.string(), // Monday, Tuesday...
    timeSlot: v.string(), // e.g., "08:00 - 09:00"
    subject: v.optional(v.string()),
    notes: v.optional(v.string()),
    studentId: v.optional(v.id("students")),
    studentName: v.optional(v.string()),
  })
    .index("by_owner", ["ownerId"])
    .index("by_studentId", ["studentId"])
    .index("by_owner_day_time", ["ownerId", "day", "timeSlot"]),
  files: defineTable({
    userId: v.id("users"),
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    description: v.optional(v.string()),
    uploadedAt: v.number(),
  })
    .index("by_userId_uploadedAt", ["userId", "uploadedAt"])
    .index("by_userId_storageId", ["userId", "storageId"]),
});