import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
// Student Operations
export const createStudent = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    level: v.string(),
    subjects: v.array(v.string()),
    lastPaidDate: v.number(),
    paymentInterval: v.union(v.literal("weekly"), v.literal("monthly")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("students", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
export const getStudents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("students").order("desc").collect();
  },
});
export const updateStudent = mutation({
  args: {
    id: v.id("students"),
    name: v.string(),
    location: v.string(),
    level: v.string(),
    subjects: v.array(v.string()),
    lastPaidDate: v.number(),
    paymentInterval: v.union(v.literal("weekly"), v.literal("monthly")),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});
export const markStudentAsPaid = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      lastPaidDate: Date.now(),
    });
  },
});
export const deleteStudent = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    // 1. Delete the student record
    await ctx.db.delete(args.id);
    // 2. Cascade delete schedule slots owned by this student
    const slots = await ctx.db
      .query("schedules")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.id))
      .collect();
    for (const slot of slots) {
      await ctx.db.delete(slot._id);
    }
    // 3. Remove student from all Tutor rosters to maintain referential integrity
    const tutors = await ctx.db.query("tutors").collect();
    for (const tutor of tutors) {
      if (tutor.studentIds?.includes(args.id)) {
        await ctx.db.patch(tutor._id, {
          studentIds: tutor.studentIds.filter(sid => sid !== args.id)
        });
      }
    }
    // 4. Remove schedule slots referencing this student (using optimized index)
    const tutorSlotsReferencingStudent = await ctx.db
      .query("schedules")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.id))
      .collect();
    for (const ts of tutorSlotsReferencingStudent) {
       await ctx.db.delete(ts._id);
    }
  },
});
// Tutor Operations
export const createTutor = mutation({
  args: {
    name: v.string(),
    contact: v.string(),
    subjects: v.array(v.string()),
    mode: v.string(),
    studentIds: v.array(v.id("students")),
    rate: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tutors", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
export const getTutors = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tutors").order("desc").collect();
  },
});
export const updateTutor = mutation({
  args: {
    id: v.id("tutors"),
    name: v.string(),
    contact: v.string(),
    subjects: v.array(v.string()),
    mode: v.string(),
    studentIds: v.array(v.id("students")),
    rate: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});
export const deleteTutor = mutation({
  args: { id: v.id("tutors") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    const slots = await ctx.db
      .query("schedules")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.id))
      .collect();
    for (const slot of slots) {
      await ctx.db.delete(slot._id);
    }
  },
});
// Schedule Operations
export const upsertScheduleSlot = mutation({
  args: {
    ownerId: v.union(v.id("students"), v.id("tutors")),
    ownerType: v.union(v.literal("student"), v.literal("tutor")),
    day: v.string(),
    timeSlot: v.string(),
    subject: v.optional(v.string()),
    notes: v.optional(v.string()),
    studentId: v.optional(v.id("students")),
    studentName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("schedules")
      .withIndex("by_owner_day_time", (q) =>
        q.eq("ownerId", args.ownerId).eq("day", args.day).eq("timeSlot", args.timeSlot)
      )
      .unique();
    if (existing) {
      if (!args.subject && !args.notes) {
        await ctx.db.delete(existing._id);
      } else {
        await ctx.db.patch(existing._id, {
          subject: args.subject,
          notes: args.notes,
          studentId: args.studentId,
          studentName: args.studentName,
        });
      }
    } else if (args.subject || args.notes) {
      await ctx.db.insert("schedules", args);
    }
  },
});
export const getSchedule = query({
  args: { ownerId: v.union(v.id("students"), v.id("tutors"), v.literal("skip")) },
  handler: async (ctx, args) => {
    if (args.ownerId === "skip") return [];
    return await ctx.db
      .query("schedules")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId as Id<"students"> | Id<"tutors">))
      .collect();
  },
});