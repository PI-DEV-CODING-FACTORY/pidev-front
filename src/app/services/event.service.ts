import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, EventStatus, MyEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'http://localhost:8089/events';

  constructor(private http: HttpClient) { }

  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.baseUrl}`, event);
  }
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseUrl);
  }

  getEventById(id: number): Observable<MyEvent> {
    return this.http.get<MyEvent>(`${this.baseUrl}/${id}`);
  }

  updateEvent(eventId: number, event: MyEvent): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/${eventId}`, event);
  }
  
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  updateEventStatus(eventId: number, status: EventStatus): Observable<Event> {
    const body = JSON.stringify(status); // Convert status to a proper JSON string
  
    console.log(`Sending request with body: ${body}`); // Log the exact request body
  
    return this.http.patch<Event>(`${this.baseUrl}/${eventId}/status`, body, {
      headers: { 'Content-Type': 'application/json' }, // Ensure JSON format
      responseType: 'json' // Expect a JSON response
    });
  }
  
  
  getParticipants(eventId: number): Observable<any> {
    return this.http.get(`http://localhost:8089/examen/participants/${eventId}`);
  }
}
