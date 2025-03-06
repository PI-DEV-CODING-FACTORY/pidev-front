import { Event } from "./event.model";

export interface QuestionForm {
  id: number;
  questions: string[];
  event: Event;
}