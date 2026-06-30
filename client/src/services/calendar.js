// client/src/services/calendar.js

// Helper to get the token securely
const getToken = () => localStorage.getItem("google_calendar_token");

/**
 * Checks the user's primary calendar to find busy time slots for today.
 */
export async function getBusySlots() {
  const token = getToken();
  if (!token) throw new Error("No calendar token found. Please log in again.");

  // Set the time range for "Today" (9 AM to 9 PM)
  const today = new Date();
  const timeMin = new Date(today.setHours(9, 0, 0, 0)).toISOString();
  const timeMax = new Date(today.setHours(21, 0, 0, 0)).toISOString();

  const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin: timeMin,
      timeMax: timeMax,
      items: [{ id: "primary" }],
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    console.error("Calendar API Error:", data.error);
    return [];
  }

  // Returns an array of busy time blocks: [{ start: "...", end: "..." }]
  return data.calendars.primary.busy; 
}

/**
 * Pushes a scheduled task directly to Google Calendar.
 */
export async function addEventToCalendar(taskName, description, startTimeISO, endTimeISO) {
  const token = getToken();
  if (!token) throw new Error("No calendar token found. Please log in again.");

  const event = {
    summary: `🤖 AI Planned: ${taskName}`,
    description: description || "Auto-scheduled by your AI Productivity Companion.",
    start: {
      dateTime: startTimeISO,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Auto-detects local timezone
    },
    end: {
      dateTime: endTimeISO,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    colorId: "9", // Adds a nice blue color to the event
  };

  const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message);
  }

  return data; // Returns the created event details (including a link to view it)
}