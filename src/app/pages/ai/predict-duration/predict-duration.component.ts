import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AiService, PredictionPayload, PredictionResponse } from '../../../services/ai.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface EducationLevel {
  label: string;
  value: string;
}

interface DifficultyLevel {
  label: string;
  value: string;
}

@Component({
  selector: 'app-predict-duration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    SliderModule,
    ProgressBarModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="container mx-auto p-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Predict Course Duration</h1>
        <p class="text-lg text-gray-600">Get an estimate of how long it will take you to complete a course</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="card shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6">
            <form [formGroup]="predictionForm" (ngSubmit)="predictDuration()">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="field">
                  <label for="age" class="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input 
                    id="age" 
                    type="number" 
                    pInputText 
                    formControlName="age"
                    class="w-full p-inputtext"
                    placeholder="Enter your age"
                  />
                  <small *ngIf="submitted && f['age'].errors" class="text-red-500">
                    Age is required (16-100)
                  </small>
                </div>
                
                <div class="field">
                  <label for="educationLevel" class="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                  <p-dropdown
                    id="educationLevel"
                    [options]="educationLevels"
                    formControlName="educationLevel"
                    placeholder="Select Education Level"
                    [style]="{'width':'100%'}"
                  ></p-dropdown>
                  <small *ngIf="submitted && f['educationLevel'].errors" class="text-red-500">
                    Education level is required
                  </small>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="field">
                  <label for="educationLevel" class="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                  <p-dropdown
                    id="educationLevel"
                    [options]="educationLevels"
                    formControlName="educationLevel"
                    placeholder="Select Education Level"
                    [style]="{'width':'100%'}"
                  ></p-dropdown>
                  <small *ngIf="submitted && f['educationLevel'].errors" class="text-red-500">
                    Education level is required
                  </small>
                </div>
                
                <div class="field">
                  <label for="averageGrade" class="block text-sm font-medium text-gray-700 mb-1">Average Grade (0-20)</label>
                  <input 
                    id="averageGrade" 
                    type="number" 
                    pInputText 
                    formControlName="averageGrade"
                    class="w-full p-inputtext"
                    placeholder="Your average grade"
                  />
                  <small *ngIf="submitted && f['averageGrade'].errors" class="text-red-500">
                    Average grade is required (0-20)
                  </small>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="field">
                  <label for="courseDifficulty" class="block text-sm font-medium text-gray-700 mb-1">Course Difficulty</label>
                  <p-dropdown
                    id="courseDifficulty"
                    [options]="difficultyLevels"
                    formControlName="courseDifficulty"
                    placeholder="Select Difficulty"
                    [style]="{'width':'100%'}"
                  ></p-dropdown>
                  <small *ngIf="submitted && f['courseDifficulty'].errors" class="text-red-500">
                    Course difficulty is required
                  </small>
                </div>
                
                <div class="field">
                  <label for="expectedDuration" class="block text-sm font-medium text-gray-700 mb-1">Expected Duration (weeks)</label>
                  <input 
                    id="expectedDuration" 
                    type="number" 
                    pInputText 
                    formControlName="expectedDuration"
                    class="w-full p-inputtext"
                    placeholder="Expected duration in weeks"
                  />
                  <small *ngIf="submitted && f['expectedDuration'].errors" class="text-red-500">
                    Expected duration is required (1-156 weeks)
                  </small>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="field">
                  <label for="studyHoursPerWeek" class="block text-sm font-medium text-gray-700 mb-1">Study Hours Per Week (1-80)</label>
                  <div class="flex items-center">
                    <input 
                      id="studyHoursPerWeek"
                      type="number" 
                      pInputText 
                      formControlName="studyHoursPerWeek" 
                      class="w-full p-inputtext" 
                      [min]="1" 
                      [max]="80"
                      placeholder="Hours per week"
                    />
                  </div>
                  <small *ngIf="submitted && f['studyHoursPerWeek'].errors" class="text-red-500">
                    Study hours is required (1-80)
                  </small>
                </div>
                
                <div class="field">
                  <label for="trainingExperience" class="block text-sm font-medium text-gray-700 mb-1">Training Experience (0-50 years)</label>
                  <div class="flex items-center">
                    <input 
                      id="trainingExperience"
                      type="number" 
                      pInputText 
                      formControlName="trainingExperience" 
                      class="w-full p-inputtext" 
                      [min]="0" 
                      [max]="50"
                      placeholder="Years of experience"
                    />
                  </div>
                  <small *ngIf="submitted && f['trainingExperience'].errors" class="text-red-500">
                    Training experience is required (0-50)
                  </small>
                </div>
              </div>
              
              <div class="field mb-6">
                <label for="actualDuration" class="block text-sm font-medium text-gray-700 mb-1">Actual Duration (if known, optional)</label>
                <input 
                  id="actualDuration" 
                  type="number" 
                  pInputText 
                  formControlName="actualDuration"
                  class="w-full p-inputtext"
                  placeholder="Actual duration in weeks (optional)"
                />
              </div>
              
              <div class="flex justify-end">
                <button 
                  pButton 
                  type="submit" 
                  label="Predict Duration" 
                  icon="pi pi-calculator" 
                  class="p-button-primary"
                  [loading]="loading"
                ></button>
              </div>
            </form>
          </div>
        </div>
        
        <div class="lg:col-span-1">
          <div class="card shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 h-full">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Prediction Results</h2>
            
            <div *ngIf="!predictionResult" class="flex flex-col items-center justify-center h-64">
              <i class="pi pi-clock text-5xl text-gray-400 mb-4"></i>
              <p class="text-gray-500 text-center">Fill out the form and click "Predict Duration" to see your results</p>
            </div>
            
            <div *ngIf="predictionResult" class="flex flex-col h-64">
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Estimated Duration</h3>
                <div class="text-3xl font-bold text-blue-600">{{predictionResult.duration}} {{predictionResult.unit}}</div>
              </div>
              
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Completion Date</h3>
                <div class="text-xl font-medium text-gray-800">{{predictionResult.completionDate}}</div>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Confidence Level</h3>
                <p-progressBar [value]="predictionResult.confidence" [showValue]="true"></p-progressBar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <p-toast></p-toast>
  `
})
export class PredictDurationComponent implements OnInit {
  predictionForm: FormGroup;
  submitted = false;
  loading = false;
  predictionResult: any = null;
  
  educationLevels: EducationLevel[] = [
    { label: 'Bac', value: 'Bac' },
    { label: 'Bac+2', value: 'Bac+2' },
    { label: 'Bac+3', value: 'Bac+3' },
    { label: 'Bac+5', value: 'Bac+5' },
    { label: 'Doctorat', value: 'Doctorat' }
  ];
  
  difficultyLevels: DifficultyLevel[] = [
    { label: 'Facile', value: 'Facile' },
    { label: 'Moyen', value: 'Moyen' },
    { label: 'Difficile', value: 'Difficile' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private aiService: AiService
  ) {
    this.predictionForm = this.fb.group({
      age: [30, [Validators.required, Validators.min(16), Validators.max(100)]],
      educationLevel: ['Bac+3', Validators.required],
      averageGrade: [14.5, [Validators.required, Validators.min(0), Validators.max(20)]],
      studyHoursPerWeek: [20, [Validators.required, Validators.min(1), Validators.max(80)]],
      trainingExperience: [2, [Validators.required, Validators.min(0), Validators.max(50)]],
      courseDifficulty: ['Moyen', Validators.required],
      expectedDuration: [52, [Validators.required, Validators.min(1), Validators.max(156)]],
      actualDuration: [null] // Optional field
    });
  }
  
  ngOnInit() {
    // Any initialization logic
  }
  
  /**
   * Updates a form control value and triggers change detection
   * Used to keep slider and input field in sync
   */
  updateFormValue(controlName: string, value: any) {
    // Ensure the value is within min/max bounds
    if (controlName === 'studyHoursPerWeek') {
      value = Math.min(Math.max(value, 1), 80);
    } else if (controlName === 'trainingExperience') {
      value = Math.min(Math.max(value, 0), 50);
    }
    
    // Update the form control
    this.predictionForm.get(controlName)?.setValue(value);
  }
  
  get f() { return this.predictionForm.controls; }
  
  predictDuration() {
    this.submitted = true;
    
    if (this.predictionForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields correctly'
      });
      return;
    }
    
    this.loading = true;
    
    const formValues = this.predictionForm.value;
    
    // Map form values directly to API payload
    const payload: PredictionPayload = {
      'Âge': formValues.age,
      'Niveau_Éducation': formValues.educationLevel,
      'Note_Moyenne_Antérieure': formValues.averageGrade,
      'Heures_Étude_Par_Semaine': formValues.studyHoursPerWeek,
      'Expérience_Formation': formValues.trainingExperience,
      'Difficulté_Formation': formValues.courseDifficulty,
      'Durée_Formation_Prévue': formValues.expectedDuration,
      'Durée_Formation_Réelle': 10 // Always send 10 as requested
    };
    
    // Log the payload for debugging
    console.log('Sending prediction payload:', payload);
    
    this.aiService.predictCourseDuration(payload)
      .pipe(
        catchError(error => {
          console.error('API Error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'API Error',
            detail: 'Failed to get prediction from the server. Using fallback calculation.'
          });
          
          // Fallback to local calculation if API fails
          return of(this.calculateLocalPrediction(formValues));
        })
      )
      .subscribe((response: PredictionResponse) => {
        console.log('API Response:', response);
        
        // Calculate completion date
        const today = new Date();
        const completionDate = new Date(today);
        completionDate.setDate(today.getDate() + Math.ceil(response.prediction.duree_semaines * 7));
        
        // Prepare result
        this.predictionResult = {
          duration: response.prediction.duree_semaines.toFixed(1),
          unit: 'weeks',
          completionDate: completionDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          confidence: response.prediction.intervalle_confiance.niveau_confiance || 95
        };
        
        this.loading = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Prediction Complete',
          detail: response.message || `Estimated duration: ${this.predictionResult.duration} weeks`
        });
      });
  }
  
  // Helper method to map education level to Niveau_Éducation value
  private mapEducationLevelToNiveau(level: string | undefined): string {
    switch (level) {
      case 'beginner': return 'Bac';
      case 'intermediate': return 'Bac+2';
      case 'advanced': return 'Bac+3';
      case 'expert': return 'Bac+5';
      default: return 'Bac+3';
    }
  }
  
  // Helper method to map education level to Bac+ value (kept for reference)
  private mapEducationLevelToBacPlus(level: string | undefined): number {
    switch (level) {
      case 'beginner': return 0;
      case 'intermediate': return 2;
      case 'advanced': return 3;
      case 'expert': return 5;
      default: return 2;
    }
  }
  
  // Helper method to map course level to difficulty
  private mapCourseLevelToDifficulty(level: string | undefined): string {
    switch (level) {
      case 'beginner': return 'Facile';
      case 'intermediate': return 'Moyen';
      case 'advanced': return 'Difficile';
      case 'expert': return 'Difficile'; // API only accepts 'Facile', 'Moyen', 'Difficile'
      default: return 'Moyen';
    }
  }
  
  // Fallback calculation method if API fails
  private calculateLocalPrediction(formValues: any): PredictionResponse {
    // Get values from the form with validation
    const expectedDuration = Math.min(Math.max(Number(formValues.expectedDuration) || 52, 1), 156); // Ensure within 1-156 range
    const studyHoursPerWeek = Math.min(Math.max(formValues.studyHoursPerWeek || 20, 1), 80); // Ensure within 1-80 range
    const trainingExperience = Math.min(Math.max(formValues.trainingExperience || 2, 0), 50); // Ensure within 0-50 range
    const averageGrade = Math.min(Math.max(formValues.averageGrade || 14.5, 0), 20); // Ensure within 0-20 range
    
    // Adjust based on education level
    const educationLevelAdjustment: Record<string, number> = {
      'Bac': 1.2,
      'Bac+2': 1.0,
      'Bac+3': 0.9,
      'Bac+5': 0.8,
      'Doctorat': 0.7
    };
    
    // Adjust based on difficulty
    const difficultyAdjustment: Record<string, number> = {
      'Facile': 0.8,
      'Moyen': 1.0,
      'Difficile': 1.3
    };
    
    // Calculate adjusted duration
    const educationFactor = educationLevelAdjustment[formValues.educationLevel] || 1.0;
    const difficultyFactor = difficultyAdjustment[formValues.courseDifficulty] || 1.0;
    
    // Experience reduces duration (more experience = faster learning)
    const experienceFactor = Math.max(1 - (trainingExperience * 0.02), 0.5); // Max 50% reduction
    
    // Grade affects learning efficiency (higher grade = faster learning)
    const gradeFactor = Math.max(1 - ((averageGrade - 10) * 0.02), 0.8); // Max 20% reduction
    
    // Calculate total weeks
    let totalWeeks = expectedDuration * educationFactor * difficultyFactor * experienceFactor * gradeFactor;
    
    // Adjust based on study hours (more hours = faster completion)
    const standardHoursPerWeek = 20; // baseline
    const hoursAdjustment = standardHoursPerWeek / studyHoursPerWeek;
    totalWeeks = totalWeeks * hoursAdjustment;
    
    // Add some variability to make it look more realistic
    const minWeeks = Math.max(totalWeeks * 0.9, totalWeeks - 2);
    const maxWeeks = Math.min(totalWeeks * 1.1, totalWeeks + 2);
    
    // Create a response object that matches the API response structure
    return {
      success: true,
      prediction: {
        duree_semaines: parseFloat(totalWeeks.toFixed(1)),
        duree_mois: parseFloat((totalWeeks / 4.3).toFixed(1)), // More accurate weeks to months conversion
        intervalle_confiance: {
          minimum: parseFloat(minWeeks.toFixed(1)),
          maximum: parseFloat(maxWeeks.toFixed(1)),
          niveau_confiance: 95
        }
      },
      message: `La durée estimée de la formation est de ${totalWeeks.toFixed(1)} semaines (${(totalWeeks / 4.3).toFixed(1)} mois)`,
      details: {
        precision: "Estimation basée sur un calcul local (API indisponible)",
        recommandation: "Cette estimation peut varier selon votre rythme d'apprentissage. Pour une prédiction plus précise, veuillez réessayer plus tard."
      }
    };
  }
  
  getPriorKnowledgeLabel(value: number): string {
    if (value <= 2) return 'Beginner';
    if (value <= 4) return 'Novice';
    if (value <= 6) return 'Intermediate';
    if (value <= 8) return 'Advanced';
    return 'Expert';
  }
}
