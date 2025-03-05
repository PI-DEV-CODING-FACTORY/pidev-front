import { Component, Input } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseType } from '../../../models/course.model';
import { ViewportScroller } from '@angular/common';
@Component({
    selector: 'ngbd-scrollspy-items',
    standalone: true,
    imports: [NgbScrollSpyModule, FormsModule, RouterLink, CommonModule],
    template: `
        <div class="content-wrapper">
            <div class="main-content">
                <div ngbScrollSpy #spy="ngbScrollSpy" [rootMargin]="'-100px'" class="content-section p-3 rounded-2">
                    <div *ngFor="let lesson of course?.lessons; let i = index" [id]="'lesson-' + i">
                        <div [ngbScrollSpyFragment]="'lesson-' + i" class="me">
                            <h4>{{ lesson.title }}</h4>
                            <div class="lesson-content">
                                <p>{{ lesson.content }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="navigation-sidebar">
                <div id="list-example" class="list-group vertical-nav">
                    <button *ngFor="let lesson of course?.lessons; let i = index" type="button" class="list-group-item list-group-item-action" [ngbScrollSpyItem]="spy" [fragment]="'lesson-' + i" (click)="scrollToLesson('lesson-' + i)">
                        {{ lesson.title }}
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .me {
                padding: 1rem;
            }
            .content-wrapper {
                display: flex;
                gap: 2rem;
                position: relative;
            }

            .main-content {
                flex: 1;
            }

            .navigation-sidebar {
                width: 250px;
                position: sticky;
                top: 20px;
                align-self: flex-start;
            }

            .vertical-nav {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            @media (max-width: 768px) {
                .content-wrapper {
                    flex-direction: column;
                }

                .navigation-sidebar {
                    width: 100%;
                    position: relative;
                    top: 0;
                }
            }

            .content-section {
                font-family:
                    'Segoe UI',
                    system-ui,
                    -apple-system,
                    sans-serif;
                font-size: 1.1rem;
                line-height: 1.8;
                color: #2d3748;
                max-width: 800px;
                margin: 0 auto;
                scrollbar-width: thin;
                scrollbar-color: #cbd5e0 #f7fafc;
            }

            .content-section h4 {
                font-size: 1.75rem;
                font-weight: 600;
                color: #1a202c;
                margin-top: 2.5rem;
                margin-bottom: 1.5rem;
            }

            .content-section p {
                margin-bottom: 2rem;
                letter-spacing: 0.01em;
            }

            .content-section p:last-child {
                margin-bottom: 0;
            }

            .content-section::-webkit-scrollbar {
                width: 8px;
            }

            .content-section::-webkit-scrollbar-track {
                background: #f7fafc;
                border-radius: 10px;
            }

            .content-section::-webkit-scrollbar-thumb {
                background-color: #cbd5e0;
                border-radius: 10px;
                border: 2px solid #f7fafc;
                transition: background-color 0.3s ease;
            }

            .content-section::-webkit-scrollbar-thumb:hover {
                background-color: #a0aec0;
            }
            .navigation-sidebar {
                width: 250px;
                position: sticky;
                top: 50px;
                align-self: flex-start;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                padding: 1.5rem;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            }

            .list-group-item {
                background: transparent;
                border: none;
                padding: 12px 16px;
                margin-bottom: 8px;
                border-radius: 8px;
                color: #4b5563;
                font-weight: 500;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                text-align: left;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
            }

            .list-group-item::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 3px;
                background: linear-gradient(45deg, #6366f1, #8b5cf6);
                transform: scaleY(0);
                transition: transform 0.3s ease;
                border-radius: 0 2px 2px 0;
            }

            .list-group-item:hover {
                background: #f8fafc;
                color: #1e293b;
                transform: translateX(4px);
            }

            .list-group-item:hover::before {
                transform: scaleY(1);
            }

            .list-group-item.active {
                background: #eef2ff;
                color: #4f46e5;
                font-weight: 600;
            }

            .list-group-item.active::before {
                transform: scaleY(1);
            }

            @media (prefers-color-scheme: dark) {
                .navigation-sidebar {
                    background: rgba(17, 24, 39, 0.9);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                }

                .list-group-item {
                    color: #e2e8f0;
                }

                .list-group-item:hover {
                    background: rgba(30, 41, 59, 0.8);
                    color: #f8fafc;
                }

                .list-group-item.active {
                    background: rgba(79, 70, 229, 0.1);
                    color: #818cf8;
                }
            }
            @media (prefers-color-scheme: dark) {
                .content-section {
                    color: #e2e8f0;
                    scrollbar-color: #4a5568 #1a202c;
                }

                .content-section h4 {
                    color: #f7fafc;
                }

                .content-section::-webkit-scrollbar-track {
                    background: #1a202c;
                }

                .content-section::-webkit-scrollbar-thumb {
                    background-color: #4a5568;
                    border: 2px solid #1a202c;
                }

                .content-section::-webkit-scrollbar-thumb:hover {
                    background-color: #718096;
                }
            }
        `
    ]
})
export class NgbdScrollSpyItems {
    @Input() course?: CourseType;

    constructor(private viewportScroller: ViewportScroller) {
        // Enable smooth scrolling behavior
        this.viewportScroller.setOffset([0, 20]);
    }

    scrollToLesson(elementId: string): void {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    }
}
