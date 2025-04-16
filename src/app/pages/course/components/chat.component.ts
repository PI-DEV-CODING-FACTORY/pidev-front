import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

interface Message {
    text: string;
    isUser: boolean;
    timestamp: Date;
}

interface GroqMessage {
    role: string;
    content: string;
}

interface GroqRequest {
    model: string;
    messages: GroqMessage[];
}

interface GroqResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
}

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    template: `
        <div class="chat-container bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div #messagesContainer class="messages-container h-64 overflow-y-auto mb-4 p-2">
                <div *ngFor="let message of messages" [ngClass]="{ 'flex justify-end': message.isUser, 'flex justify-start': !message.isUser }" class="mb-3">
                    <div [ngClass]="{ 'bg-indigo-500 text-white': message.isUser, 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200': !message.isUser }" class="rounded-lg px-4 py-2 max-w-3/4 break-words">
                        <p>{{ message.text }}</p>
                        <span class="text-xs opacity-70 block text-right mt-1">
                            {{ message.timestamp | date: 'short' }}
                        </span>
                    </div>
                </div>
                <div *ngIf="isLoading" class="flex justify-start mb-3">
                    <div class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2">
                        <div class="flex space-x-2">
                            <div class="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                            <div class="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style="animation-delay: 0.2s"></div>
                            <div class="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style="animation-delay: 0.4s"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="input-container flex">
                <input
                    type="text"
                    [(ngModel)]="newMessage"
                    (keyup.enter)="sendMessage()"
                    placeholder="Type your message here..."
                    class="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                    [disabled]="isLoading"
                />
                <button (click)="sendMessage()" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-r-lg transition-colors duration-300" [disabled]="!newMessage.trim() || isLoading">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </div>
    `,
    styles: [
        `
            .messages-container::-webkit-scrollbar {
                width: 6px;
            }
            .messages-container::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }
            .messages-container::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 10px;
            }
            .messages-container::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        `
    ]
})
export class ChatComponent implements OnInit, AfterViewChecked {
    @Input() courseId!: number;
    @Input() lessonId!: number;
    @ViewChild('messagesContainer') messagesContainer!: ElementRef;

    messages: Message[] = [];
    conversationHistory: GroqMessage[] = [];
    newMessage: string = '';
    lessonContent: string = '';
    lessonTitle: string = '';
    isLoading: boolean = false;

    private readonly GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    private readonly GROQ_API_KEY = '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';

    constructor(
        private courseService: CourseService,
        private http: HttpClient
    ) {}

    ngOnInit(): void {
        // Add a welcome message
        this.messages.push({
            text: "Hello! Ask me any questions about this lesson. I'll try my best to help you!",
            isUser: false,
            timestamp: new Date()
        });

        // Fetch the lesson content when the component initializes
        this.fetchLessonContent();
    }

    ngAfterViewChecked(): void {
        this.scrollToBottom();
    }

    sendMessage(): void {
        if (!this.newMessage.trim() || this.isLoading) return;

        const userMessage = this.newMessage;

        // Add user message to UI
        this.messages.push({
            text: userMessage,
            isUser: true,
            timestamp: new Date()
        });

        // Add user message to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        this.newMessage = ''; // Clear input field
        this.isLoading = true; // Show loading indicator

        // Get response from Groq API
        this.getGroqResponse(userMessage);
    }

    private getGroqResponse(question: string): void {
        // Create messages array with system context, conversation history, and current question
        const messages: GroqMessage[] = [
            {
                role: 'system',
                content: `You are a helpful AI tutor. The student is currently learning about the following lesson:
                Title: ${this.lessonTitle}
                Content: ${this.lessonContent}
                
                Provide helpful, concise explanations based on this lesson content. If you don't know the answer, be honest about it.`
            },
            ...this.conversationHistory
        ];

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.GROQ_API_KEY}`
        });

        const requestBody: GroqRequest = {
            model: 'llama-3.3-70b-versatile',
            messages: messages
        };

        this.http.post<GroqResponse>(this.GROQ_API_URL, requestBody, { headers }).subscribe({
            next: (response) => {
                const aiResponse = response.choices[0].message.content;

                // Add AI response to UI
                this.messages.push({
                    text: aiResponse,
                    isUser: false,
                    timestamp: new Date()
                });

                // Add AI response to conversation history
                this.conversationHistory.push({
                    role: 'assistant',
                    content: aiResponse
                });

                this.isLoading = false;
                this.scrollToBottom();
            },
            error: (error) => {
                console.error('Error calling Groq API:', error);

                // Add error message to UI
                this.messages.push({
                    text: `Sorry, I encountered an error. Please try again later. (${error.message || 'Unknown error'})`,
                    isUser: false,
                    timestamp: new Date()
                });

                this.isLoading = false;
                this.scrollToBottom();
            }
        });
    }

    private fetchLessonContent(): void {
        if (this.courseId && this.lessonId) {
            this.courseService.getCourseById(this.courseId).subscribe({
                next: (courseData) => {
                    if (courseData && courseData.lessons) {
                        const currentLesson = courseData.lessons.find((lesson) => lesson.id === this.lessonId);
                        if (currentLesson) {
                            this.lessonContent = currentLesson.content;
                            this.lessonTitle = currentLesson.title;

                            // Initialize the conversation with the system message
                            this.conversationHistory = [];
                        } else {
                            console.error('Lesson not found in course data');
                            this.handleLessonError('Lesson not found');
                        }
                    } else {
                        console.error('Course data or lessons not available');
                        this.handleLessonError('Course data unavailable');
                    }
                },
                error: (error) => {
                    console.error('Error fetching course data:', error);
                    this.handleLessonError('Error fetching course data');
                }
            });
        } else {
            console.warn('Cannot fetch lesson content: courseId or lessonId is missing');
            this.handleLessonError('Missing course or lesson ID');
        }
    }

    private handleLessonError(errorMessage: string): void {
        this.messages.push({
            text: `I couldn't load the lesson content: ${errorMessage}. I may not be able to provide specific help for this lesson.`,
            isUser: false,
            timestamp: new Date()
        });
    }

    private scrollToBottom(): void {
        try {
            this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.error('Error scrolling to bottom:', err);
        }
    }
}
