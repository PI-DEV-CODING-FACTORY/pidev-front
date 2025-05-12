import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        ChartModule,
        TableModule,
        ButtonModule,
        DropdownModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    totalStudents: number = 1234;
    activeApplications: number = 247;
    coursesCount: number = 45;
    enrollmentData: any;
    formationDistributionData: any;  // Keep only this declaration
    successRateData: any;
    latestApplications: any[];
    yearFilter: number = 2023;

    constructor() {
        this.latestApplications = [
            {
                student: 'John Smith',
                applicationId: 'APP-001-123',
                date: '2023-12-12',
                course: 'Informatique',
                status: 'En attente'
            },
            {
                student: 'Sarah Johnson',
                applicationId: 'APP-001-124',
                date: '2023-12-11',
                course: 'Science des Données',
                status: 'Terminé'
            },
            {
                student: 'Mike Brown',
                applicationId: 'APP-001-125',
                date: '2023-12-10',
                course: 'Cybersécurité',
                status: 'Terminé'
            },
            {
                student: 'Emma Davis',
                applicationId: 'APP-001-126',
                date: '2023-12-09',
                course: 'Développement Web',
                status: 'Annulé'
            }
        ];
    }

    // Remove this duplicate declaration
    // formationDistributionData: any;

    ngOnInit() {
        this.initChartData();
        this.initFormationDistribution();
        
    }

    private initFormationDistribution() {
        this.formationDistributionData = {
            datasets: [{
                data: [300, 250, 200, 180, 120],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ],
                label: 'Student Distribution'
            }],
            labels: [
                'Computer Science',
                'Data Science',
                'Cybersecurity',
                'Web Development',
                'AI & Machine Learning'
            ]
        };
    }
    private initChartData() {
        this.enrollmentData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Enrolled',
                    data: [45, 55, 60, 65, 70, 75, 85, 95, 100, 110, 115, 120],
                    backgroundColor: '#8B5CF6',
                    borderRadius: 8
                },
                {
                    label: 'Applications',
                    data: [65, 75, 80, 85, 90, 95, 100, 110, 120, 130, 135, 140],
                    backgroundColor: '#A5B4FC',
                    borderRadius: 8
                }
            ]
        };
        this.successRateData = {  // Use this. to reference the class property
            labels: ['2019', '2020', '2021', '2022', '2023'],
            datasets: [
                {
                    label: 'Success Rate',
                    data: [85, 88, 87, 89, 91],
                    fill: true,
                    borderColor: '#4BC0C0',
                    tension: 0.4,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)'
                }
            ]
        };
    }
}
