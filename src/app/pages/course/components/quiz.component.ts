import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuizQuestion } from '../../../models/course.model';



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
            <button (click)="submitQuiz()" class="w-full bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors">Submit Quiz</button>
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
    selectedAnswers: string[] = [];
    showResults: boolean = false;

    submitQuiz() {
        this.showResults = true;
    }
}
