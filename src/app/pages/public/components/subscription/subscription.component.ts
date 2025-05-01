import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { FileUpload } from 'primeng/fileupload';
import { InscriptionRequest } from '../../../../models/InscriptionRequest';

interface MaritalStatus {
  label: string;
  value: string;
}

interface HealthStatus {
  label: string;
  value: string;
}

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
    @ViewChild('diplomaUpload')
    diplomaUpload!: FileUpload;
    diplomaDocumentName: string = '';
    
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
            lastDiploma: ['BAC', Validators.required],
            institution: ['', Validators.required],
            academicDescription: [''],
            phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
            city: ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
            address: ['', Validators.required],
            legalConsent: [false, Validators.requiredTrue],
            diplomaDocument: [null]
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

    onDiplomaDocumentUpload(event: any) {
        if (event.files && event.files[0]) {
          const file = event.files[0];
          
          // Check file size (1MB = 1000000 bytes)
          if (file.size > 1000000) {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'La taille du fichier ne doit pas dépasser 1MB'
            });
            this.clearDiplomaDocument();
            return;
          }
      
          // Check file type
          const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
          if (!allowedTypes.includes(file.type)) {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Format de fichier non supporté'
            });
            this.clearDiplomaDocument();
            return;
          }
      
          this.subscriptionForm.patchValue({
            diplomaDocument: file
          });
          this.diplomaDocumentName = file.name;
        }
      }

    clearDiplomaDocument() {
        this.subscriptionForm.patchValue({
            diplomaDocument: null
        });
        this.diplomaDocumentName = '';
        if (this.diplomaUpload) {
            this.diplomaUpload.clear();
        }
    }

    onSubmit() {
        if (this.subscriptionForm.valid && this.diplomaDocumentName) {
            this.isSubmitting = true;
            
            const formValue = this.subscriptionForm.value;
            const formData = new FormData();
        
            // Append all form values
            formData.append('firstName', formValue.firstName);
            formData.append('lastName', formValue.lastName);
            formData.append('personalEmail', formValue.personalEmail);
            formData.append('phoneNumber', formValue.phoneNumber);
            
            // Handle date
            if (formValue.dateOfBirth) {
                formData.append('dateOfBirth', this.formatDate(formValue.dateOfBirth));
            }
            
            formData.append('maritalStatus', formValue.maritalStatus || '');
            formData.append('healthStatus', formValue.healthStatus || '');
            formData.append('address', formValue.address || '');
            formData.append('city', formValue.city || '');
            formData.append('zipCode', formValue.postalCode?.toString() || '');
            formData.append('courseId', 'DEFAULT');
            
            if (formValue.diplomaDocument) {
                formData.append('diplomaDocument', formValue.diplomaDocument);
            }

            this.inscriptionService.createInscription(formData).subscribe({
                next: (response) => {
                    this.isSubmitting = false; // Stop loading
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Votre inscription a été envoyée avec succès'
                    });
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                        this.router.navigate(['/']); // or wherever you want to redirect
                    }, 1500);
                },
                error: (error) => {
                    this.isSubmitting = false; // Stop loading on error too
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.error?.message || 'Une erreur est survenue lors de l\'inscription'
                    });
                },
                complete: () => {
                    this.isSubmitting = false; // Ensure loading is stopped in all cases
                }
            });
        }
    }
      
    private formatDate(date: any): string {
        if (date instanceof Date) {
          return date.toISOString().split('T')[0];
        }
        return new Date(date).toISOString().split('T')[0];
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
        const step2Controls = ['lastDiploma', 'institution'];
        const formValid = step2Controls.every(controlName => 
            this.subscriptionForm.get(controlName)?.valid
        );
        return formValid && !!this.diplomaDocumentName;
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