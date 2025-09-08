

import { prisma } from "./db.js";

/**
 * Common query executor
 * @param {string} query - SQL query string
 * @param {Array} params - Query parameters
 */
export const executeQuery = async (query, params = []) => {
  try {
    // agar parameters diye gaye hain to unsafe use karna hoga
    if (params.length > 0) {
      return await prisma.$queryRawUnsafe(query, ...params);
    } else {
      return await prisma.$queryRawUnsafe(query);
    }
  } catch (error) {
    throw new Error(error.message || error);
  }
};
