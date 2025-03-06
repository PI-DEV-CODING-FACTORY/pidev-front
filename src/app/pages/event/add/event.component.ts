import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EventService } from '../../../services/event.service'; 
//import { Event, EventType } from '../../models/event.model';
import { Event, EventType } from '../../../models/event.model'; 
import { NgIf, NgFor } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// ✅ Import Material Components Directly
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
  selector: 'app-event-form',
  standalone: true, // ✅ Enables standalone component mode
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css',
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
   // NgIf,
    NgFor,
    MatInputModule,  // ✅ Add Material Modules
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class EventFormComponent {
  eventForm: FormGroup;
  eventTypes = Object.values(EventType);

  constructor(private fb: FormBuilder, private eventService: EventService, private snackBar: MatSnackBar) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      eventDate: ['', Validators.required],
      location: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      objectives: ['', Validators.required],
      eventType: ['', Validators.required],
      prizes: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.eventForm.valid) {
      const formValues = this.eventForm.value;
      const formattedEvent = {
        ...formValues,
        eventDate: new Date(formValues.eventDate).toISOString()
      };
      
      this.eventService.addEvent(formattedEvent).subscribe({
        next: (response) => {
          this.snackBar.open('Event created successfully! 🎉', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          // Reset form after successful creation
          this.eventForm.reset();
          // Reset form controls to their initial state
          Object.keys(this.eventForm.controls).forEach(key => {
            const control = this.eventForm.get(key);
            control?.setErrors(null);
          });
        },
        error: (error) => {
          this.snackBar.open('Error creating event! Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
 
  
  }
  
}
