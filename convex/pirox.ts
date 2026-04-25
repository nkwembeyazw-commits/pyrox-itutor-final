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