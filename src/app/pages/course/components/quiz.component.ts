import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuizQuestion } from '../../../models/course.model';
import { StudentProgressService } from '../../../services/student-progress.service';

@Component({
    selector: 'app-quiz',
    standalone: true,
    imports: [FormsModule, CommonModule],
    template: `
        <div class="p-5 max-w-[600px] mx-auto">
            <div *ngFor="let quiz of quizzes; let i = index" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
                <h3 class="text-xl text-gray-800 dark:text-gray-200 mb-5">{{ quiz.question }}</h3>
                <div class="flex flex-col gap-3 mb-6">
                    <!-- Option A -->
                    <div
                        class="flex items-center gap-3 p-3 rounded-lg transition-all"
                        [ngClass]="{
                            'bg-green-100/50 dark:bg-green-900/10': showResults && 'A' === quiz.correctAns,
                            'bg-red-100/50 dark:bg-red-900/10': showResults && selectedAnswers[i] === 'A' && 'A' !== quiz.correctAns
                        }"
                    >
                        <input
                            type="radio"
                            [id]="'optionA' + i"
                            [name]="'question' + i"
                            value="A"
                            [(ngModel)]="selectedAnswers[i]"
                            class="appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full 
                            checked:border-indigo-500 checked:bg-indigo-500 dark:checked:border-indigo-400 dark:checked:bg-indigo-400
                            relative transition-colors cursor-pointer"
                            [disabled]="showResults"
                        />
                        <label
                            [for]="'optionA' + i"
                            class="flex-1 p-2 rounded-md cursor-pointer transition-colors
                            text-gray-700 dark:text-gray-300
                            hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                            {{ quiz.ansA }}
                        </label>
                    </div>

                    <!-- Option B -->
                    <div
                        class="flex items-center gap-3 p-3 rounded-lg transition-all"
                        [ngClass]="{
                            'bg-green-100/50 dark:bg-green-900/10': showResults && 'B' === quiz.correctAns,
                            'bg-red-100/50 dark:bg-red-900/10': showResults && selectedAnswers[i] === 'B' && 'B' !== quiz.correctAns
                        }"
                    >
                        <input
                            type="radio"
                            [id]="'optionB' + i"
                            [name]="'question' + i"
                            value="B"
                            [(ngModel)]="selectedAnswers[i]"
                            class="appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full 
                            checked:border-indigo-500 checked:bg-indigo-500 dark:checked:border-indigo-400 dark:checked:bg-indigo-400
                            relative transition-colors cursor-pointer"
                            [disabled]="showResults"
                        />
                        <label
                            [for]="'optionB' + i"
                            class="flex-1 p-2 rounded-md cursor-pointer transition-colors
                            text-gray-700 dark:text-gray-300
                            hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                            {{ quiz.ansB }}
                        </label>
                    </div>

                    <!-- Option C -->
                    <div
                        class="flex items-center gap-3 p-3 rounded-lg transition-all"
                        [ngClass]="{
                            'bg-green-100/50 dark:bg-green-900/10': showResults && 'C' === quiz.correctAns,
                            'bg-red-100/50 dark:bg-red-900/10': showResults && selectedAnswers[i] === 'C' && 'C' !== quiz.correctAns
                        }"
                    >
                        <input
                            type="radio"
                            [id]="'optionC' + i"
                            [name]="'question' + i"
                            value="C"
                            [(ngModel)]="selectedAnswers[i]"
                            class="appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full 
                            checked:border-indigo-500 checked:bg-indigo-500 dark:checked:border-indigo-400 dark:checked:bg-indigo-400
                            relative transition-colors cursor-pointer"
                            [disabled]="showResults"
                        />
                        <label
                            [for]="'optionC' + i"
                            class="flex-1 p-2 rounded-md cursor-pointer transition-colors
                            text-gray-700 dark:text-gray-300
                            hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                            {{ quiz.ansC }}
                        </label>
                    </div>

                    <!-- Option D -->
                    <div
                        class="flex items-center gap-3 p-3 rounded-lg transition-all"
                        [ngClass]="{
                            'bg-green-100/50 dark:bg-green-900/10': showResults && 'D' === quiz.correctAns,
                            'bg-red-100/50 dark:bg-red-900/10': showResults && selectedAnswers[i] === 'D' && 'D' !== quiz.correctAns
                        }"
                    >
                        <input
                            type="radio"
                            [id]="'optionD' + i"
                            [name]="'question' + i"
                            value="D"
                            [(ngModel)]="selectedAnswers[i]"
                            class="appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full 
                            checked:border-indigo-500 checked:bg-indigo-500 dark:checked:border-indigo-400 dark:checked:bg-indigo-400
                            relative transition-colors cursor-pointer"
                            [disabled]="showResults"
                        />
                        <label
                            [for]="'optionD' + i"
                            class="flex-1 p-2 rounded-md cursor-pointer transition-colors
                            text-gray-700 dark:text-gray-300
                            hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                            {{ quiz.ansD }}
                        </label>
                    </div>
                </div>
            </div>

            <!-- Score display -->
            <div
                *ngIf="showResults"
                class="mb-6 p-4 rounded-lg text-center"
                [ngClass]="{
                    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400': score >= quizzes.length / 2,
                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400': score < quizzes.length / 2
                }"
            >
                <p class="text-xl font-bold">Your Score: {{ score }} / {{ quizzes.length }}</p>
                <p class="mt-2" *ngIf="score === quizzes.length">Perfect score! Excellent work!</p>
                <p class="mt-2" *ngIf="score >= quizzes.length / 2 && score < quizzes.length">Good job! You passed the quiz.</p>
                <p class="mt-2" *ngIf="score < quizzes.length / 2">Keep studying and try again!</p>

                <!-- Save status message -->
                <p
                    *ngIf="saveStatus"
                    class="mt-3 text-sm"
                    [ngClass]="{
                        'text-green-600 dark:text-green-400': saveStatus.includes('Success'),
                        'text-amber-600 dark:text-amber-400': saveStatus.includes('Saving'),
                        'text-red-600 dark:text-red-400': saveStatus.includes('Failed')
                    }"
                >
                    {{ saveStatus }}
                </p>
            </div>

            <button *ngIf="!showResults" (click)="submitQuiz()" class="w-full bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors">Submit Quiz</button>

            <button *ngIf="showResults" (click)="retakeQuiz()" class="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors mt-4">Retake Quiz</button>
        </div>
    `,
    styles: [
        `
            /* Add custom styles if needed */
        `
    ]
})
export class QuizComponent {
    @Input() quizzes: QuizQuestion[] = [];
    @Input() courseId!: number;
    @Input() lessonId!: number;

