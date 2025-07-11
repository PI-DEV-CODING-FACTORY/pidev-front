import { Documentation } from './documentation/documentation';
import { PredictionComponent } from './prediction.component';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Course } from './course/course';
import CourseDetailsComponent from './course/components/courseDetails';
import { CoursesWidget } from './course/components/courseswidget';
import { Routes } from '@angular/router';

import { PostComponent } from './post/post.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { UserPostsComponent } from './user-posts/user-posts.component';
import { UserStatisticsComponent } from './user-statistics/user-statistics.component';
import { HackerNewsComponent } from './hacker-news/hacker-news.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    {
        path: 'courses',
        component: Course,
        children: [
            { path: '', component: CoursesWidget },
            { path: ':id', component: CourseDetailsComponent }
        ]
    },

    {
        path: 'pfe',
        loadChildren: () => import('./pfe/pfe.routes').then((m) => m.PFE_ROUTES)
    },
    { path: 'prediction', component: PredictionComponent },
    { path: 'post', component: PostComponent },
   
    { path: 'postDetails/:id', component: PostDetailsComponent },
    { path: 'userPosts', component: UserPostsComponent },
    { path: 'userStatistics', component: UserStatisticsComponent },
    { path: 'hackerNews', component: HackerNewsComponent },
    { path: 'ai', loadChildren: () => import('./ai/ai.routes').then((m) => m.AI_ROUTES) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
