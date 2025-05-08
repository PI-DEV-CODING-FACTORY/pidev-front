import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ParticipantService } from '../../../services/participant.service';
import { CommonModule } from '@angular/common';
import { Participant } from '../../../models/participant.model';
import { tap, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-participants-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './participants-page.component.html',
  styleUrl: './participants-page.component.css'
})
export class ParticipantsPageComponent {
  participants: any[] = [];
  eventId!: number;
  sortDirection: boolean = true;
  selectedParticipantIds: number[] = [];
  
  // Notification properties
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationSuccess: boolean = false;
  
  // Add public property for route parameters
  routeParams: any = {};
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private participantService: ParticipantService
  ) {}

  ngOnInit(): void {
    const eventIdParam = this.route.snapshot.paramMap.get('eventId');
    // Store route parameters for template access
    this.routeParams = { eventId: eventIdParam };
    
    if (eventIdParam) {
      this.eventId = +eventIdParam; // Convert to number
      console.log('Initialized with eventId:', this.eventId);
      this.loadParticipants(this.eventId);
    } else {
      console.error('No eventId found in route parameters');
    }
  }

  openHackathonStudio(): void {
    console.log('Navigating to team management with eventId:', this.eventId);
    this.router.navigate(['/event/'+this.eventId+'/teams']);
  }

  loadParticipants(eventId: number): void {
    this.participantService.getParticipant(eventId).subscribe({
      next: (data) => {
        console.log('Données reçues:', data);
        this.participants = data.map(participant => ({
          ...participant,
          selected: false,
          participant: {
            ...participant.participant,
          }
        }));
      },
      error: (error) => {
        console.error('Erreur lors du chargement des participants', error);
        this.showError('Erreur lors du chargement des participants');
      }
    });
  }

  sortParticipants(): void {
    this.participants.sort((a, b) => {
      const avgA = a.participant.averageScore || 0;
      const avgB = b.participant.averageScore || 0;

      return this.sortDirection ? avgB - avgA : avgA - avgB;  // Tri en fonction de la direction
    });
  }

  // Fonction pour inverser la direction du tri
  toggleSortDirection(): void {
    this.sortDirection = !this.sortDirection;
    this.sortParticipants();
  }

  onSelectParticipant(participant: any): void {
    participant.selected = !participant.selected;
    if (participant.selected) {
      this.selectedParticipantIds.push(participant.id);
    } else {
      const index = this.selectedParticipantIds.indexOf(participant.id);
      if (index > -1) {
        this.selectedParticipantIds.splice(index, 1);
      }
    }
    console.log('Selected Participant IDs:', this.selectedParticipantIds);
  }

  getSelectedEmails(): string[] {
    return this.participants
      .filter(participant => participant.selected)
      .map(participant => participant.participant.email);
  }

  sendEmails(): void {
    const selectedEmails = this.getSelectedEmails();
    if (selectedEmails.length === 0) {
      this.showSuccess('Veuillez sélectionner au moins un participant');
      return;
    }

    // Show loading notification
    this.showSuccess('Envoi des invitations en cours...');

    let successCount = 0;

    // Send all emails in parallel
    const emailObservables = selectedEmails.map(email => {
      const participant = this.participants.find(p => p.participant.email === email);
      if (participant) {
        const participantData = {
          name: participant.participant.name,
          email: participant.participant.email,
          status: participant.status // Include the status in the email data
        };
        
        return this.participantService.sendEmailWithDesign(
          [email], 
          participantData, 
          this.eventId,
          participant.id // This is the participant_event ID
        ).pipe(
          tap({
            next: () => {
              successCount++;
              participant.participant.decision = true;
              this.updateParticipantDecision(participant, true);
            }
          })
        );
      }
      return of(null);
    });

    // Combine all observables and handle results
    forkJoin(emailObservables).subscribe({
      next: () => {
        this.showSuccess(`Invitations envoyées avec succès à ${successCount} participant(s)`);
        // Reload participants list after 1 second
        setTimeout(() => {
          this.loadParticipants(this.eventId);
        }, 1000);
      },
      error: () => {
        this.showSuccess('Opération terminée');
      }
    });
  }

  toggleAllParticipants(): void {
    const allSelected = this.participants.every(p => p.selected);
    this.participants.forEach(participant => {
      participant.selected = !allSelected;
      if (participant.selected) {
        if (!this.selectedParticipantIds.includes(participant.id)) {
          this.selectedParticipantIds.push(participant.id);
        }
      } else {
        const index = this.selectedParticipantIds.indexOf(participant.id);
        if (index > -1) {
          this.selectedParticipantIds.splice(index, 1);
        }
      }
    });
  }

  updateParticipantDecision(participant: any, decision: boolean): void {
    const status = decision ? 'ACCEPTED' : 'REJECTED';
    this.participantService.updateParticipantDecision(participant.id, decision).subscribe({
      next: () => {
        participant.status = status;
        this.showSuccess(`Participant ${decision ? 'accepté' : 'rejeté'} avec succès`);
      },
      error: (error) => {
        console.error('Error updating decision:', error);
        this.showError('Erreur lors de la mise à jour du statut');
      }
    });
  }

  // Notification methods
  showSuccess(message: string): void {
    this.notificationMessage = message;
    this.notificationSuccess = true;
    this.showNotification = true;
    setTimeout(() => this.hideNotification(), 5000);
  }

  showError(message: string): void {
    this.notificationMessage = message;
    this.notificationSuccess = false;
    this.showNotification = true;
    setTimeout(() => this.hideNotification(), 5000);
  }

  hideNotification(): void {
    this.showNotification = false;
  }
}
