import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import { PasswordModule } from 'primeng/password';
import { tick } from '@angular/core/testing';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [
        CommonModule, 
        InputTextModule, 
        ButtonModule, 
        FormsModule, 
        RouterModule, 
        RippleModule, 
        AppFloatingConfigurator, 
        ToastModule,
        StepsModule,
        PasswordModule
    ],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-900 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-12 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
                                {{ getStepTitle() }}
                            </div>
                            <p-steps 
                                [model]="steps" 
                                [activeIndex]="currentStep"
                                [readonly]="true"
                                styleClass="mb-6"
                            ></p-steps>
                        </div>
                        <!-- Step containers with fixed width -->
                        <div class="w-full md:w-[30rem]">
                            <div *ngIf="currentStep === 0">
                                <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                                <input 
                                    pInputText 
                                    id="email" 
                                    type="email" 
                                    placeholder="Entrez votre adresse email" 
                                    class="w-full md:w-[30rem] mb-4"
                                    [(ngModel)]="email"
                                />
                                <div class="flex flex-column gap-4">
                                    <p-button 
                                        label="Envoyer le code" 
                                        styleClass="w-full" 
                                        [loading]="loading"
                                        (onClick)="nextStep()"
                                    ></p-button>
                                    <p-button 
                                        label="Retour à la connexion" 
                                        styleClass="w-full p-button-text" 
                                        (onClick)="goToLogin()"
                                    ></p-button>
                                </div>
                            </div>
                            <div *ngIf="currentStep === 1">
                                <label for="code" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Code de vérification</label>
                                <input 
                                    pInputText 
                                    id="code" 
                                    type="text" 
                                    placeholder="Entrez le code reçu par email" 
                                    class="w-full md:w-[30rem] mb-4"
                                    [(ngModel)]="verificationCode"
                                    
                                />
                                <small class="text-600 block mb-4">
                                    Un code de vérification a été envoyé à {{ email }}
                                </small>
                                <div class="flex flex-column gap-4">
                                    <p-button 
                                        label="Vérifier le code" 
                                        styleClass="w-full" 
                                        [loading]="loading"
                                        (onClick)="nextStep()"
                                    ></p-button>
                                                                        
                                    <p-button 
                                        label="Retour" 
                                        styleClass="w-full p-button-text" 
                                        (onClick)="previousStep()"
                                    ></p-button>
                                </div>
                            </div>
                            <div *ngIf="currentStep === 2">
                                <label for="newPassword" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Nouveau mot de passe</label>
                                <p-password 
                                    id="newPassword" 
                                    [(ngModel)]="newPassword" 
                                    [toggleMask]="true"
                                    styleClass="w-full mb-4"
                                    [inputStyle]="{'width': '100%'}"
                                    placeholder="Entrez votre nouveau mot de passe"
                                    [feedback]="true"
                                ></p-password>
                                <label for="confirmPassword" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Confirmer le mot de passe</label>
                                <p-password 
                                    id="confirmPassword" 
                                    [(ngModel)]="confirmPassword" 
                                    [toggleMask]="true"
                                    styleClass="w-full mb-4"
                                    [inputStyle]="{'width': '100%'}"
                                    placeholder="Confirmez votre nouveau mot de passe"
                                    [feedback]="false"
                                ></p-password>
                                <div class="flex flex-column gap-4">
                                    <p-button 
                                        label="Réinitialiser le mot de passe" 
                                        styleClass="w-full" 
                                        [loading]="loading"
                                        (onClick)="finishReset()"
                                    ></p-button>
                                    <p-button 
                                        label="Retour" 
                                        styleClass="w-full p-button-text" 
                                        (onClick)="previousStep()"
                                    ></p-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
// Add user property to store the returned user data
export class ResetPassword {
    email: string = '';
    verificationCode: string = '';
    newPassword: string = '';
    confirmPassword: string = '';
    currentStep: number = 0;
    user: any = null;
    loading: boolean = false; // Add this line

    steps = [
        { label: 'Email' },
        { label: 'Vérification' },
        { label: 'Nouveau mot de passe' }
    ];

    constructor(
        private router: Router,
        private messageService: MessageService,
        private http: HttpClient
    ) {}

    getStepTitle(): string {
        switch(this.currentStep) {
            case 0:
                return 'Réinitialisation du mot de passe';
            case 1:
                return 'Vérification du code';
            case 2:
                return 'Nouveau mot de passe';
            default:
                return 'Réinitialisation du mot de passe';
        }
    }

    nextStep() {
        if (this.currentStep === 0) {
            if (!this.email) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Veuillez entrer votre adresse email'
                });
                return;
            }
            this.sendVerificationEmail();
        } else if (this.currentStep === 1) {
            if (!this.verificationCode) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Veuillez entrer le code de vérification'
                });
                return;
            }
            this.validateToken();
        } else if (this.currentStep < 2) {
            this.currentStep++;
        }
    }

    validateToken() {
        this.loading = true;
        const url = `http://localhost:8080/auth/validateToken?token=${this.verificationCode}`;
        this.http.post<any>(url, {}).subscribe({
            next: (response) => {
                this.loading = false;
                switch(response.status) {
                    case 'VALID':
                        this.user = response.data; // Store the user data from response
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Code de vérification validé avec succès'
                        });
                        this.currentStep++;
                        break;
                    case 'INVALID':
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Code de vérification invalide ou expiré'
                        });
                        break;
                    default:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Une erreur inattendue est survenue'
                        });
                }
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Une erreur est survenue lors de la vérification du code'
                });
            }
        });
    }
    sendVerificationEmail() {
        this.loading = true;
        const url = `http://localhost:8080/auth/forgot-password?email=${this.email}`;
        this.http.post<any>(url, {}).subscribe({
            next: (response) => {
                this.loading = false;
                switch(response.status) {
                    case 'USER_NOT_FOUND':
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Cet email n\'existe pas dans notre système'
                        });
                        break;
                    case 'TOKEN_ALREADY_SENT':
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Information',
                            detail: 'Un code a déjà été envoyé. Veuillez vérifier votre email'
                        });
                        this.currentStep++;
                        break;
                    case 'TOKEN_SENT':
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Un code de vérification a été envoyé à votre adresse email'
                        });
                        this.currentStep++;
                        break;
                    default:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Une erreur inattendue est survenue'
                        });
                }
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Une erreur est survenue lors de l\'envoi du code de vérification'
                });
            }
        });
    }
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    finishReset() {
        if (!this.newPassword || !this.confirmPassword) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs'
            });
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Les mots de passe ne correspondent pas'
            });
            return;
        }

        this.loading = true;
        this.user.password = this.newPassword;
        
        this.http.post<any>('http://localhost:8080/auth/reset-password', this.user).subscribe({
            next: (response) => {
                this.loading = false;
                if (response.status === 'SUCCESS') {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Votre mot de passe a été réinitialisé avec succès'
                    });
                    setTimeout(() => {
                        this.router.navigate(['/auth/login']);
                    }, 2000);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de réinitialiser le mot de passe. Veuillez réessayer.'
                    });
                }
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Une erreur est survenue lors de la réinitialisation du mot de passe'
                });
            }
        });
    }
    goToLogin(){
        this.router.navigate(['/auth/login']);
    }
}