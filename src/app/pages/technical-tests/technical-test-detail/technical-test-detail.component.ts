import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TechnicalTestService } from '../../../services/technical-test.service';
import { TechnicalTest, Question } from '../../../models/technical-test.model';
import { interval, Subscription } from 'rxjs';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-technical-test-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    CheckboxModule,
    TextareaModule,
    ToastModule,
    ProgressBarModule,
    DividerModule,
    SkeletonModule,
    ChipModule,
    ConfirmDialogModule,
    BadgeModule
  ] as const,
  providers: [MessageService, ConfirmationService],
  templateUrl: './technical-test-detail.component.html'
})
export class TechnicalTestDetailComponent implements OnInit, OnDestroy {
  test: TechnicalTest | null = null;
  loading: boolean = true;
  error: boolean = false;
  errorMessage: string = '';
  
  // Timer properties
  timerSubscription: Subscription | null = null;
  elapsedTime: number = 0;
  startTime: number = 0;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private technicalTestService: TechnicalTestService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  
  ngOnInit() {
    this.loadTechnicalTest();
  }
  
  ngOnDestroy() {
    this.stopTimer();
  }
  
  loadTechnicalTest() {
    this.loading = true;
    
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = true;
      this.errorMessage = 'Invalid test ID';
      this.loading = false;
      return;
    }
    
    this.technicalTestService.getTechnicalTestById(+id).subscribe({
      next: (data) => {
        // Initialize selectedAnswers array for each multiple choice question
        data.questions = data.questions.map(q => ({
          ...q,
          selectedAnswers: [] as string[]
        }));
        
        this.test = data;
        this.loading = false;
        
        // Start timer if test is not completed
        if (this.test && !this.test.isCompleted) {
          this.startTimer();
        }
      },
      error: (error) => {
        console.error('Error loading technical test:', error);
        this.error = true;
        this.errorMessage = 'Failed to load technical test. Please try again later.';
        this.loading = false;
      }
    });
  }
  
  startTimer() {
    this.startTime = Date.now();
    this.timerSubscription = interval(1000).subscribe(() => {
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
    });
  }
  
  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }
  
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  goBack() {
    if (this.test && !this.test.isCompleted) {
      this.confirmationService.confirm({
        message: 'You have not submitted this test. If you leave now, your progress will not be saved. Are you sure you want to leave?',
        header: 'Confirm Navigation',
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.stopTimer();
          this.router.navigate(['/technical-tests']);
        }
      });
    } else {
      this.router.navigate(['/technical-tests']);
    }
  }
  
  getDaysRemaining(deadline: string | null): string {
    if (!deadline) return 'No deadline set';
    
    const deadlineDate = new Date(deadline);
    const today = new Date();
    
    // Set hours, minutes, seconds, and milliseconds to 0 for accurate day calculation
    today.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Expired';
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return '1 day left';
    } else {
      return `${diffDays} days left`;
    }
  }
  
  getScoreColorClass(score: number): string {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'danger';
  }
  
  getScoreLabel(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  }
  
  onAnswerChange(question: Question, option: string) {
    if (!question.selectedAnswers) {
      question.selectedAnswers = [];
    }

    const index = question.selectedAnswers.indexOf(option);
    if (index > -1) {
      question.selectedAnswers.splice(index, 1);
    } else {
      question.selectedAnswers.push(option);
    }
    
    // Update userAnswer to match selectedAnswers
    question.userAnswer = question.selectedAnswers;
  }
  
  isOptionSelected(question: Question, option: string): boolean {
    return question.selectedAnswers?.includes(option) || false;
  }
  
  getOptionColor(question: Question, option: string): string {
    if (!question.correctAnswer || !this.test?.isCompleted) return '';
    
    const correctAnswers = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer 
      : [question.correctAnswer];
    
    const userAnswers = question.selectedAnswers || [];
    
    if (correctAnswers.includes(option)) {
      return 'text-green-600';
    }
    
    if (userAnswers.includes(option)) {
      return 'text-red-600 line-through';
    }
    
    return '';
  }
  
  submitTest() {
    if (!this.test) return;
    
    // Check if all questions have been answered
    const unansweredQuestions = this.test.questions?.filter(q => !q.userAnswer) || [];
    
    if (unansweredQuestions.length > 0) {
      this.confirmationService.confirm({
        message: `You have ${unansweredQuestions.length} unanswered question${unansweredQuestions.length > 1 ? 's' : ''}. Do you want to submit anyway? Unanswered questions will be marked as incorrect.`,
        header: 'Warning: Unanswered Questions',
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass: 'p-button-warning',
        accept: () => {
          this.submitTestToServer();
        }
      });
    } else {
      this.confirmationService.confirm({
        message: 'Are you sure you want to submit this test? You will not be able to change your answers after submission.',
        header: 'Confirm Submission',
        icon: 'pi pi-check-circle',
        accept: () => {
          this.submitTestToServer();
        }
      });
    }
  }
  
  private submitTestToServer() {
    if (!this.test) return;
    
    this.stopTimer();
    this.loading = true;
    
    const testWithTime = {
      ...this.test,
      timeSpentSeconds: this.elapsedTime
    };
    
    this.technicalTestService.submitTechnicalTest(this.test.id, testWithTime).subscribe({
      next: (result) => {
        this.test = result;
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Test submitted successfully! Your score: ${result.score}%`
        });
      },
      error: (error) => {
        console.error('Error submitting test:', error);
        this.loading = false;
        
        if (error.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Authentication Error',
            detail: 'Your session has expired. Please log in again.',
            life: 5000
          });
          // Optionally redirect to login page
          this.router.navigate(['/login']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit test. Please try again.',
            life: 5000
          });
        }
      }
    });
  }
}