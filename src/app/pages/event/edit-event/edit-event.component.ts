import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { FormsModule } from '@angular/forms';
import { EventType, MyEvent } from '../../../models/event.model';

@Component({
  selector: 'app-edit-event',
  imports: [FormsModule],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent implements OnInit {
  event: MyEvent = {
    id: 0,
    title: '',
    eventDate: '',
    description: '',
    status: 'PENDING',
    eventType:EventType.WORKSHOP, // Type de l'événement (Workshop, Seminar, etc.)
    location: '',     // Lieu de l'événement
    capacity: 0,      // Capacité maximale
    objectives: '',   // Objectifs de l'événement
    prizes: '0'          // Prix en euros
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.eventService.getEventById(id).subscribe(
        (data) => {
          this.event = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération de l’événement:', error);
        }
      );
    }
  }

  updateEvent() {
    if (this.event.id) {
      this.eventService.updateEvent(this.event.id, this.event).subscribe(
        (response) => {
          console.log('Événement mis à jour !', response);
          this.router.navigate(['/event/view']);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l’événement:', error);
        }
      );
    }
  }
}