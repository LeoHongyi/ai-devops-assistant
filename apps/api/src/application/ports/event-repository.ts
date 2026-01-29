import { Event } from "../../domain/event";

export interface EventRepository {
  create(input: Omit<Event, "id">): Promise<Event>;
}
