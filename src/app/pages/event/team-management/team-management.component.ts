import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantService } from '../../../services/participant.service';
import { CheckpointService } from '../../../services/checkpoint.service';
import { Checkpoint } from '../../../models/checkpoint.model';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AIService } from '../../../services/ai.service';
import { TeamService } from '../../../services/team.service';
import { Team } from '../../../models/team.model';
import { Participant } from '../../../models/participant.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EventParticipant } from '../../../models/event-participant.model';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Evaluation } from '@app/models/evaluation.model';


@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatRippleModule,
    MatSnackBarModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class TeamManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  participants: Array<{ participant: Participant; selected: boolean }> = [];
  eventId!: number;
  checkpoints: Checkpoint[] = [];
  teamCheckpoints: Checkpoint[] = [];
  teamProgress: number = 0;
  isGeneratingAI = false;
  eventCheckpoints: Checkpoint[] = [];
  eventCheckpointForm: FormGroup;
  isLoadingEventCheckpoints = false;
  
  checkpointForm: FormGroup;
  aiCheckpointForm: FormGroup;
  isGeneratingCheckpoints = false;
  teamGrades: { [key: number]: number } = {};
  isGrading = false;
  selectedTeam: Team | null = null;
  gradeForm: FormGroup;
  aiPromptForm: FormGroup;
  timelineCheckpoints: Checkpoint[] = [];
  timelineProgress: number = 0;
  currentTimelineIndex: number = 0;
  teams: Team[] = [];
  teamForm: FormGroup;
  isCreatingTeam = false;
  isAddingCheckpoint = false;

  participants_team: EventParticipant[] = [];
  selectedTeamObj: Team | null = null;
  evaluationForm = this.fb.group({});

  

  constructor(
      private participantService: ParticipantService,
    private checkpointService: CheckpointService,
    private aiService: AIService,
    private location: Location,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.eventCheckpointForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      deadline: [null]
    });

    this.checkpointForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      deadline: [null]
    });

    this.aiCheckpointForm = this.fb.group({
      projectDescription: ['', [Validators.required, Validators.minLength(50)]]
    });

    this.gradeForm = this.fb.group({
      grade: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      feedback: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.aiPromptForm = this.fb.group({
      prompt: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.teamForm = this.fb.group({
      teamName: ['', [Validators.required]],
      event: ['', Validators.required]
    });


    this.teamService.getParticipantsByEvent(this.eventId).subscribe(
      (data: EventParticipant[]) => {
        this.participants_team = data;
      },
      (error: any) => {
        console.error('Error fetching participants:', error);
      }
    );
    
  }
  
    ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.evaluationForm = this.fb.group({});
      const eventIdParam = params['id'];
      console.log('Route params:', params);
      console.log('Event ID from route:', eventIdParam);

      
      if (eventIdParam && !isNaN(+eventIdParam)) {
        this.eventId = +eventIdParam;
        this.teamForm.patchValue({
          event: {
            id: this.eventId
          }
        });
        console.log('Team Management initialized with event ID:', this.eventId);
        
        // Load data
        this.loadTeams();
        this.loadEventCheckpoints(this.eventId);
        this.loadParticipants(this.eventId);
      } else {
        console.error('Invalid event ID in route params:', eventIdParam);
        this.showError('Invalid event ID provided');
        // Navigate back to a safe page
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateEvaluationForm(): void {
    const group: any = {};
    this.checkpoints.forEach((_, i) => {
      group['score' + i] = [null];
    });
    this.evaluationForm = this.fb.group(group);
  }
  
  submitEvaluation(): void {
    const scores = this.evaluationForm.value as { [key: string]: number }; // Type the value explicitly
    const evaluations = this.checkpoints.map((cp, index) => ({
      checkpointId: cp.id,
      teamId: this.selectedTeamObj?.id,
      score: scores['score' + index], // TypeScript now understands this
    }));
  
    this.teamService.submitTeamEvaluation(evaluations).subscribe({
      next: () => this.showSuccess("Team evaluated successfully."),
      error: (err) => {
        console.error(err);
        this.showError("Failed to evaluate team.");
      }
    });
  }

  loadEventCheckpoints(eventId: number): void {
    this.isLoadingEventCheckpoints = true;
    this.checkpointService.getCheckpointsByEventId(eventId).subscribe({
      next: (data) => {
        this.checkpoints = data;
        console.log('Fetched checkpoints:', data);
      },
      error: (err) => {
        console.error('Error fetching checkpoints:', err);
      }
    });
  }
  
  /*onAddEventCheckpoint(): void {
    if (this.eventCheckpointForm.valid) {
      const formValue = this.eventCheckpointForm.value;
      const newCheckpoint: Checkpoint = {
        id: 0,
        title: formValue.title,
        description: formValue.description,
        percentage: formValue.percentage,
        status: 'PENDING',
        eventId: this.eventId,
        deadline: formValue.deadline
      };
  
      this.checkpointService.addCheckpoint(newCheckpoint)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (checkpoint) => {
            this.eventCheckpoints = [...this.eventCheckpoints, checkpoint];
            this.eventCheckpointForm.reset();
            this.showSuccess('Event checkpoint added successfully');
          },
          error: (err) => {
            console.error('Error adding event checkpoint', err);
            this.showError('Failed to add event checkpoint');
          }
        });
    }
  }*/
  
  onDeleteEventCheckpoint(checkpointId: number): void {
    if (confirm('Are you sure you want to delete this event checkpoint?')) {
      this.checkpointService.deleteCheckpoint(checkpointId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.eventCheckpoints = this.eventCheckpoints.filter(c => c.id !== checkpointId);
            this.showSuccess('Event checkpoint deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting event checkpoint:', error);
            this.showError('Failed to delete event checkpoint');
          }
        });
    }
  }

  loadTeams(): void {
    this.teamService.getTeamsByEvent(this.eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (teams: Team[]) => {
          this.teams = teams;
          console.log(this.teams)
          if (teams.length > 0) {
            this.selectTeam(teams[0]);
          }
        },
        error: (error: Error) => {
          console.error('Error loading teams:', error);
          this.showError('Failed to load teams');
        }
      });
  }

  

  selectTeam(team: Team): void {
    this.selectedTeam = team;
    if (this.checkpoints) {
      this.teamCheckpoints = this.checkpoints.filter(c => c.teamId === team.id);
      this.calculateTeamProgress();
    }
  }

  calculateTeamProgress(): void {
    if (!this.teamCheckpoints || this.teamCheckpoints.length === 0) {
      this.teamProgress = 0;
      return;
    }
    
    const totalWeight = this.teamCheckpoints.reduce((sum, checkpoint) => sum + (checkpoint.percentage || 0), 0);
    if (totalWeight === 0) {
      this.teamProgress = 0;
      return;
    }
    
    const completedWeight = this.teamCheckpoints
      .filter(checkpoint => checkpoint.status === 'COMPLETED')
      .reduce((sum, checkpoint) => sum + (checkpoint.percentage || 0), 0);
    
    this.teamProgress = Math.round((completedWeight / totalWeight) * 100);
  }



  loadParticipants(eventId: number): void {
    if (!eventId || isNaN(eventId)) {
      console.error('Invalid event ID for participants:', eventId);
      this.showError('Invalid event ID');
      return;
    }

    console.log('Loading participants for event ID:', eventId);
    this.participantService.getParticipantsByEventAndApproved(eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any[]) => {
          console.log('Loaded participants:', data);
          if (!data || data.length === 0) {
            console.log('No participants found for event ID:', eventId);
          }
          
          this.participants = data.map(eventParticipant => ({
            selected: false,
          participant: {
              id: eventParticipant.participant?.id,
              name: eventParticipant.participant?.name,
              email: eventParticipant.participant?.email,
              role: (eventParticipant.role || 'STUDENT') as 'STUDENT' | 'TEACHER' | 'ADMIN',
              status: (eventParticipant.status || 'APPROVED') as 'PENDING' | 'APPROVED' | 'REJECTED',
              teamId: eventParticipant.teamId,
              eventId: eventId
          }
        }));
      },
      error: (error) => {
          console.error('Error loading participants:', error);
          this.showError('Failed to load participants');
      }
    });
  }
  
  getTeamName(teamId: number): string {
    const team = this.teams.find(t => t.id === teamId);
    return team ? team.teamName : 'Unknown Team';
  }

  getTeamMemberCount(teamId: number): number {
    return this.participants.filter(p => p.participant.teamId === teamId).length;
  }
  

  
  isParticipantInSelectedTeam(participant: Participant): boolean {
    return this.selectedTeam ? participant.teamId === this.selectedTeam.id : false;
  }
 // stores only the team id


