export interface Checkpoint {
  id?: number;
  title: string;
  description: string;
  percentage: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  teamId: number;
  deadline?: Date;
  completedAt?: Date;
} 