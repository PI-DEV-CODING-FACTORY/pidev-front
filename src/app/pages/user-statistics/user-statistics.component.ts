import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
// import { UserStatisticsService } from '../../services/user-statistics.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
interface UserActivity {
  id: number;
  username: string;
  totalPosts: number;
  totalAnswers: number;
  reputation: number;
  activityByMonth: {
    month: string;
    posts: number;
    answers: number;
  }[];
}
@Component({
  selector: 'app-user-statistics',
  imports: [MatProgressSpinnerModule, MatCardModule, MatIconModule, MatListModule, CommonModule],
  templateUrl: './user-statistics.component.html',
  styleUrl: './user-statistics.component.scss'
})
export class UserStatisticsComponent {
  serActivityData: UserActivity[] = [];
  topUsers: UserActivity[] = [];
  activityChart: any;
  isLoading: boolean = true;
  currentUser: UserActivity | null = null;

  // constructor(private userStatisticsService: UserStatisticsService) { }

  ngOnInit(): void {
    this.loadUserStatistics();
  }

  loadUserStatistics(): void {
    // this.isLoading = true;
    // this.userStatisticsService.getUserStatistics().subscribe({
    //   next: (data) => {
    //     this.userActivityData = data;
    //     this.topUsers = this.getTopUsers(data, 5);
    //     this.currentUser = this.getCurrentUserStats(data);
    //     this.initializeActivityChart();
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Erreur lors du chargement des statistiques:', error);
    //     this.isLoading = false;
    //   }
    // });
  }

  getTopUsers(users: UserActivity[], count: number): UserActivity[] {
    return [...users]
      .sort((a, b) => (b.totalPosts + b.totalAnswers) - (a.totalPosts + a.totalAnswers))
      .slice(0, count);
  }

  getCurrentUserStats(users: UserActivity[]): UserActivity | null {
    // Simuler la récupération de l'utilisateur actuel (normalement via un service d'authentification)
    const currentUserId = 1; // À remplacer par la vraie ID d'utilisateur connecté
    return users.find(user => user.id === currentUserId) || null;
  }

  initializeActivityChart(): void {
    if (!this.currentUser) return;

    const months = this.currentUser.activityByMonth.map(item => item.month);
    const postsData = this.currentUser.activityByMonth.map(item => item.posts);
    const answersData = this.currentUser.activityByMonth.map(item => item.answers);

    const canvas = document.getElementById('activityChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.activityChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Publications',
            data: postsData,
            borderColor: '#3f51b5',
            backgroundColor: 'rgba(63, 81, 181, 0.2)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Réponses',
            data: answersData,
            borderColor: '#ff4081',
            backgroundColor: 'rgba(255, 64, 129, 0.2)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Évolution de votre activité'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mois'
            }
          }
        }
      }
    });
  }

  calculateTotalActivity(user: UserActivity): number {
    return user.totalPosts + user.totalAnswers;
  }

  getUserRank(user: UserActivity): number {
    const allUsers = [...this.serActivityData].sort(
      (a, b) => this.calculateTotalActivity(b) - this.calculateTotalActivity(a)
    );
    return allUsers.findIndex(u => u.id === user.id) + 1;
  }
}
