import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { InscriptionService } from '../../../service/inscription.service';
import { MessageService } from 'primeng/api';

interface MaritalStatus {
  label: string;
  value: string;
}

interface HealthStatus {
  label: string;
  value: string;
}

// Update the styles section
@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    FileUploadModule,
    ToastModule,
    RippleModule,
    DividerModule,
    DropdownModule
  ],
  styles: [`
    ::ng-deep .p-datepicker-touch-ui {
      min-width: 300px !important;
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
    }
  `],
  template: `
  <p-toast></p-toast>
        <div class="min-h-screen bg-surface-50 dark:bg-surface-900">
            <!-- Header Section with Background -->
            <div class="bg-primary py-12 px-4 md:px-6 lg:px-8 mb-8">
                <div class="text-center">
                    <div class="text-white font-bold mb-3 text-5xl">Inscription Étudiant</div>
                    <div class="text-white text-2xl font-medium mb-2">Licence (Bac + 3)</div>
                    <span class="text-white text-xl font-light">Commencez votre parcours avec nous</span>
                </div>
            </div>
        
        <!-- Form Section -->
        <div class="px-4 md:px-6 lg:px-8 mx-auto" style="max-width: 800px; margin-top: -4rem;">
                <div class="surface-card p-8 shadow-2 border-round-2xl">
                    <form [formGroup]="subscriptionForm" (ngSubmit)="onSubmit()">
                        <!-- Progress Steps -->
                        <div class="flex align-items-center justify-content-center mb-8">
                            <div class="surface-card px-3 py-2 border-round-2xl shadow-1">
                                <span class="text-primary font-medium">Informations Personnelles</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-4">
                            <!-- First Name -->
                            <div class="col-span-12 md:col-span-6">
                                <label for="firstName" class="block text-900 font-medium mb-2">
                                    <i class="pi pi-user mr-2"></i>Prénom
                                </label>
                                <input 
                                    id="firstName" 
                                    type="text" 
                                    pInputText 
                                    class="w-full" 
                                    formControlName="firstName"
                                    placeholder="Entrez votre prénom"
                                    [ngClass]="{'ng-invalid ng-dirty': subscriptionForm.get('firstName')?.invalid && subscriptionForm.get('firstName')?.touched}"
                                />
                                <small class="text-red-500" *ngIf="subscriptionForm.get('firstName')?.invalid && subscriptionForm.get('firstName')?.touched">
                                    Le prénom est requis
                                </small>
                            </div>

                            <!-- Last Name -->
                            <div class="col-span-12 md:col-span-6">
                                <label for="lastName" class="block text-900 font-medium mb-2">
                                    <i class="pi pi-user mr-2"></i>Nom
                                </label>
                                <input 
                                    id="lastName" 
                                    type="text" 
                                    pInputText 
                                    class="w-full" 
                                    formControlName="lastName"
                                    placeholder="Entrez votre nom"
                                    [ngClass]="{'ng-invalid ng-dirty': subscriptionForm.get('lastName')?.invalid && subscriptionForm.get('lastName')?.touched}"
                                />
                                <small class="text-red-500" *ngIf="subscriptionForm.get('lastName')?.invalid && subscriptionForm.get('lastName')?.touched">
                                    Le nom est requis
                                </small>
                            </div>

                            <!-- Email -->
                            <div class="col-span-12">
                                <label for="email" class="block text-900 font-medium mb-2">
                                    <i class="pi pi-envelope mr-2"></i>Adresse Email
                                </label>
                                <input 
                                    id="email" 
                                    type="email" 
                                    pInputText 
                                    class="w-full" 
                                    formControlName="personalEmail"
                                    placeholder="Entrez votre adresse email"
                                    [ngClass]="{'ng-invalid ng-dirty': subscriptionForm.get('personalEmail')?.invalid && subscriptionForm.get('personalEmail')?.touched}"
                                />
                                <small class="text-red-500" *ngIf="subscriptionForm.get('personalEmail')?.invalid && subscriptionForm.get('personalEmail')?.touched">
                                    Veuillez entrer une adresse email valide
                                </small>
                            </div>

                            <!-- Date of Birth -->
                            <div class="col-span-12">
                                <label for="dateOfBirth" class="block text-900 font-medium mb-2">
                                    <i class="pi pi-calendar mr-2"></i>Date de Naissance
                                </label>
                                <p-calendar 
                                    id="dateOfBirth" 
                                    formControlName="dateOfBirth"
                                    [showIcon]="true"
                                    dateFormat="dd/mm/yy"
                                    [maxDate]="maxDate"
                                    [style]="{ width: '100%' }"
                                    [inputStyle]="{ width: '100%' }"
                                    [touchUI]="true"
                                    placeholder="Sélectionnez votre date de naissance"
                                    [ngClass]="{'ng-invalid ng-dirty': subscriptionForm.get('dateOfBirth')?.invalid && subscriptionForm.get('dateOfBirth')?.touched}"
                                ></p-calendar>
                                <small class="text-red-500" *ngIf="subscriptionForm.get('dateOfBirth')?.invalid && subscriptionForm.get('dateOfBirth')?.touched">
                                    La date de naissance est requise
                                </small>
                            </div>

                            <!-- Marital Status -->
                            <div class="col-span-12 md:col-span-6">
                                <label for="maritalStatus" class="block text-900 font-medium mb-2">
                                    <i class="pi pi-heart mr-2"></i>Situation Familiale
                                </label>
                                <p-dropdown
                                    id="maritalStatus"
                                    formControlName="maritalStatus"
                                    [options]="maritalStatusOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Sélectionnez votre situation"
                                    [style]="{'width':'100%'}"
                                    [ngClass]="{'ng-invalid ng-dirty': subscriptionForm.get('maritalStatus')?.invalid && subscriptionForm.get('maritalStatus')?.touched}"
                                ></p-dropdown>
                                <small class="text-red-500" *ngIf="subscriptionForm.get('maritalStatus')?.invalid && subscriptionForm.get('maritalStatus')?.touched">
                                    La situation familiale est requise
                                </small>
                            </div>

                            <!-- Health Status -->
                            <div class="col-span-12">
                                <label for="healthStatus" class="block text-900 font-medium mb-2">
                                    <i class="pi pi-heart-fill mr-2"></i>État de Santé
                                </label>
                                <p-dropdown
                                    id="healthStatus"
                                    formControlName="healthStatus"
                                    [options]="healthStatusOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Sélectionnez votre état de santé"
                                    [style]="{'width':'100%'}"
                                ></p-dropdown>
                            </div>

                            <!-- Health Description (conditional) -->
                            <div class="col-span-12" *ngIf="subscriptionForm.get('healthStatus')?.value === 'DIABETIC'">
                                <label for="healthDescription" class="block text-900 font-medium mb-2">
                                    <i class="pi pi-info-circle mr-2"></i>Description de l'État de Santé
                                </label>
                                <textarea
                                    id="healthDescription"
                                    pInputTextarea
                                    class="w-full"
                                    formControlName="healthDescription"
                                    placeholder="Veuillez décrire votre condition"
                                    rows="3"
                                ></textarea>
                            </div>

                            <div class="col-span-12 mt-4">
                                <p-divider>
                                    <span class="text-900 font-medium">Documents Académiques</span>
                                </p-divider>
                            </div>

                            <!-- Bachelor Degree Upload -->
                            <div class="col-span-12">
                                <label class="block text-900 font-medium mb-2">
                                    <i class="pi pi-file-pdf mr-2"></i>Diplôme de Baccalauréat
                                </label>
                                <div class="flex align-items-center gap-3">
                                    <p-fileUpload
                                        #degreeUpload
                                        mode="basic"
                                        chooseLabel="Télécharger le Diplôme "
                                        [maxFileSize]="1000000"
                                        accept="application/pdf,image/*"
                                        [auto]="true"
                                        [customUpload]="true"
                                        (uploadHandler)="onDegreeUpload($event)"
                                    ></p-fileUpload>
                                    <div *ngIf="degreeFileName" class="flex align-items-center gap-2">
                                        <i class="pi pi-file text-primary"></i>
                                        <span class="text-600">{{degreeFileName}}</span>
                                    </div>
                                </div>
                                <small class="text-600 block mt-2">Taille max: 1MB. Formats acceptés: PDF, Images(jpg, jpeg)</small>
                            </div>

                            <!-- Grades/Transcripts Upload -->
                            <div class="col-span-12">
                                <label class="block text-900 font-medium mb-2">
                                    <i class="pi pi-file mr-2"></i>Relevé de Notes
                                </label>
                                <div class="flex align-items-center gap-3">
                                    <p-fileUpload
                                        #notesUpload
                                        mode="basic"
                                        chooseLabel="Télécharger le Relevé"
                                        [maxFileSize]="1000000"
                                        accept="application/pdf,image/*"
                                        [auto]="true"
                                        [customUpload]="true"
                                        (uploadHandler)="onNotesUpload($event)"
                                    ></p-fileUpload>
                                    <div *ngIf="transcriptsFileName" class="flex align-items-center gap-2">
                                        <i class="pi pi-file text-primary"></i>
                                        <span class="text-600">{{transcriptsFileName}}</span>
                                    </div>
                                </div>
                                <small class="text-600 block mt-2">Taille max: 1MB. Formats acceptés: PDF, Images(jpg, jpeg)</small>
                            </div>

                            <div class="col-span-12 mt-4">
                                <p-divider></p-divider>
                            </div>

                            <!-- Submit Button -->
                            <div class="col-span-12 flex justify-center mt-4">
                                <button 
                                    pButton 
                                    pRipple
                                    type="submit" 
                                    label="Soumettre la Candidature" 
                                    icon="pi pi-send"
                                    class="w-full md:w-auto font-bold"
                                    [loading]="isSubmitting"
                                    [disabled]="!subscriptionForm.valid || isSubmitting"
                                ></button>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Additional Information -->
                <div class="mt-8 text-center text-600">
                    <p class="mb-2">Besoin d'aide ? Contactez notre équipe support</p>
                    <p class="text-primary font-medium">support&#64;school.com</p>
                </div>
            </div>
        </div>


    
  `,
  providers: [MessageService]
})
export class SubscriptionComponent implements OnInit {
    isSubmitting: boolean = false;
    degreeFileName: string = '';
    degreeFile: File | null = null;
    transcriptsFileName: string = '';
    maxDate : Date = new Date();
    maritalStatusOptions: MaritalStatus[] = [
      { label: 'Célibataire', value: 'SINGLE' },
      { label: 'Marié(e)', value: 'MARRIED' },
      { label: 'Divorcé(e)', value: 'DIVORCED' },
      { label: 'Veuf/Veuve', value: 'WIDOWED' }
  ];
    healthStatusOptions: HealthStatus[] = [
      { label: 'Normal', value: 'SAFE' },
      { label: 'Diabétique', value: 'DIABETIC' }
  ];
    
