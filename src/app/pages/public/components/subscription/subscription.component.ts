import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { InscriptionService } from '../../../service/inscription.service';
import { MessageService } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';

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
    DropdownModule,
    StepsModule,
    CheckboxModule
  ],
  styleUrls: ['./subscription.component.css'],
  templateUrl: './subscription.component.html',
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
    private messageService: MessageService
  ) {}

  // Update the ngOnInit method
  // Add this validator function in the component class
  private emailMatchValidator(): ValidatorFn {
      return (formGroup: AbstractControl): ValidationErrors | null => {
          const email = formGroup.get('personalEmail');
          const confirmEmail = formGroup.get('confirmEmail');
  
          if (email && confirmEmail && email.value !== confirmEmail.value) {
              confirmEmail.setErrors({ emailMismatch: true });
              return { emailMismatch: true };
          }
  
          return null;
      };
  }
  
  ngOnInit() {
      this.maxDate = new Date();
      this.subscriptionForm = this.fb.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          personalEmail: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', [Validators.required, Validators.email]], // Add this line
          dateOfBirth: ['', Validators.required],
          maritalStatus: ['', Validators.required],
          healthStatus: [''],
          healthDescription: [''],
          bachelorDegree: ['', Validators.required],
          lastDiploma: ['', Validators.required],
          institution: ['', Validators.required],
          academicDescription: [''],
          notesDocument: [null],
          phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]], // Validates 8-digit phone numbers
          city: ['', Validators.required],
          postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]], // For 4-digit postal codes
          address: ['', Validators.required],
          legalConsent: [false, Validators.requiredTrue]
      }, {
          validators: this.emailMatchValidator() // Add this line
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

    activeIndex: number = 0;
    items: MenuItem[] = [
        { label: 'Informations Personnelles' },
        { label: 'Documents Académiques' },
        { label: 'Informations des Parents' },
        { label: 'Confirmation' }
    ];

    nextStep() {
        this.activeIndex++;
    }

    prevStep() {
        this.activeIndex--;
    }

    isStep1Valid(): boolean {
        const form = this.subscriptionForm;
        return !!(
            form.get('firstName')?.valid &&
            form.get('lastName')?.valid &&
            form.get('personalEmail')?.valid &&
            form.get('confirmEmail')?.valid &&
            form.get('phoneNumber')?.valid &&
            form.get('dateOfBirth')?.valid &&
            form.get('maritalStatus')?.valid &&
            form.get('city')?.valid &&
            form.get('address')?.valid &&
            form.get('postalCode')?.valid
        );
    }
}