assignToTeam() {
  const selectedParticipantIds = this.participants
  .filter(p => p.selected && p.participant.id !== undefined)
  .map(p => p.participant.id!) as number[];

  if (!this.selectedTeam || selectedParticipantIds.length === 0) {
    return;
  }

  if (!this.selectedTeam || !this.selectedTeam.id) {
    this.showError('No team selected.');
    return;
  }
  
  this.teamService.assignParticipants(this.selectedTeam.id, selectedParticipantIds)
    .subscribe({
      next: () => {
        this.showSuccess('Participants assigned successfully');
        this.refreshParticipants(); // reload if needed
      },
      error: err => {
        console.error('Assignment failed', err);
        this.showError('Failed to assign participants');
      }
    });
}




refreshParticipants() {
  this.teamService.getParticipantsByEvent(this.eventId).subscribe(
    (data: EventParticipant[]) => {
      this.participants = data.map((ep: EventParticipant) => ({
        participant: ep.participant, // assuming each EventParticipant has a 'participant' field
        selected: false
      }));
    }
  );
}

  
  private getAssignmentErrorMessage(error: any): string {
    if (error.status === 404) return 'Team or participant not found';
    if (error.status === 400) return error.error?.message || 'Invalid assignment request';
    if (error.status === 409) return 'Some participants are already assigned to other teams';
    return 'Failed to assign participants. Please try again.';
  }

  hasSelectedParticipants(): boolean {
    return this.participants.some(p => p.selected);
  }

  submitEvaluations(evaluations: Evaluation[]) {
    this.teamService.submitTeamEvaluation(evaluations).subscribe({
      next: (response) => {
        console.log('Evaluation successful:', response);
        this.showSuccess('Evaluation submitted!');
      },
      error: (error) => {
        console.error('Evaluation error:', error);
        this.showError('Failed to submit evaluation');
      },
    });
  }

  goBack(): void {
    this.location.back();
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  private showWarning(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  startGrading(team: Team): void {
    this.selectedTeam = team;
    this.gradeForm.reset();
    this.isGrading = true;
  }

  submitGrade(): void {
    if (this.gradeForm.valid && this.selectedTeam) {
      const grade = this.gradeForm.get('grade')?.value || 0;
      const feedback = this.gradeForm.get('feedback')?.value || '';
      
      if (this.selectedTeam.id !== undefined) {
        this.teamGrades[this.selectedTeam.id] = grade;
      }
      
      this.snackBar.open('Grade submitted successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      
      this.isGrading = false;
      this.selectedTeam = null;
      this.gradeForm.reset();
    }
  }

  cancelGrading(): void {
    this.isGrading = false;
    this.selectedTeam = null;
    this.gradeForm.reset();
  }

  getTeamGrade(teamId: number): number {
    return this.teamGrades[teamId] || 0;
  }

  updateTimeline(): void {
    this.timelineCheckpoints = [...this.checkpoints].sort((a, b) => a.percentage - b.percentage);
    
    if (this.timelineCheckpoints.length > 0) {
      const total = this.timelineCheckpoints.reduce((sum, checkpoint) => sum + checkpoint.percentage, 0);
      this.timelineProgress = Math.round(total / this.timelineCheckpoints.length);
      
      this.currentTimelineIndex = this.timelineCheckpoints.findIndex(
        checkpoint => checkpoint.percentage > this.timelineProgress
      );
      if (this.currentTimelineIndex === -1) {
        this.currentTimelineIndex = this.timelineCheckpoints.length - 1;
      }
    }
  }

  getTimelineStatus(checkpoint: Checkpoint, index: number): string {
    if (index < this.currentTimelineIndex) {
      return 'completed';
    } else if (index === this.currentTimelineIndex) {
      return 'current';
    } else {
      return 'upcoming';
    }
  }

  getTimelineIcon(status: string): string {
    switch (status) {
      case 'completed':
        return 'check_circle';
      case 'current':
        return 'radio_button_checked';
      case 'upcoming':
        return 'radio_button_unchecked';
      default:
        return 'radio_button_unchecked';
    }
  }

  getTimelineColor(status: string): string {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'current':
        return '#2196f3';
      case 'upcoming':
        return '#9e9e9e';
      default:
        return '#9e9e9e';
    }
  }

  onCreateTeam() {
    if (this.teamForm.invalid) return;
  
    this.isCreatingTeam = true;
    const payload = this.teamForm.value;

    console.log(payload)
  
    this.teamService.createTeam(payload).subscribe({
      next: (res) => {
        console.log('Team created:', res);
        this.isCreatingTeam = false;
      },
      error: (err) => {
        console.error('Error creating team:', err);
        this.isCreatingTeam = false;
      }
    });
  }

  onRemoveParticipant(team: Team, participant: Participant): void {
    if (team && participant) {
      // Implement participant removal logic here
      this.showSuccess('Participant removed successfully');
    }
  }

  onAddCheckpoint(team: Team): void {
    if (!team?.id) {
      this.showError('No team selected');
      return;
    }

    if (this.checkpointForm.valid) {
      this.isAddingCheckpoint = true;
      const formValue = this.checkpointForm.value;
      const newCheckpoint: Checkpoint = {
        id: 0,
        title: formValue.title,
        description: formValue.description,
        percentage: formValue.percentage,
        status: 'PENDING',
        teamId: team.id,
        deadline: formValue.deadline
      };

      this.checkpointService.addCheckpoint(newCheckpoint)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (checkpoint) => {
            this.checkpoints = [...this.checkpoints, checkpoint];
            this.checkpointForm.reset();
            this.isAddingCheckpoint = false;
            this.showSuccess('Checkpoint added successfully');
            this.updateTimeline();
            this.calculateTeamProgress();
          },
          error: (err) => {
            console.error('Error adding checkpoint', err);
            this.isAddingCheckpoint = false;
            this.showError('Failed to add checkpoint. Please try again.');
          }
        });
    }
  }

  aiAssistantMessage = '';

