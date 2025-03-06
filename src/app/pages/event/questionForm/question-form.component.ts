import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QuestionForm } from '../../../models/questionform.model';
import { Event } from '../../../models/event.model';
import { QuestionFormService } from '../../../services/question-form.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {
  questionForm: FormGroup;
  event!: Event;

  constructor(
    private fb: FormBuilder,
    private questionFormService: QuestionFormService,
    
    private dialogRef: MatDialogRef<QuestionFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { event: Event }
    
  ) {
    this.questionForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Add first question by default
    this.addQuestion();
  }

  get questions() {
    return this.questionForm.get('questions') as FormArray;
  }

  addQuestion() {
    this.questions.push(this.fb.control('', Validators.required));
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  onSubmit() {
    if (this.questionForm.valid && this.data.event.id) {
      const questions = this.questions.value;
      
      this.questionFormService.createQuestionForm(this.data.event.id, questions).subscribe({
        next: (response) => {
          this.snackBar.open('Questions saved successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(response);
        },
        error: (error) => {
          this.snackBar.open('Error saving questions. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Error saving questions:', error);
        }
      });
    }
  }
  // Add this method to your component class
onClose(): void {
    this.dialogRef.close();
  }
}