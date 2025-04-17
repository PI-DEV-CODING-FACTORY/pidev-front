import { Chart, ChartConfiguration, ChartTypeRegistry, plugins, Title } from 'chart.js/auto';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { forkJoin } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../service/auth.service';
import { UserStatisticsService } from '../service/user-statistics.service';
import { PostService } from '../service/post.service';
@Component({
  selector: 'app-user-statistics',
  imports: [MatProgressSpinnerModule, MatCardModule, MatIconModule, MatListModule, CommonModule, ChartModule,],
  templateUrl: './user-statistics.component.html',
  styleUrl: './user-statistics.component.scss'
})
export class UserStatisticsComponent implements OnInit, OnDestroy {
  totalPosts: number = 0;
  totalComments: number = 0;
  totalBestAnswers: number = 0;
  topContributors: any[] = [];
  activityScore: { [key: string]: number } = {};
  topBestAnswerers: any[] = [];

  chartData: any;
  technologiesChart: Chart | null = null;
  postsDateChart: Chart | null = null;
  chartOptions: any;
  isLoading: boolean = true;
  technologiesDistribution: string[] = [];
  postsByDate: { date: string; count: number }[] = [];
  user: User | null = null;

  constructor(
    private userStatisticsService: UserStatisticsService,
    private authService: AuthService,
    private postService: PostService
  ) {
    this.loadAllStatistics();

    this.authService.currentUser.subscribe((currentUser: User | null) => {
      if (currentUser) {
        this.user = currentUser;
        console.log("Current user: ", currentUser);
      } else {
        // Handle the case where currentUser is null
        console.error('User is not logged in');
      }
    });
  }

  ngOnInit(): void {
    this.loadAllStatistics();
  }

  ngOnDestroy(): void {
    if (this.technologiesChart) {
      this.technologiesChart.destroy();
    }
    if (this.postsDateChart) {
      this.postsDateChart.destroy();
    }
  }
  topUsers: User[] = [];
  loadAllStatistics(): void {
    this.isLoading = true;

    // Load total posts count
    this.userStatisticsService.getTotalPosts().subscribe({
      next: (count) => {
        this.totalPosts = count;
      },
      error: (error) => console.error('Error loading total posts:', error)
    });

    // Load total comments count
    this.userStatisticsService.getTotalComments().subscribe({
      next: (count) => {
        this.totalComments = count;
      },
      error: (error) => console.error('Error loading total comments:', error)
    });

    // Load total best answers count
    this.userStatisticsService.getTotalBestAnswers().subscribe({
      next: (count) => {
        this.totalBestAnswers = count;
      },
      error: (error) => console.error('Error loading total best answers:', error)
    });

    // Load top contributors
    this.userStatisticsService.getTopContributors().subscribe({
      next: (data) => {
        this.topContributors = data.map(contributor => ({
          ...contributor,
          activityScore: this.calculateActivityScore(contributor)
        }));
        this.topContributors.sort((a, b) => b.activityScore - a.activityScore);
      },
      error: (error) => console.error('Error loading top contributors:', error)
    });


    // Load top best answerers
    this.userStatisticsService.getTopBestAnswerers().subscribe({
      next: (data) => {
        this.topBestAnswerers = data;
      },
      error: (error) => console.error('Error loading top best answerers:', error)
    });

    // Load technologies distribution
    this.userStatisticsService.getTechnologiesDistribution().subscribe({
      next: (data) => {
        // Split technologies by comma and trim
        this.technologiesDistribution = data.flatMap(tech =>
          tech.split(',').map(t => t.trim())
        );
        this.initializeTechnologiesChart();
      },
      error: (error) => {
        console.error('Error loading technologies distribution:', error);
      }
    });

    // Load posts by date
    this.postService.findAllPostss().subscribe({
      next: (posts) => {
        // Group posts by date and count
        const postsByDate = posts.reduce((acc: { [key: string]: number }, post) => {
          const date = new Date(post.createdAt).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Convert to array and sort by date
        this.postsByDate = Object.entries(postsByDate)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        this.initializePostsDateChart();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading posts by date:', error);
        this.isLoading = false;
      }
    });
  }


  initializeTechnologiesChart(): void {
    if (this.technologiesChart) {
      this.technologiesChart.destroy();
    }

    const canvas = document.getElementById('technologiesChart') as HTMLCanvasElement;
    if (!canvas) return;

    const techCounts = this.technologiesDistribution.reduce((acc: { [key: string]: number }, tech: string) => {
      acc[tech] = (acc[tech] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: Object.keys(techCounts),
      datasets: [{
        data: Object.values(techCounts),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }]
    };

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Technology distribution'
          }
        }
      }
    };

    this.technologiesChart = new Chart(canvas, config);
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    if (!this.technologiesDistribution || this.technologiesDistribution.length === 0) {
      console.warn('No technology distribution data available');
      return;
    }

    if (this.technologiesChart) {
      this.technologiesChart.destroy();
    }



    // Générer des couleurs dynamiquement en fonction du nombre de technologies
    const generateColors = (count: number): string[] => {
      const baseColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        '#FF99E6', '#99FF99', '#FFFF99', '#FF99CC', '#99CCFF', '#FF99FF'
      ];

      if (count <= baseColors.length) {
        return baseColors.slice(0, count);
      }

      // Si plus de technologies que de couleurs de base, générer des couleurs supplémentaires
      const colors = [...baseColors];
      for (let i = baseColors.length; i < count; i++) {
        const hue = (i * 137.508) % 360; // Nombre d'or pour une meilleure distribution
        colors.push(`hsl(${hue}, 70%, 60%)`);
      }
      return colors;
    };





    this.technologiesChart = new Chart(canvas, config);


  }

  initializePostsDateChart(): void {
    const dates = this.postsByDate.map(item => item.date);
    const counts = this.postsByDate.map(item => item.count);

    this.chartData = {
      labels: dates,
      plugins: [Title],
      datasets: [{
        label: 'Posts by Date',
        data: counts,
        backgroundColor: '#3f51b5',
      }]
    };

    this.chartOptions = {
      plugins: {
        title: {
          display: true,
          text: 'Posts by Date',
          color: '#495057',
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 30
          }
        },
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },

      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#495057',
            stepSize: 1
          },
          grid: {
            color: '#ebedef'
          }
        },
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };
  }




  calculateActivityScore(user: any): number {
    const postWeight = 1;
    const answerWeight = 2;
    const bestAnswerWeight = 3;

    return (
      (user.totalPosts || 0) * postWeight +
      (user.totalAnswers || 0) * answerWeight +
      (user.bestAnswersCount || 0) * bestAnswerWeight
    );
  }

  // getUserRank(user: UserActivity): number {
  //   const allUsers = [...this.serActivityData].sort(
  //     (a, b) => this.calculateTotalActivity(b) - this.calculateTotalActivity(a)
  //   );
  //   return allUsers.findIndex(u => u.id === user.id) + 1;
  // }
}
