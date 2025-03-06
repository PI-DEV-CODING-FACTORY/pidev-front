import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParticipantService } from '../../../services/participant.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-participants-page',
  imports: [CommonModule],
  templateUrl: './participants-page.component.html',
  styleUrl: './participants-page.component.css'
})
export class ParticipantsPageComponent {
  participants: any[] = [];
  eventId!: number;
  sortDirection: boolean = true; 
  
  constructor(
    private route: ActivatedRoute,
    private participantService: ParticipantService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.loadParticipants(this.eventId);
  }

  loadParticipants(eventId: number): void {
    this.participantService.getParticipant(eventId).subscribe({
      next: (data) => {
        console.log('Données reçues:', data);  // Ajoute ceci pour vérifier les données
        this.participants = data;  // Pas de tri ici
      },
      error: (error) => {
        console.error('Erreur lors du chargement des participants', error);
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
    participant.selected = !participant.selected;  // Inverse l'état sélectionné
  }

  getSelectedEmails(): string[] {  // La fonction doit renvoyer un tableau de chaînes de caractères
    return this.participants
      .filter(participant => participant.selected)  // Filtrer les participants sélectionnés
      .map(participant => participant.participant.email);  // Récupérer l'email des participants sélectionnés
  }
  
   // Fonction pour envoyer les emails via le service Angular
   sendEmails(): void {
    const selectedEmails = this.getSelectedEmails();
    if (selectedEmails.length > 0) {
      // Envoi de l'email pour chaque participant sélectionné
      this.participants
        .filter(participant => selectedEmails.includes(participant.participant.email))
        .forEach(participant => {
          const participantData = {
            name: participant.participant.name,
            email: participant.participant.email
          };

          // Envoie de l'email avec le QR code et le design personnalisé
          this.participantService.sendEmailWithDesign(selectedEmails, participantData).subscribe({
            next: (response) => {
              console.log('Email envoyé avec succès:', response);
              alert('Les emails ont été envoyés avec succès!');
            },
            error: (error) => {
              console.error('Erreur lors de l\'envoi de l\'email:', error);
            }
          });
        });
    } else {
      alert('Veuillez sélectionner au moins un participant.');
    }
  }
}
