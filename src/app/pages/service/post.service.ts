import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../../interfaces/Post';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiServerUrl = 'http://localhost:8082';
  private token = "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";
  constructor(private http: HttpClient, private authService: AuthService) { }


  public findAllPostsWithoutUser(): Observable<Post[]> {
    const currentUser = this.authService.currentUserValue;

    return this.http.get<Post[]>(`${this.apiServerUrl}/post/all/${currentUser!.id}`)
  }
  public findAllPostss(): Observable<Post[]> { return this.http.get<Post[]>(`${this.apiServerUrl}/post/all`) }
  public findDistinctTechnologies(): Observable<string[]> { return this.http.get<string[]>(`${this.apiServerUrl}/post/find/technology`) }
  public findPostById(id: number): Observable<Post> { return this.http.get<Post>(`${this.apiServerUrl}/post/find/${id}`) }
  public findCommentsByPostId(id: number): Observable<Post[]> { return this.http.get<Post[]>(`${this.apiServerUrl}/post/find/comment/${id}`) }
  public addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiServerUrl}/post/add`, post)
  }
  public updatePostById(post: Post, id: number): Observable<Post> { return this.http.put<Post>(`${this.apiServerUrl}/post/update/${id}`, post) }
  public deletePost(id: number): Observable<void> { return this.http.delete<void>(`${this.apiServerUrl}/post/delete/${id}`) }
  public getResponse(prompt: string): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<string>(`${this.apiServerUrl}/bot/chat`, {
      headers: headers,
      params: new HttpParams().set('prompt', prompt),
      responseType: 'text' as 'json'
    });
  }
  public uploadImage(formData: FormData): Observable<string> {
    return this.http.post<string>(`${this.apiServerUrl}/post/upload/image`, formData, { responseType: 'text' as 'json' });
  }

  public reportPost(postId: number): Observable<void> {
    return this.http.post<void>(`${this.apiServerUrl}/post/report/${postId}`, null);
  }

  public markAsBestAnswer(postId: number, commentId: number): Observable<void> {
    return this.http.post<void>(`${this.apiServerUrl}/post/best-answer/${postId}/${commentId}`, null);
  }




  public findPostsByCurrentUser(): Observable<Post[]> {
    const currentUser = this.authService.currentUserValue;
    return this.http.get<Post[]>(`${this.apiServerUrl}/post/user/${currentUser!.id}`);
  }

  // Statistics methods
  public getTotalPosts(): Observable<number> {
    return this.http.get<number>(`${this.apiServerUrl}/post/stats/total-posts`);
  }

  public getTotalComments(): Observable<number> {
    return this.http.get<number>(`${this.apiServerUrl}/post/stats/total-comments`);
  }

  public getTotalBestAnswers(): Observable<number> {
    return this.http.get<number>(`${this.apiServerUrl}/post/stats/total-best-answers`);
  }

  public getTopContributors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiServerUrl}/post/stats/top-contributors`);
  }

  public getTopBestAnswerers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiServerUrl}/post/stats/top-best-answerers`);
  }
}
