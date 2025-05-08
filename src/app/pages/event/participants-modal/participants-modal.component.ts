import { Component, Inject, NgModule } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventParticipant } from '../EventParticipant';
import { CommonModule } from '@angular/common';
import { ParticipantService } from '../../../services/participant.service';
import { FormsModule, NgModel } from '@angular/forms';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-participants-modal',
  imports: [CommonModule,FormsModule],
  templateUrl: './participants-modal.component.html',
  styleUrl: './participants-modal.component.css'
})
export class ParticipantsModalComponent {
  participantScores: number[] = []; 
  eventId: number;
  // Déclare les propriétés pour l'événement et les participants
  participants: EventParticipant[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ParticipantsModalComponent>, private ps: ParticipantService) {
    this.eventId = data.eventId;
    this.participants = data.participants;
  }

  ngOnInit(): void {
    // Récupérer les questions depuis le service
    this.ps.getQuestions(this.eventId).subscribe((questions: string[]) => {
      this.questions = questions;
       // Initialiser le tableau de notes pour chaque participant (par défaut à 0)
       this.participants.forEach(() => {
        this.participantNotes.push([]); // Chaque participant a un tableau de notes
      });
    });
    this.loadParticipantScores();
  }
  loadParticipantScores() {
    this.participants.forEach((eventParticipant, index) => {
      this.ps.getAverageScore(eventParticipant.participant.id)
        .pipe(take(1)) // Prend seulement une valeur et évite les abonnements multiples
        .subscribe(score => {
          this.participantScores[index] = score;
        });
    });
  }
  isNoted(id:number): boolean{
    return this.participantScores[id] !== undefined && this.participantScores[id] !== null;
  }
   // Fonction pour mettre à jour la note pour une réponse
   updateNote(participantIndex: number, answerIndex: number, note: number): void {
    this.participantNotes[participantIndex][answerIndex] = note;  // Mise à jour de la note
  }
    // Calcul de la moyenne des notes pour un participant
    calculateAverage(participantIndex: number): number {
      const notes = this.participantNotes[participantIndex];
      const total = notes.reduce((sum, note) => sum + note, 0);
      return total / notes.length;  // Calcul de la moyenne
    }
      // Sauvegarder la moyenne des notes pour chaque participant
  saveParticipantScores(): void {
    this.participants.forEach((participant, index) => {
      const average = this.calculateAverage(index);  // Moyenne des notes pour ce participant
      // Envoi de la moyenne au backend
      this.ps.saveParticipantScore(participant.id, average).subscribe({
        next: () => {
          console.log(`Moyenne des notes pour le participant ${participant.participant.name} sauvegardée`);
        },
        error: (err) => {
          console.error('Erreur lors de la sauvegarde des notes:', err);
        }
      });
    });
  }
  saveSingleParticipantScore(participantIndex: number): void {
    const participant = this.participants[participantIndex];
    const average = this.calculateAverage(participantIndex);  // Calcul de la moyenne des notes
  
    // Vérification si la moyenne est valide avant l'envoi
    if (isNaN(average) || average === null || average === undefined || average === 0) {
      console.error('La moyenne des notes est invalide pour le participant', participant.participant?.name);
      return;  // On ne fait rien si la moyenne est invalide
    }
    console.log("moyene valide ", average)
    // Envoi de la moyenne au backend pour ce participant
    this.ps.saveParticipantScore(participant.id, average).subscribe({
      next: () => {
        console.log(`Moyenne des notes pour le participant ${participant.participant?.name} sauvegardée`);
      },
      error: (err) => {
        console.error('Erreur lors de la sauvegarde des notes:', err);
      }
    });
  }
  getParticipantScore(participantId: number): Observable<number> {
    const participant = this.participants[participantId];
    return this.ps.getAverageScore(participant.id);
}
  // Fonction pour fermer le modal
  close(): void {
    this.dialogRef.close();
  }
  questions: string[] = []; // Tableau pour stocker les questions
  participantNotes: number[][] = [];  // Tableau de notes pour chaque participant et chaque réponse

}
