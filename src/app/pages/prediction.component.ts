import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-prediction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="prediction-container">
      <h2>Prédiction de la Durée de Formation</h2>
      <form [formGroup]="predictionForm" (ngSubmit)="onSubmit()" class="prediction-form">
        <div class="form-group">
          <label for="age">Age</label>
          <input type="number" id="age" formControlName="age" class="form-control">
          <div *ngIf="predictionForm.get('age')?.invalid && predictionForm.get('age')?.touched" class="error-text">
            Âge requis (16-100)
          </div>
        </div>

        <div class="form-group">
          <label for="niveauEducation">Niveau d'Éducation</label>
          <select id="niveauEducation" formControlName="niveauEducation" class="form-control">
            <option value="">Sélectionnez...</option>
            <option value="Bac">Bac</option>
            <option value="Bac+2">Bac+2</option>
            <option value="Bac+3">Bac+3</option>
            <option value="Bac+5">Bac+5</option>
            <option value="Doctorat">Doctorat</option>
          </select>
          <div *ngIf="predictionForm.get('niveauEducation')?.invalid && predictionForm.get('niveauEducation')?.touched" class="error-text">
            Niveau d'éducation requis
          </div>
        </div>

        <div class="form-group">
          <label for="experienceFormation">Expérience en Formation (mois)</label>
          <input type="number" id="experienceFormation" formControlName="experienceFormation" class="form-control">
          <div *ngIf="predictionForm.get('experienceFormation')?.invalid && predictionForm.get('experienceFormation')?.touched" class="error-text">
            Expérience requise (0-50 mois)
          </div>
        </div>

        <div class="form-group">
          <label for="heuresEtudeParSemaine">Heures d'Étude par Semaine</label>
          <input type="number" id="heuresEtudeParSemaine" formControlName="heuresEtudeParSemaine" class="form-control">
          <div *ngIf="predictionForm.get('heuresEtudeParSemaine')?.invalid && predictionForm.get('heuresEtudeParSemaine')?.touched" class="error-text">
            Heures requises (1-80)
          </div>
        </div>

        <div class="form-group">
          <label for="noteMoyenneAnterieure">Note Moyenne Antérieure</label>
          <input type="number" id="noteMoyenneAnterieure" formControlName="noteMoyenneAnterieure" class="form-control" step="0.1">
          <div *ngIf="predictionForm.get('noteMoyenneAnterieure')?.invalid && predictionForm.get('noteMoyenneAnterieure')?.touched" class="error-text">
            Note requise (0-20)
          </div>
        </div>

        <div class="form-group">
          <label for="difficulteFormation">Difficulté de la Formation</label>
          <select id="difficulteFormation" formControlName="difficulteFormation" class="form-control">
            <option value="">Sélectionnez...</option>
            <option value="Facile">Facile</option>
            <option value="Moyen">Moyen</option>
            <option value="Difficile">Difficile</option>
          </select>
          <div *ngIf="predictionForm.get('difficulteFormation')?.invalid && predictionForm.get('difficulteFormation')?.touched" class="error-text">
            Difficulté requise
          </div>
        </div>

        <div class="form-group">
          <label for="dureeFormationPrevue">Durée de Formation Prévue (semaines)</label>
          <input type="number" id="dureeFormationPrevue" formControlName="dureeFormationPrevue" class="form-control">
          <div *ngIf="predictionForm.get('dureeFormationPrevue')?.invalid && predictionForm.get('dureeFormationPrevue')?.touched" class="error-text">
            Durée requise (1-156 semaines)
          </div>
        </div>

        <button type="submit" [disabled]="!predictionForm.valid || isLoading" class="btn-predict">
          {{ isLoading ? 'Prédiction en cours...' : 'Prédire la Durée' }}
        </button>
      </form>

     <div *ngIf="prediction && !isLoading" class="prediction-result">
  <h3>Résultat de la Prédiction</h3>
  <p>Durée estimée de la formation : <br></p>
  <p>Mois : <strong>{{ prediction.prediction.duree_mois | number:'1.0-0' }} mois</strong></p>
  <p>Semaines : <strong>{{ prediction.prediction.duree_semaines | number:'1.0-0' }} semaines</strong></p>
  <p *ngIf="prediction.prediction.intervalle_confiance">
    Intervalle de confiance :<strong>{{ prediction.prediction.intervalle_confiance.niveau_confiance }}% </strong>
  </p>
</div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .prediction-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 2rem;
      text-align: center;
    }

    .prediction-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-weight: 500;
      color: #34495e;
    }

    .form-control {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control.ng-invalid.ng-touched {
      border-color: #e74c3c;
    }

    .error-text {
      color: #e74c3c;
      font-size: 0.8rem;
    }

    .btn-predict {
      background-color: #3498db;
      color: white;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      margin-top: 1rem;
      transition: background-color 0.3s;
    }

    .btn-predict:hover {
      background-color: #2980b9;
    }

    .btn-predict:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }

    .prediction-result {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #3498db;
    }

    .prediction-result h3 {
      margin-top: 0;
      color: #2c3e50;
    }

    .error-message {
      color: #e74c3c;
      margin-top: 1rem;
      padding: 1rem;
      background-color: #fdecea;
      border-radius: 4px;
      border-left: 4px solid #e74c3c;
      text-align: center;
    }
  `]
})
export class PredictionComponent {
  predictionForm: FormGroup;
  prediction: any = null;
  error: string | null = null;
  isLoading = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.predictionForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(16), Validators.max(100)]],
      niveauEducation: ['', Validators.required],
      experienceFormation: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      heuresEtudeParSemaine: ['', [Validators.required, Validators.min(1), Validators.max(80)]],
      noteMoyenneAnterieure: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      difficulteFormation: ['', Validators.required],
      dureeFormationPrevue: ['', [Validators.required, Validators.min(1), Validators.max(156)]]
    });
  }

  onSubmit() {
    if (this.predictionForm.valid) {
      this.isLoading = true;
      this.error = null;
      this.prediction = null;

      // Préparer les données pour l'API
      const formData = {
        Âge: this.predictionForm.value.age,
        Niveau_Éducation: this.predictionForm.value.niveauEducation,
        Expérience_Formation: this.predictionForm.value.experienceFormation,
        Heures_Étude_Par_Semaine: this.predictionForm.value.heuresEtudeParSemaine,
        Note_Moyenne_Antérieure: this.predictionForm.value.noteMoyenneAnterieure,
        Difficulté_Formation: this.predictionForm.value.difficulteFormation,
        Durée_Formation_Prévue: this.predictionForm.value.dureeFormationPrevue
      };
      console.log('Données envoyées à l\'API:', formData); // Debugging line

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      this.http.post('http://localhost:5000/predict', formData, { headers })
        .subscribe({
          next: (response: any) => {
            this.prediction = response;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erreur de prédiction:', error);
            this.error = error.error?.message || 'Une erreur est survenue lors de la prédiction';
            this.isLoading = false;
          }
        });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.predictionForm.markAllAsTouched();
    }
  }
}