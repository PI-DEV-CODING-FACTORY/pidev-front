import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { LessonType } from '../../../models/course.model';

@Component({
    selector: 'app-lesson-navigation',
    standalone: true,
    imports: [CommonModule, NgbScrollSpyModule],
    template: `
        <div class="navigation-sidebar">
            <div id="list-example" class="list-group vertical-nav">
                <button
                    *ngFor="let lesson of lessons; let i = index"
                    type="button"
                    class="list-group-item list-group-item-action"
                    [ngClass]="{ 'has-note-indicator': hasNotes(lesson.id) }"
                    [ngbScrollSpyItem]="spy"
                    [fragment]="'lesson-' + i"
                    (click)="lessonSelected.emit('lesson-' + i)"
                >
                    {{ lesson.title }}
                </button>
            </div>
        </div>
    `,
    styles: [
        `
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

            .vertical-nav {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
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

            .has-note-indicator::after {
                content: '📝';
                margin-left: 8px;
                font-size: 0.8rem;
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

            @media (max-width: 768px) {
                .navigation-sidebar {
                    width: 100%;
                    position: relative;
                    top: 0;
                }
            }
        `
    ]
})
export class LessonNavigationComponent {
    @Input() lessons: LessonType[] = [];
    @Input() spy: any;
    @Input() lessonNotesMap: Map<number, boolean> = new Map();

    @Output() lessonSelected = new EventEmitter<string>();

    hasNotes(lessonId: number): boolean {
        return this.lessonNotesMap.get(lessonId) || false;
    }
}
