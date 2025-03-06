import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PFE_ROUTES } from './pfe.routes';

// Services
import { PfeService } from '../../services/pfe.service';
import { InternshipService } from '../../services/internship.service';
import { ProposalService } from '../../services/proposal.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PFE_ROUTES)
  ],
  providers: [
    PfeService,
    InternshipService,
    ProposalService
  ]
})
export class PfeModule { } 