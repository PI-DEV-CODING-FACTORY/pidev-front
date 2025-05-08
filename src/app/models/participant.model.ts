export interface Participant {
    id?: number;
    name: string;
    email: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    teamId?: number;
    eventId: number;
} 