import { Component, OnInit } from '@angular/core';
import { HackerNewsService } from '../service/HackerNewsService.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hacker-news',
  imports: [CommonModule],
  templateUrl: './hacker-news.component.html',
  styleUrl: './hacker-news.component.scss'
})
export class HackerNewsComponent implements OnInit {
  newsList: any[] = [];
  allNewsIds: number[] = []; // To store all IDs



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

  // Fetch 10 random news
  fetchNews(): void {
    if (this.allNewsIds.length > 0) {
      const randomIds = this.getRandomIds(this.allNewsIds, 10);
      this.fetchDetails(randomIds);
    }
  }

  // Get random IDs from the list of all IDs
  getRandomIds(ids: number[], count: number): number[] {
    const shuffled = [...ids].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Fetch details of news by their IDs
  fetchDetails(ids: number[]): void {
    const newsPromises = ids.map(id =>
      this.http
        .get<any>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .toPromise()
    );

    Promise.all(newsPromises).then(stories => {
      this.newsList = stories;
    });
  }

  // Refresh to fetch different news
  refreshNews(): void {
    this.fetchNews();
  }


















}