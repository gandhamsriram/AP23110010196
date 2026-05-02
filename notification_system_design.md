# Campus Notification System — Design Document

## 1. Approach
The Campus Notification System is built as a single-page React application that fetches, filters, and displays campus updates (Events, Results, Placements). The architecture strictly separates concerns:
- **UI Components:** Reusable Material UI elements (`NotificationCard`, `FilterBar`, `PaginationControls`).
- **Pages:** View-level components (`AllNotifications`, `PriorityInbox`) handling layout and state logic.
- **Service Layer:** `api.js` encapsulates all HTTP logic, token management, and error normalization.
- **State Management:** Local React state combined with `localStorage` for persistent read/unread tracking.

## 2. Priority Logic
The Priority Inbox applies a custom weighting algorithm to sort notifications by importance before displaying the top 10, 15, or 20 items.

**Weight Assignment:**
- `Placement`: Weight 3 (Highest)
- `Result`: Weight 2 (Medium)
- `Event`: Weight 1 (Standard)

**Sorting Algorithm:**
1. Sort by weight descending (Placement first).
2. If weights are identical, use the `timestamp` as a tiebreaker (latest first).
This ensures critical placement drives are never missed, while still ordering chronological events correctly.

## 3. API Handling
The system uses Axios to interact with the central Evaluation API.
- **Authentication:** An Axios request interceptor automatically attaches the `Authorization: Bearer <token>` header from environment variables.
- **Pagination & Filtering:** Query parameters (`page`, `limit`, `notification_type`) are dynamically constructed based on UI state.
- **Mock Fallback:** If the API is unreachable or returns a 401 Unauthorized, the service layer transparently falls back to a realistic mock dataset, ensuring the UI always has data to render.

## 4. UI Design Decisions
- **Premium Light Theme:** A modern light color palette using Slate backgrounds (`#F8FAFC`) and crisp white cards, optimizing readability.
- **Material UI Exclusively:** All components use standard MUI building blocks to ensure a consistent, accessible design system without relying on external libraries like Tailwind.
- **Responsive Layout:** A flexible Grid system and a mobile drawer menu ensure the application works seamlessly on both desktop and mobile devices.
- **Read/Unread Distinction:** Unread notifications feature a subtle blue glow and a pulsing indicator. Clicking marks them as read, immediately fading the card's opacity to visually declutter the inbox.

## 5. Error Handling
- **Graceful Degradation:** The UI never displays a blank white screen. If the API fails, a clean "Showing Demo Data" info banner is displayed.
- **Network Resilience:** The Axios response interceptor catches all errors (401, 500, timeouts) and normalizes the error message so the UI can display a consistent alert.
- **Loading States:** Skeleton loaders are used during network requests to prevent layout shift and signal background activity to the user.

## 6. Scalability
- **Pagination Strategy:** Data is fetched in chunks (limit: 10) rather than loading the entire dataset into memory, supporting thousands of notifications.
- **Debounced Inputs:** Real-time filtering is debounced to prevent API spamming while typing or rapidly changing categories.
- **Memoization:** Heavy rendering components (like `NotificationCard` lists) use `React.memo` and `useMemo` to prevent unnecessary re-renders during state updates.
- **Stateless Components:** The architecture allows for easy swapping of the backend API without rewriting UI logic, making it highly modular.
