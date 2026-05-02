/**
 * Mock Notification Data
 * Used as fallback when the API is unreachable or requires authorization.
 * Covers all three notification types with realistic campus data.
 */

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    notification_type: 'Placement',
    message: 'Google is visiting campus on May 15th for SDE roles. Pre-placement talk at 10 AM in Auditorium.',
    timestamp: '2026-05-01T10:00:00Z',
  },
  {
    id: 2,
    notification_type: 'Placement',
    message: 'Amazon internship drive scheduled for May 20th. Eligible: CSE, IT, ECE branches with 7+ CGPA.',
    timestamp: '2026-04-30T14:30:00Z',
  },
  {
    id: 3,
    notification_type: 'Placement',
    message: 'Microsoft Azure hiring event — register on the placement portal before May 10th.',
    timestamp: '2026-04-28T09:15:00Z',
  },
  {
    id: 4,
    notification_type: 'Placement',
    message: 'Infosys InStep internship results declared. Check the placement portal for your status.',
    timestamp: '2026-04-25T16:00:00Z',
  },
  {
    id: 5,
    notification_type: 'Result',
    message: 'Semester 6 examination results have been published. Check the student portal for your grades.',
    timestamp: '2026-05-01T08:00:00Z',
  },
  {
    id: 6,
    notification_type: 'Result',
    message: 'Internal Assessment 2 marks uploaded for all departments. Discrepancy deadline: May 5th.',
    timestamp: '2026-04-29T11:30:00Z',
  },
  {
    id: 7,
    notification_type: 'Result',
    message: 'Re-evaluation results for Semester 5 are now available on the examination portal.',
    timestamp: '2026-04-27T13:00:00Z',
  },
  {
    id: 8,
    notification_type: 'Result',
    message: 'Lab examination schedule for Semester 6 released. Download from the academics section.',
    timestamp: '2026-04-24T10:45:00Z',
  },
  {
    id: 9,
    notification_type: 'Event',
    message: 'Annual Tech Fest "TechNova 2026" — May 25-27. Register your team for hackathon and coding contests.',
    timestamp: '2026-05-02T06:00:00Z',
  },
  {
    id: 10,
    notification_type: 'Event',
    message: 'Workshop on Machine Learning with Python — May 12th, 2 PM, CS Lab 3. Limited seats available.',
    timestamp: '2026-04-30T09:00:00Z',
  },
  {
    id: 11,
    notification_type: 'Event',
    message: 'NSS Blood Donation Camp on May 8th at the campus health center. Volunteers needed.',
    timestamp: '2026-04-29T07:30:00Z',
  },
  {
    id: 12,
    notification_type: 'Event',
    message: 'Guest lecture by Dr. Raghuram Rajan on "Future of Indian Economy" — May 14th, Main Auditorium.',
    timestamp: '2026-04-28T15:00:00Z',
  },
  {
    id: 13,
    notification_type: 'Placement',
    message: 'TCS NQT registration deadline extended to May 18th. Register on the TCS iON portal.',
    timestamp: '2026-04-23T12:00:00Z',
  },
  {
    id: 14,
    notification_type: 'Event',
    message: 'Inter-college sports tournament starts May 22nd. Register for cricket, basketball, and athletics.',
    timestamp: '2026-04-26T08:00:00Z',
  },
  {
    id: 15,
    notification_type: 'Result',
    message: 'Scholarship merit list for 2026-27 academic year published. Check the finance office notice board.',
    timestamp: '2026-04-22T14:00:00Z',
  },
  {
    id: 16,
    notification_type: 'Placement',
    message: 'Wipro Elite NLTH results announced. Selected candidates report to placement cell by May 6th.',
    timestamp: '2026-04-20T10:30:00Z',
  },
  {
    id: 17,
    notification_type: 'Event',
    message: 'Cultural fest "Rhythm 2026" auditions open. Dance, music, and drama — register by May 10th.',
    timestamp: '2026-04-25T11:00:00Z',
  },
  {
    id: 18,
    notification_type: 'Result',
    message: 'GATE 2026 mock test results available. Top 50 scorers eligible for advanced coaching.',
    timestamp: '2026-04-21T09:00:00Z',
  },
  {
    id: 19,
    notification_type: 'Placement',
    message: 'Deloitte campus recruitment — aptitude test on May 16th. Eligibility: All branches, 6.5+ CGPA.',
    timestamp: '2026-04-19T13:00:00Z',
  },
  {
    id: 20,
    notification_type: 'Event',
    message: 'IEEE Student Branch — Paper presentation competition on May 11th. Cash prizes for top 3.',
    timestamp: '2026-04-24T16:30:00Z',
  },
];

/**
 * Returns mock notifications with pagination and optional type filtering.
 * Simulates the API response shape.
 *
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.limit
 * @param {string} [params.notification_type]
 * @returns {Object} - Mock API response
 */
export const getMockNotifications = ({ page = 1, limit = 10, notification_type } = {}) => {
  let filtered = MOCK_NOTIFICATIONS;

  if (notification_type) {
    filtered = filtered.filter((n) => n.notification_type === notification_type);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIdx = (page - 1) * limit;
  const data = filtered.slice(startIdx, startIdx + limit);

  return {
    data,
    total,
    page,
    limit,
    total_pages: totalPages,
  };
};

/**
 * Returns ALL mock notifications (for priority inbox).
 */
export const getAllMockNotifications = () => MOCK_NOTIFICATIONS;

export default MOCK_NOTIFICATIONS;
