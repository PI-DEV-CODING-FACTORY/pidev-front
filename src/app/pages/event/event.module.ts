import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EVENT_ROUTES } from './event.routes'; 
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';

// Services
import { EventService } from '../../services/event.service'; 
import { InternshipService } from '../../services/internship.service';
import { ProposalService } from '../../services/proposal.service';

@NgModule({
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(EVENT_ROUTES)
  ],
  providers: [
    EventService
  ]
})
export class EventModule { }