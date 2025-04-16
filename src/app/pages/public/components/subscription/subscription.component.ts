import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { InscriptionService } from '../../services/inscription.service';
import { Inscription } from '../../../../models/Inscription';
import { Router } from '@angular/router';

interface MaritalStatus {
  label: string;
  value: string;
}

interface HealthStatus {
  label: string;
  value: string;
}

// Add this import

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
    DropdownModule,
    StepsModule,
    CheckboxModule
  ],
  templateUrl: './subscription.component.html',
  providers: [MessageService]
})
export class SubscriptionComponent implements OnInit {
    isSubmitting: boolean = false;
    degreeFileName: string = '';
    degreeFile: File | null = null;
    transcriptsFileName: string = '';
    maxDate: Date = new Date();
    activeIndex: number = 0;
    
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
    loading: boolean = false;

    items: MenuItem[] = [
        { label: 'Informations Personnelles' },
        { label: 'Documents Académiques' },
        { label: 'Confirmation' }
    ];

    // Update the constructor
    constructor(
      private fb: FormBuilder,
      private messageService: MessageService,
      private inscriptionService: InscriptionService,
      private router: Router
    ) {}

    ngOnInit() {
        this.maxDate = new Date();
        this.subscriptionForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            personalEmail: ['', [Validators.required, Validators.email]],
            confirmEmail: ['', [Validators.required, Validators.email]],
            dateOfBirth: ['', Validators.required],
            maritalStatus: ['', Validators.required],
            healthStatus: ['SAFE'],
            healthDescription: [''],
            lastDiploma: ['', Validators.required],
            institution: ['', Validators.required],
            academicDescription: [''],
            phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
            city: ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
            address: ['', Validators.required],
            legalConsent: [false, Validators.requiredTrue]
        }, {
            validators: this.emailMatchValidator()
        });
    }

    private emailMatchValidator(): ValidatorFn {
        return (formGroup: AbstractControl): { [key: string]: any } | null => {
            const email = formGroup.get('personalEmail');
            const confirmEmail = formGroup.get('confirmEmail');

            if (email?.value !== confirmEmail?.value) {
                confirmEmail?.setErrors({ emailMismatch: true });
                return { emailMismatch: true };
            } else {
                confirmEmail?.setErrors(null);
                return null;
            }
        };
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

    // Update the onSubmit method's success handler
    onSubmit() {
        if (this.subscriptionForm.valid) {
            if (!this.degreeFile) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Diploma file is required'
                });
                return;
            }

            this.isSubmitting = true;
            
            const formData = this.subscriptionForm.value;
            const inscription: Inscription = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                personalEmail: formData.personalEmail,
                phoneNumber: formData.phoneNumber,
                dateOfBirth: formData.dateOfBirth,
                maritalStatus: formData.maritalStatus,
                address: formData.address,
                city: formData.city,
                zipCode: Number(formData.postalCode)
            };
        
            this.inscriptionService.createInscription(inscription, this.degreeFile)
                .subscribe({
                    next: (response) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Registration submitted successfully'
                        });
                        this.isSubmitting = false;
                        // Add delay to show the success message before redirecting
                        setTimeout(() => {
                            this.router.navigate(['/']);  // Navigate to landing page
                        }, 1500);
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to submit registration'
                        });
                        this.isSubmitting = false;
                    }
                });
        }
    }

    nextStep() {
        if (this.activeIndex === 0 && !this.isStep1Valid()) {
            this.markStep1AsTouched();
            return;
        }
        
        if (this.activeIndex === 1 && !this.isStep2Valid()) {
            this.markStep2AsTouched();
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez compléter tous les champs requis'
            });
            return;
        }
        
        if (this.activeIndex < 2) {
            this.activeIndex++;
        }
    }

    prevStep() {
        if (this.activeIndex > 0) {
            this.activeIndex--;
        }
    }

    isStep1Valid(): boolean {
        const step1Controls = [
            'firstName',
            'lastName',
            'personalEmail',
            'confirmEmail',
            'phoneNumber',
            'dateOfBirth',
            'maritalStatus',
            'city',
            'address',
            'postalCode'
        ];

        const basicValid = step1Controls.every(controlName => {
            const control = this.subscriptionForm.get(controlName);
            return control && control.valid;
        });

        const emailMatch = this.subscriptionForm.get('personalEmail')?.value === 
                          this.subscriptionForm.get('confirmEmail')?.value;

        return basicValid && emailMatch;
    }

    isStep2Valid(): boolean {
        const step2Controls = [
            'lastDiploma',
            'institution'
        ];
        
        const formValid = step2Controls.every(controlName => {
            const control = this.subscriptionForm.get(controlName);
            return control && control.valid;
        });
        
        const fileValid = !!this.degreeFileName;
        
        return formValid && fileValid;
    }

    isFormValid(): boolean {
        return this.isStep1Valid() && 
               this.isStep2Valid() && 
               this.subscriptionForm.get('legalConsent')?.value === true;
    }

    private markStep1AsTouched() {
        const step1Controls = [
            'firstName', 'lastName', 'personalEmail', 'confirmEmail',
            'phoneNumber', 'dateOfBirth', 'maritalStatus',
            'city', 'address', 'postalCode'
        ];
        
        step1Controls.forEach(controlName => {
            this.subscriptionForm.get(controlName)?.markAsTouched();
        });
    }

    private markStep2AsTouched() {
        const step2Controls = ['lastDiploma', 'institution'];
        step2Controls.forEach(controlName => {
            this.subscriptionForm.get(controlName)?.markAsTouched();
        });
    }

    private markAllAsTouched() {
        Object.values(this.subscriptionForm.controls).forEach(control => {
            control.markAsTouched();
        });
    }
}