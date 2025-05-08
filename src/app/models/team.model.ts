import { Checkpoint } from './checkpoint.model';
import { Participant } from './participant.model';

export interface Team {
  id?: number;
  teamName: string;
  event: Event;
  participants: Participant[];
  checkpoints: Checkpoint[];
  members?: Participant[];
} 