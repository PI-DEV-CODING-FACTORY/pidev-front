import { Component, Input, inject, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CodeDisplayComponent } from './codedisplay';
import { QuizComponent } from './quiz.component';
import { CourseService } from '../../../services/course.service';
import { ExampleHistoryType, QuizQuestion, QuizType } from '../../../models/course.model';
import { CommonModule } from '@angular/common';
import { ExampleService } from '../../../services/example.service';
import { QuizService } from '../../../services/quiz.service';

@Component({
    selector: 'ngbd-accordion-toggle',
    standalone: true,
    imports: [NgbAccordionModule, CodeDisplayComponent, QuizComponent, CommonModule],
    template: `
        <div ngbAccordion #accordion="ngbAccordion" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ml-4">
            <div ngbAccordionItem="Quiz" class="mb-2">
                <button
                    ngbAccordionButton
                    class="w-full px-6 py-5 font-semibold text-lg text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 flex items-center justify-between"
                >
                    <span>Exemples</span>
                    <svg (click)="onRefresh($event)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:rotate-180 transition-transform duration-300">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>

                <div ngbAccordionCollapse class="border-t border-gray-200 dark:border-gray-600">
                    <div ngbAccordionBody>
                        <ng-template>
                            <div class="p-6 text-gray-600 dark:text-gray-300 text-base leading-7 bg-white dark:bg-gray-800">
                                <div *ngFor="let example of examples">
                                    <app-code-display [code]="example.newExample"></app-code-display>
                                </div>
                            </div>
                        </ng-template>
                    </div>
                </div>
            </div>

            <div ngbAccordionItem="second" class="mb-2">
                <button
                    ngbAccordionButton
                    class="w-full px-6 py-5 font-semibold text-lg text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 flex items-center justify-between"
                >
                    Quiz
                </button>

                <div ngbAccordionCollapse class="border-t border-gray-200 dark:border-gray-600">
                    <div ngbAccordionBody>
                        <ng-template>
                            <div class="p-6 text-gray-600 dark:text-gray-300 text-base leading-7 bg-white dark:bg-gray-800">
                                <app-quiz [quizzes]="quizs"></app-quiz>
                            </div>
                        </ng-template>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [``]
})
export class NgbdAccordionToggle implements OnInit {
    @Input() courseId!: number;
    @Input() lessonId!: number;

    private courseService = inject(CourseService);
    private examapleService = inject(ExampleService);
    private quizService = inject(QuizService);
    quizs: QuizQuestion[] = [];
    examples: ExampleHistoryType[] = [];

    ngOnInit() {
        // Load data automatically when component initializes
        this.loadQuizAndExamples();
    }

    loadQuizAndExamples() {
        if (this.courseId && this.lessonId) {
            // Load quizzes
            this.quizService.fetchQuizzesByCourseAndLesson(this.courseId, this.lessonId).subscribe({
                next: (data: QuizType[]) => {
                    if (data && data.length > 0) {
                        try {
                            const parsedQuestions = JSON.parse(data[0].questions);
                            this.quizs = parsedQuestions;
                            console.log('Quizzes loaded:', this.quizs);
                        } catch (e) {
                            console.error('Error parsing quiz questions:', e);
                        }
                    } else {
                        console.log('No quizzes found for this course/lesson');
                    }
                },
                error: (error) => {
                    console.error('Error fetching quizzes:', error);
                }
            });

            // Load examples
            this.examapleService.getExampleHistories(this.courseId, this.lessonId).subscribe({
                next: (data) => {
                    this.examples = data;
                    console.log('Examples loaded:', data);
                },
                error: (error) => {
                    console.error('Error fetching examples:', error);
                }
            });
        } else {
            console.warn('Cannot load data: courseId or lessonId is missing');
        }
    }

    onRefresh(event: MouseEvent) {
        event.stopPropagation();
        this.loadQuizAndExamples(); // Reuse the same loading logic
    }
}