    selectedAnswers: string[] = [];
    showResults: boolean = false;
    score: number = 0;
    saveStatus: string = '';

    private progressService = inject(StudentProgressService);

    submitQuiz() {
        // Calculate score
        this.score = 0;

        // For each question, check if the selected answer matches the correct answer
        for (let i = 0; i < this.quizzes.length; i++) {
            if (this.selectedAnswers[i] && this.selectedAnswers[i] === this.quizzes[i].correctAns) {
                this.score++;
            }
        }

        this.showResults = true;

        // Calculate percentage score (0-100)
        const percentageScore = Math.round((this.score / this.quizzes.length) * 100);

        // Log course and lesson IDs
        console.log('Quiz submitted - Course ID:', this.courseId, 'Lesson ID:', this.lessonId);

        // Only attempt to save if we have both courseId and lessonId
        if (this.courseId && this.lessonId) {
            this.saveQuizProgress(percentageScore);
        } else {
            console.warn('Cannot save quiz progress: courseId or lessonId is missing');
        }
    }

    saveQuizProgress(percentageScore: number) {
        this.saveStatus = 'Saving your progress...';
        console.log('Saving quiz progress - Course ID:', this.courseId, 'Lesson ID:', this.lessonId, 'Score:', percentageScore + '%');

        // Check if there's an existing progress record
        this.progressService.getProgressByCourseId(this.courseId).subscribe({
            next: (progressEntries) => {
                console.log('Found progress entries for Course ID:', this.courseId, 'Count:', progressEntries.length);

                // Find progress for this specific lesson
                const existingProgress = progressEntries.find((p) => p.lessonId && p.lessonId === this.lessonId);

                if (existingProgress && existingProgress.id) {
                    console.log('Found existing progress - Progress ID:', existingProgress.id, 'for Lesson ID:', this.lessonId);
                    // Update existing progress record
                    this.updateExistingProgress(existingProgress.id, percentageScore);
                } else {
                    console.log('No existing progress found for Lesson ID:', this.lessonId, '- Creating new progress');
                    // Create a new progress record
                    this.createNewProgress(percentageScore);
                }
            },
            error: (error) => {
                console.error('Error checking existing progress for Course ID:', this.courseId, 'Error:', error);
                this.saveStatus = 'Failed to save progress. Please try again.';
            }
        });
    }

    updateExistingProgress(progressId: number, percentageScore: number) {
        const updatedProgress = {
            quizCompleted: true,
            score: percentageScore,
            // Mark lesson as completed if score is at least 50%
            lessonCompleted: percentageScore >= 50
        };

        console.log('Updating progress - Progress ID:', progressId, 'Course ID:', this.courseId, 'Lesson ID:', this.lessonId, 'Score:', percentageScore + '%');

        this.progressService.updateProgress(progressId, updatedProgress as any).subscribe({
            next: (response) => {
                console.log('Progress updated successfully for Course ID:', this.courseId, 'Lesson ID:', this.lessonId);
                this.saveStatus = 'Success! Your progress has been saved.';
            },
            error: (error) => {
                console.error('Error updating progress for Course ID:', this.courseId, 'Lesson ID:', this.lessonId, 'Error:', error);
                this.saveStatus = 'Failed to save progress. Please try again.';
            }
        });
    }

    createNewProgress(percentageScore: number) {
        const newProgress = {
            quizCompleted: true,
            score: percentageScore,
            lessonCompleted: percentageScore >= 50,
            courseCompleted: false // Will be updated later when all lessons are completed
        };

        console.log('Creating new progress - Course ID:', this.courseId, 'Lesson ID:', this.lessonId, 'Score:', percentageScore + '%');

        this.progressService.createProgress(this.courseId, this.lessonId, newProgress as any).subscribe({
            next: (response) => {
                console.log('New progress created successfully for Course ID:', this.courseId, 'Lesson ID:', this.lessonId);
                this.saveStatus = 'Success! Your progress has been saved.';
            },
            error: (error) => {
                console.error('Error creating progress for Course ID:', this.courseId, 'Lesson ID:', this.lessonId, 'Error:', error);
                this.saveStatus = 'Failed to save progress. Please try again.';
            }
        });
    }

    retakeQuiz() {
        // Reset the quiz
        this.selectedAnswers = [];
        this.showResults = false;
        this.score = 0;
        this.saveStatus = '';
    }
}
