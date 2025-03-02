import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PfeService } from '../../../services/pfe.service';
import { Pfe, PfeStatus } from '../../../models/pfe.model';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-add-pfe',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextarea,
    DropdownModule,
    CalendarModule,
    ButtonModule,
    ToastModule,
    CardModule,
    DividerModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h5>Add New PFE Project</h5>
          <p>Fill in the details of your PFE (Projet de Fin d'Études) project.</p>
          
          <form [formGroup]="pfeForm" (ngSubmit)="onSubmit()">
            <div class="grid formgrid p-fluid">
              <div class="field col-12 md:col-6">
                <label for="title">Project Title*</label>
                <input pInputText id="title" type="text" formControlName="title" />
                <small *ngIf="pfeForm.get('title')?.invalid && pfeForm.get('title')?.touched" class="p-error">
                  Project title is required
                </small>
              </div>
              
              <div class="field col-12 md:col-6">
                <label for="company">Company*</label>
                <input pInputText id="company" type="text" formControlName="company" />
                <small *ngIf="pfeForm.get('company')?.invalid && pfeForm.get('company')?.touched" class="p-error">
                  Company name is required
                </small>
              </div>
              
              <div class="field col-12">
                <label for="description">Project Description*</label>
                <textarea pInputTextarea id="description" formControlName="description" rows="5"></textarea>
                <small *ngIf="pfeForm.get('description')?.invalid && pfeForm.get('description')?.touched" class="p-error">
                  Project description is required (minimum 50 characters)
                </small>
              </div>
              
              <div class="field col-12 md:col-6">
                <label for="startDate">Start Date*</label>
                <p-calendar id="startDate" formControlName="startDate" [showIcon]="true" dateFormat="dd/mm/yy"></p-calendar>
                <small *ngIf="pfeForm.get('startDate')?.invalid && pfeForm.get('startDate')?.touched" class="p-error">
                  Start date is required
                </small>
              </div>
              
              <div class="field col-12 md:col-6">
                <label for="endDate">End Date*</label>
                <p-calendar id="endDate" formControlName="endDate" [showIcon]="true" dateFormat="dd/mm/yy"></p-calendar>
                <small *ngIf="pfeForm.get('endDate')?.invalid && pfeForm.get('endDate')?.touched" class="p-error">
                  End date is required
                </small>
              </div>
              
              <div class="field col-12 md:col-6">
                <label for="supervisor">Supervisor*</label>
                <input pInputText id="supervisor" type="text" formControlName="supervisor" />
                <small *ngIf="pfeForm.get('supervisor')?.invalid && pfeForm.get('supervisor')?.touched" class="p-error">
                  Supervisor name is required
                </small>
              </div>
              
              <div class="field col-12 md:col-6">
                <label for="technologies">Technologies*</label>
                <input pInputText id="technologies" type="text" formControlName="technologies" placeholder="Enter technologies (comma separated)" />
                <small *ngIf="pfeForm.get('technologies')?.invalid && pfeForm.get('technologies')?.touched" class="p-error">
                  At least one technology is required
                </small>
              </div>
              
              <div class="field col-12">
                <p-divider></p-divider>
              </div>
              
              <div class="field col-12">
                <button pButton type="submit" label="Submit PFE Project" [disabled]="pfeForm.invalid" class="p-button-primary"></button>
                <button pButton type="button" label="Cancel" class="p-button-secondary ml-2" (click)="cancel()"></button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <p-toast></p-toast>
  `
})
export class AddPfeComponent implements OnInit {
  pfeForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private pfeService: PfeService,
    private router: Router,
    private messageService: MessageService
  ) {}
  
  ngOnInit() {
    this.initForm();
  }
  
  initForm() {
    this.pfeForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      technologies: [[], [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      supervisor: ['', [Validators.required]],
      company: ['', [Validators.required]]
    });
  }
  
  onSubmit() {
    if (this.pfeForm.invalid) {
      this.pfeForm.markAllAsTouched();
      return;
    }
    
    const pfeData: Pfe = {
      ...this.pfeForm.value,
      status: PfeStatus.PENDING
    };
    
    this.pfeService.createPfe(pfeData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'PFE project has been submitted successfully!'
        });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to submit PFE project. Please try again.'
        });
        console.error('Error creating PFE:', error);
      }
    });
  }
  
  cancel() {
    this.router.navigate(['/dashboard']);
  }
} 