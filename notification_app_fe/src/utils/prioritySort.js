/**
 * Priority Sorting Utility
 * Implements the campus notification priority algorithm.
 *
 * Priority Order: Placement (3) > Result (2) > Event (1)
 * Within the same type, latest timestamp comes first.
 */

// Weight map for notification types
const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Returns the priority weight for a given notification type.
 * Falls back to 0 for unknown types.
 * @param {string} type - The notification type
 * @returns {number}
 */
export const getTypeWeight = (type) => TYPE_WEIGHTS[type] ?? 0;

/**
 * Comparator function that sorts notifications by:
 *   1. Type weight (descending — Placement first)
 *   2. Timestamp (descending — latest first)
 *
 * @param {Object} a - Notification object
 * @param {Object} b - Notification object
 * @returns {number}
 */
export const priorityComparator = (a, b) => {
  const weightDiff = getTypeWeight(b.notification_type || b.type) - getTypeWeight(a.notification_type || a.type);
  if (weightDiff !== 0) return weightDiff;

  // Same type → sort by timestamp descending
  const timeA = new Date(a.timestamp || a.created_at).getTime();
  const timeB = new Date(b.timestamp || b.created_at).getTime();
  return timeB - timeA;
};

/**
 * Sorts an array of notifications by priority and returns the top N.
 * Does NOT mutate the original array.
 *
 * @param {Array} notifications - The notification list
 * @param {number} topN - Number of items to return
 * @returns {Array} - Sorted and sliced notification list
 */
export const getTopPriorityNotifications = (notifications, topN = 10) => {
  return [...notifications].sort(priorityComparator).slice(0, topN);
};
