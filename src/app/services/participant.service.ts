import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventParticipant } from '../pages/event/EventParticipant';
import { jsPDF } from 'jspdf';
import * as QRCode from 'qrcode';
import { Participant } from '../models/participant.model';
import { environment } from '../../environments/environment';
import { EventParticipant as EventParticipantModel } from '../models/event-participant.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private apiUrl = `${environment.apiUrl}/participants`;
  private emailUrl = 'http://localhost:8089/api/emails';  // Changed from aiUrl to emailUrl
  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events`);
  }

  participate(eventId: number, name: string, email: string, answers: string[]): Observable<any> {
    const url = `http://localhost:8089/examen/participate/${eventId}?name=${name}&email=${email}`;
    
    return this.http.post(url, answers, { responseType: 'text' }); // <== Accepte du texte au lieu de JSON
  }
   // Méthode pour récupérer les questions pour un événement
   getQuestions(eventId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/questions/${eventId}`);
  }

  submitAnswers(participantData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/answers`, participantData);
  }
  getParticipants(eventId: number): Observable<EventParticipant[]> {
    return this.http.get<EventParticipant[]>(`http://localhost:8089/examen/event/${eventId}`);
  }

  getParticipantsApproved(eventId: number): Observable<EventParticipant[]> {
    return this.http.get<EventParticipant[]>(`http://localhost:8089/examen/event/${eventId}/approved`);
  }
  // Sauvegarder la moyenne des notes pour un participant
  saveParticipantScore(participantId: number, average: number): Observable<any> {
    const body = {
      participantId,
      averageScore: average
    };

    return this.http.post(`${this.apiUrl}/${participantId}/score`, body);
  }
  getAverageScore(participantId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${participantId}/average-score`);
  }
  getParticipant(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8089/examen/event/${eventId}`);
  }
   // Méthode pour envoyer un email aux participants sélectionnés
   sendEmail(emails: string[], subject: string, message: string): Observable<any> {
    const emailRequest = {
      emails: emails,
      subject: subject,
      message: message
    };
   
    return this.http.post(this.emailUrl, emailRequest);
  }
   // Fonction pour générer le QR Code en base64
   generateQRCode(participantData: any): Promise<string> {
    const qrCodeData = `Nom : ${participantData.name}\nEmail : ${participantData.email}`;
    return QRCode.toDataURL(qrCodeData);  // Génère une URL en base64
  }
  generatePDF(participantData: any): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const doc = new jsPDF();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text("Récapitulatif de participation", 20, 20);

      // Informations sur le participant
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Nom : ${participantData.name}`, 20, 30);
      doc.text(`Email : ${participantData.email}`, 20, 40);

      // Générer un QR Code
      const qrCodeData = `Nom : ${participantData.name}\nEmail : ${participantData.email}`;  // Données pour le QR code

      QRCode.toDataURL(qrCodeData).then((qrCodeUrl: string) => {
        // Ajouter l'image du QR code dans le PDF
        doc.addImage(qrCodeUrl, 'PNG', 150, 30, 50, 50);  // Position et taille du QR code

        // Enregistrer le PDF dans un Blob pour l'envoyer par email
        const pdfBlob = doc.output('blob');
        resolve(pdfBlob);  // Résoudre la promesse avec le blob du PDF
      }).catch(err => {
        reject('Erreur lors de la génération du QR code: ' + err);
      });
    });
  }
  sendEmailWithPDF(participantData: any, selectedEmails: string[]): void {
    this.generatePDF(participantData).then((pdfBlob) => {
      const formData = new FormData();
      formData.append('emails', JSON.stringify(selectedEmails));  // Liste des emails
      formData.append('pdf', pdfBlob, 'participant_info.pdf');  // Ajouter le PDF en pièce jointe

      // Envoi du formulaire avec l'email et le fichier PDF à l'API backend
      this.http.post(this.emailUrl, formData).subscribe({
        next: (response) => {
          console.log('Email envoyé avec succès:', response);
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi de l\'email:', error);
        }
      });
    }).catch((error) => {
      console.error('Erreur de génération du PDF:', error);
    });
  }
   generateQRCodeBase64(data:any) {
    return QRCode.toDataURL(data, { errorCorrectionLevel: 'H' })
      .then(url => {
        return url; // URL en base64
      })
      .catch(error => {
        console.error('Erreur lors de la génération du QR code :', error);
        throw error;
      });
  }
   // Fonction pour envoyer l'email avec le QR Code inclus dans le message HTML
   sendEmailWithDesign(emails: string[], participantData: any, eventId: number, participationId: number): Observable<any> {
    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
          <table style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #ccc; box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="text-align: center; padding: 20px; background-color: #4CAF50; border-radius: 8px 8px 0 0;">
                <h2 style="color: #ffffff; font-size: 28px; font-weight: bold;">Votre Inscription à l'Événement</h2>
                <p style="font-size: 16px; color: #ffffff;">Bonjour ${participantData.name},</p>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding: 20px; background-color: #ffffff;">
                <p style="font-size: 18px; color: #333333; font-weight: bold;">Voici votre récapitulatif de participation :</p>
                <ul style="font-size: 16px; color: #555555; list-style-type: none; padding-left: 0; text-align: left; margin-top: 10px;">
                  <li><strong>Nom :</strong> ${participantData.name}</li>
                  <li><strong>Email :</strong> ${participantData.email}</li>
                  <li><strong>ID Événement :</strong> ${eventId}</li>
                  <li><strong>ID Participation :</strong> ${participationId}</li>
                </ul>
                <p style="font-size: 16px; color: #555555; margin-top: 20px;">Nous avons bien pris en compte votre inscription.</p>
                <p style="font-size: 14px; color: #777777; margin-top: 20px;">Ceci est un message généré automatiquement.</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    return this.http.post(`${this.emailUrl}/send`, {
      emails: emails,
      subject: 'Confirmation de participation',
      message: emailHtml,
      id: participationId
    });
  }
  
  // Update participant's decision
  updateParticipantDecision(participantId: number, decision: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${participantId}/decision`, { decision });
  }

  // Get participant by email
  getParticipantByEmail(email: string): Observable<Participant> {
    return this.http.get<Participant>(`${this.apiUrl}/email/${email}`);
  }

  getParticipantsByEventAndApproved(eventId: number): Observable<EventParticipantModel[]> {
    console.log(`Fetching approved participants for event ${eventId} from: http://localhost:8089/examen/event/${eventId}/approved`);
    return this.http.get<EventParticipantModel[]>(`http://localhost:8089/examen/event/${eventId}/approved`);
  }
}
