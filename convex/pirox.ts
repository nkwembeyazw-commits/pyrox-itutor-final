import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
export const createStudent = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    level: v.string(),
    subjects: v.array(v.string()),
  },
  returns: v.id("students"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("students", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
export const updateStudent = mutation({
  args: {
    id: v.id("students"),
    name: v.string(),
    location: v.string(),
    level: v.string(),
    subjects: v.array(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return null;
  },
});
export const deleteStudent = mutation({
  args: { id: v.id("students") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    const schedules = await ctx.db
      .query("schedules")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.id))
      .collect();
    for (const s of schedules) {
      await ctx.db.delete(s._id);
    }
    return null;
  },
});
export const getStudents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("students").order("desc").collect();
  },
});
export const getStudentById = query({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
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
  returns: v.id("tutors"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("tutors", {
      ...args,
      createdAt: Date.now(),
    });
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
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return null;
  },
});
export const deleteTutor = mutation({
  args: { id: v.id("tutors") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    const schedules = await ctx.db
      .query("schedules")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.id))
      .collect();
    for (const s of schedules) {
      await ctx.db.delete(s._id);
    }
    return null;
  },
});
export const getTutors = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tutors").order("desc").collect();
  },
});
export const getTutorById = query({
  args: { id: v.id("tutors") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
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
  returns: v.id("schedules"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("schedules")
      .withIndex("by_owner_day_time", (q) =>
        q.eq("ownerId", args.ownerId).eq("day", args.day).eq("timeSlot", args.timeSlot)
      )
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
  args: { ownerId: v.union(v.id("students"), v.id("tutors")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("schedules")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();
  },
});
export const deleteScheduleSlot = mutation({
  args: { slotId: v.id("schedules") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.slotId);
    return null;
  },
});