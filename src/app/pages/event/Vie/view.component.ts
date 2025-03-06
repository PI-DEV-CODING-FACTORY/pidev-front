// view.component.ts
import { Component, OnInit } from '@angular/core';
//import { Event, EventStatus, EventType } from '../models/event.model';
import { Event,  EventStatus,  EventType } from '../../../models/event.model'; 
import { EventService } from '../../../services/event.service'; 
import { CommonModule } from '@angular/common';
import { QuestionForm } from '../../../models/questionform.model';
import { MatDialog } from '@angular/material/dialog';
import { QuestionFormComponent } from '../questionForm/question-form.component';
import { ParticipantsModalComponent } from '../participants-modal/participants-modal.component';
import { ParticipantService } from '../../../services/participant.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-event-view',
  standalone: true, // Ensure this is a standalone component
  imports: [CommonModule], // Import CommonModule here
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  events: Event[] = [];
  selectedEvent: Event | null = null;
  
  constructor(private eventService: EventService,private dialog: MatDialog,private ps : ParticipantService, private router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }
  

  loadEvents(): void {
    this.eventService.getEvents().subscribe((data: Event[]) => {
      this.events = data;
    });
  }

  updateEvent(event: Event): void {
    console.log('Update event:', event);
    this.router.navigate(['/edit-event', event.id]); // Redirige vers la page d'édition
  }

  deleteEvent(eventId?: number): void {
    if (eventId !== undefined) {
      if (confirm('Are you sure you want to delete this event?')) {
        this.eventService.deleteEvent(eventId).subscribe(() => {
          this.events = this.events.filter(event => event.id !== eventId);
        });
    }
  }
}
createQuestionForm(event: Event): void {
  const dialogRef = this.dialog.open(QuestionFormComponent, {
    width: '800px',
    data: { event: event },
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Question form created:', result);
      this.loadEvents(); // Refresh the events list to show updated data
      // Or update the specific event in the list if your API returns the updated event
    }
  });
}

updateEventStatus(event: any, status: EventStatus): void {
  if (event.id === undefined) {
    console.error('Error: Event ID is undefined.');
    return; // Prevent execution if event ID is undefined
  }

  console.log('Event ID:', event.id);
  console.log('Updating status to:', status); // Log the status being passed

  // Call the service to update the status
  this.eventService.updateEventStatus(event.id, status).subscribe({
    next: (response) => {
      console.log('Response from backend:', response); // Log the response
      event.status = status;  // Update UI only if success
      console.log(`Event status updated to ${status}`);
    },
    error: (error) => {
      console.error('Error updating event status:', error); // Log error details
    }
  });
}



eventStatus = EventStatus; 

openParticipantsModal(eventId: number): void {
  this.ps.getParticipants(eventId).subscribe({
    next: (participants) => {
      this.dialog.open(ParticipantsModalComponent, {
        width: '600px',
        data: { eventId, participants } // Passe les participants au modal
      });
    },
    error: (error) => {
      console.error('Erreur lors de la récupération des participants:', error);
      alert('Impossible de charger les participants.');
    }
  });
}
openParticipantsPage(eventId: number): void {
  this.router.navigate(['/participants', eventId]);
}
openEventDetails(event: Event): void {
  this.selectedEvent = event;
}
eventQuestions: any[] = []; 
closeModal(): void {
  this.selectedEvent = null;
}
openModal(event: any) {
  this.selectedEvent = event;
  this.getQuestions(event.id); // Charge les questions associées à cet événement
}

getQuestions(eventId: number) {
  console.log("Chargement des questions pour l'événement ID :", eventId);

  this.ps.getQuestions(eventId).subscribe({
    next: (questions) => {
      this.eventQuestions = questions;
      console.log("Questions reçues :", this.eventQuestions);
    },
    error: (error) => {
      console.error("Erreur lors du chargement des questions :", error);
    }
  });
}


}
