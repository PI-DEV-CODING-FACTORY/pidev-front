import { Component, OnInit } from '@angular/core';
import { HackerNewsService } from '../service/HackerNewsService.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-hacker-news',
  imports: [CommonModule, CardModule, ButtonModule, ProgressSpinnerModule, TagModule, DividerModule],
  templateUrl: './hacker-news.component.html',
  styleUrl: './hacker-news.component.scss'
})
export class HackerNewsComponent implements OnInit {
  newsList: any[] = [];
  allNewsIds: number[] = []; // To store all IDs
  loading: boolean = true;



  constructor(private http: HttpClient, private hackerNewsService: HackerNewsService) { }

  ngOnInit(): void {
    this.fetchAllNewsIds();
  }

  // Fetch all IDs once
  fetchAllNewsIds(): void {
    this.hackerNewsService.getTopStories()
      .subscribe((ids: number[]) => {
        this.allNewsIds = ids;
        this.fetchNews(); // Fetch the initial 10 news
      });
  }

  // Fetch first 20 news items
  fetchNews(): void {
    if (this.allNewsIds.length > 0) {
      // Take only the first 20 IDs from the list
      const firstTwentyIds = this.allNewsIds.slice(0, 20);
      this.fetchDetails(firstTwentyIds);
    }
  }


  // Fetch details of news by their IDs
  fetchDetails(ids: number[]): void {
    this.loading = true;
    const newsPromises = ids.map(id =>
      this.http
        .get<any>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .toPromise()
        .then(story => {
          if (story && story.url) {
            // Add a placeholder image URL
            story.imageUrl = `https://picsum.photos/seed/${story.id}/300/200`;
          }
          return story;
        })
    );

    Promise.all(newsPromises).then(stories => {
      this.newsList = stories.filter(story => story !== null);
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching news details:', error);
      this.loading = false;
    });
  }

  // Refresh to fetch different news
  refreshNews(): void {
    this.fetchNews();
  }


















}