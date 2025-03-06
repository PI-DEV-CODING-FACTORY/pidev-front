export enum EventType {
  CONFERENCE = "CONFERENCE",
  WORKSHOP = "WORKSHOP",
  SEMINAR = "SEMINAR"
}
  export enum EventStatus {
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING'
  }
  
  export interface MyEvent {
    id: number;
    title: string;
    description: string;
    eventDate: string;
    location: string;
    capacity: number;
    objectives: string;
    eventType: EventType;
    prizes: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  }
  export interface Event {
    id?: number;
    title: string;
    description: string;
    eventDate: string;
    location: string;
    capacity: number;
    objectives: string;
    eventType: EventType;
    prizes: string;
    //status?: EventStatus;
   // status?: EventStatus;
   status: 'PENDING' | 'APPROVED' | 'REJECTED'; // Add status field

  }