onGenerateAICheckpoints(): void {
  if (!this.eventId) {
    this.showError('Please wait for event data to load.');
    return;
  }

  const description = this.aiCheckpointForm.get('projectDescription')?.value;
  if (!description) {
    this.showError('Please provide a project description.');
    return;
  }

  this.isGeneratingCheckpoints = true;
  this.aiAssistantMessage = 'Thinking... generating personalized checkpoints...';

  this.aiService.generateCheckpoints(description).pipe(takeUntil(this.destroy$)).subscribe({
    next: (aiResponse: any) => {
      // Optional: show AI assistant text message
      this.aiAssistantMessage = aiResponse.summary || 'Here are the suggested checkpoints for your project.';

      const generatedCheckpoints: Checkpoint[] = aiResponse.checkpoints.map((cp: any) => ({
        id: 0,
        title: cp.title,
        description: cp.description,
        percentage: cp.percentage,
        status: 'PENDING',
        eventId: this.eventId
      }));

      const addRequests = generatedCheckpoints.map((cp: Checkpoint) =>
        this.checkpointService.addCheckpoint(cp)
      );

      forkJoin(addRequests).pipe(takeUntil(this.destroy$)).subscribe({
        next: (addedCheckpoints: Checkpoint[]) => {
          this.checkpoints = [...this.checkpoints, ...addedCheckpoints];
          this.aiCheckpointForm.reset();
          this.isGeneratingCheckpoints = false;
          this.showSuccess('AI checkpoints generated and added successfully');
          this.updateTimeline();
        },
        error: (err: any) => {
          console.error('Error saving checkpoints:', err);
          this.isGeneratingCheckpoints = false;
          this.showError('Failed to add AI-generated checkpoints');
        }
      });
    },
    error: (err: any) => {
      console.error('AI generation failed:', err);
      this.aiAssistantMessage = '';
      this.isGeneratingCheckpoints = false;
      this.showError('Failed to generate checkpoints from AI');
    }
  });
}
  
  
  onTeamChange(): void {
    this.selectedTeamObj = this.teams.find(t => t.id === this.selectedTeam?.id) || null;

    this.loadTeamCheckpoints();
  }
  
  loadTeamCheckpoints(): void {
    const teamId = this.selectedTeam?.id;
    if (!teamId) return;
    this.checkpointService.getTeamCheckpoints(teamId).subscribe({
      next: (data) => this.checkpoints = data,
      error: () => this.checkpoints = []
    });
  }
  

  updateCheckpoint(cp: Checkpoint): void {
    if (cp.id != null) {
      this.checkpointService.updateCheckpoint(cp.id, cp).subscribe({
        next: (updated) => {
          this.showSuccess('Checkpoint updated!');
        },
        error: (err) => {
          console.error('Update failed', err);
          this.showError('Failed to update checkpoint.');
        }
      });
    } else {
      console.error('Checkpoint ID is missing. Cannot update.');
      this.showError('Cannot update checkpoint without an ID.');
    }
  }
  
  deleteCheckpoint(cpId: number): void {
    if (confirm('Are you sure you want to delete this checkpoint?')) {
      this.checkpointService.deleteCheckpoint(cpId).subscribe({
        next: () => {
          this.checkpoints = this.checkpoints.filter(cp => cp.id !== cpId);
          this.showSuccess('Checkpoint deleted!');
        },
        error: (err) => {
          console.error('Delete failed', err);
          this.showError('Failed to delete checkpoint.');
        }
      });
    }
  }
  

  addCheckpoint(): void {
    if (!this.selectedTeam) {
      this.showError('Please select a team first');
      return;
    }
    this.onAddCheckpoint(this.selectedTeam);
  }

}