    subscriptionForm!: FormGroup;
    loading: boolean = false;  // Add this line

  constructor(
    private fb: FormBuilder,
    private inscriptionService: InscriptionService,
    private messageService: MessageService
  ) {}

  // Update the ngOnInit method
  ngOnInit() {
      this.maxDate = new Date(); // Initialize maxDate
      this.subscriptionForm = this.fb.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          personalEmail: ['', [Validators.required, Validators.email]],
          dateOfBirth: ['', Validators.required],
          maritalStatus: ['', Validators.required], // Add maritalStatus control
          healthStatus: [''], // Add healthStatus control
          healthDescription: [''],
          bachelorDegree: ['', Validators.required],
          notesDocument: [null]
      });
  }

  onNotesDocumentSelect(event: any) {
    if (event.files && event.files[0]) {
      this.subscriptionForm.patchValue({
        notesDocument: event.files[0]
      });
    }
  }

  onSubmit() {
    if (this.subscriptionForm.valid) {
      const formData = this.subscriptionForm.value;
      // Handle form submission here
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Registration submitted successfully'
      });
    }
  }



  onDegreeUpload(event: any) {
    if (event.files && event.files.length > 0) {
        const file = event.files[0];
        this.degreeFileName = file.name;
        this.degreeFile = file;
        
        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Fichier sélectionné avec succès'
        });
    }
}
onNotesUpload(event:any){
  if (event.files && event.files.length > 0) {
    const file  = event.files[0];
    this.transcriptsFileName = file.name; 
    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Fichier sélectionné avec succès'
  });
  }
}
}
