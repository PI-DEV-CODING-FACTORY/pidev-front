import { Component, OnInit } from '@angular/core';
import { Event, EventStatus } from '../../../models/event.model';
import { EventService } from '../../../services/event.service'; 
import { CommonModule } from '@angular/common';
import { ParticipantService } from '../../../services/participant.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-affichage',
  standalone: true,
  imports: [CommonModule,FormsModule ],
  templateUrl: './viewUser.component.html',
  styleUrls: ['./viewUser.component.css']
})
export class AffichageComponent implements OnInit {
  events: Event[] = [];
  selectedEvent: Event | null = null;
  isModalOpen: boolean = false;
  questions: string[] = [];
  answers: string[] = [];
  name: string = '';
  email: string = '';

  constructor(
    private eventService: EventService,
    private participantService: ParticipantService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe((data: Event[]) => {
      this.events = data.filter(event => event.status === EventStatus.APPROVED);
    });
  }

  oopenReservationModal(event: Event): void {
    // Vérifier si event.id est défini
    if (event.id !== undefined) {
      this.selectedEvent = event;
      this.isModalOpen = true;
  
      // Récupérer les questions de l'événement
      this.participantService.getQuestions(event.id).subscribe((response: string[]) => {
        this.questions = response;
      });
    } else {
      alert('L\'événement n\'a pas d\'ID valide.');
    }
  }
  

  closeReservationModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  resetForm(): void {
    this.name = '';
    this.email = '';
    this.answers = [];
  }

  submitReservation(): void {
    // Vérification si selectedEvent n'est pas null et si les données sont complètes
    if (!this.selectedEvent || !this.name || !this.email || this.answers.length === 0) {
      alert('Veuillez remplir toutes les informations et répondre aux questions');
      return;
    }
  
    // Utilisation de "Non-null assertion operator" pour garantir que selectedEvent n'est pas null
    const eventId = this.selectedEvent.id!;  // Ici on indique à TypeScript que `id` est sûr
  
    // Appel à la fonction participate pour inscrire l'utilisateur et soumettre les réponses
    this.participantService.participate(eventId, this.name, this.email, this.answers)
  .subscribe({
    next: (response) => {
      console.log('Réservation réussie:', response);
      alert('✅ Réservation réussie et réponses soumises !');
      this.closeReservationModal();
    },
    error: (error) => {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Erreur lors de l\'inscription à l\'événement.');
    }
  });
  }

  onAnswerChange(index: number, answer: string): void {
    this.answers[index] = answer;
  }
}
