import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { PostComponent } from './post/post.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { HackerNewsComponent } from './hacker-news/hacker-news.component';
import { UserStatisticsComponent } from './user-statistics/user-statistics.component';
import { UserPostsComponent } from './user-posts/user-posts.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'post', component: PostComponent },
    { path: 'hackerNews', component: HackerNewsComponent },
    { path: 'postDetails/:id', component: PostDetailsComponent },
    { path: 'userPosts', component: UserPostsComponent },
    { path: 'userStatistics', component: UserStatisticsComponent },
    { path: '**', redirectTo: '/notfound' }

] as Routes;
