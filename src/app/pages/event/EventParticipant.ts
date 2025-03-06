// event-participant.model.ts

export interface EventParticipant {
    id: number;
    participant: {
      id: number;
      name: string;
      email: string;
      average_score: number;
    };
    answers: string[];
    
  }
  