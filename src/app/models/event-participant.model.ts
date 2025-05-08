import { Participant } from './participant.model';

export interface EventParticipant {
  id: number;
  participant: Participant;
  role: string;
  status: string;
  teamId?: number;
  eventId: number;
} 