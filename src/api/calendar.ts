import { createResource, type HasId } from "./crud";

export type CalendarEventType =
  "term" | "exam" | "holiday" | "event" | "meeting";

export interface CalendarEvent extends HasId {
  title: string;
  date: string;
  type: CalendarEventType;
  time?: string;
  venue?: string;
}

export const calendarApi = createResource<CalendarEvent>("/api/calendar");
