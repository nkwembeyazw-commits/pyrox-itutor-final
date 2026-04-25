import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const createStudent = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    level: v.string(),
    subjects: v.array(v.string()),
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
export const upsertScheduleSlot = mutation({
  args: {
    ownerId: v.union(v.id("students"), v.id("tutors")),
    ownerType: v.union(v.literal("student"), v.literal("tutor")),
    day: v.string(),
    timeSlot: v.string(),
    subject: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("schedules")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .filter((q) => q.and(q.eq(q.field("day"), args.day), q.eq(q.field("timeSlot"), args.timeSlot)))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        subject: args.subject,
        notes: args.notes,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("schedules", args);
    }
  },
});
export const getSchedule = query({
  args: { ownerId: v.id("students") || v.id("tutors") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("schedules")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId as any))
      .collect();
  },
});
export const deleteScheduleSlot = mutation({
  args: { slotId: v.id("schedules") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.slotId);
  },
});