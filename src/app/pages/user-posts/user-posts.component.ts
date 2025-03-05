import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../service/post.service';
import { Post } from '../../interfaces/Post';
// import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-posts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss']
})
export class UserPostsComponent implements OnInit {
  posts: Post[] = [];
  loading: boolean = true;
  error: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(
    private postService: PostService,
    // private authService: AuthService
  ) { this.loadUserPosts(); }

  ngOnInit(): void {
    this.loadUserPosts();
  }

  loadUserPosts(): void {
    this.loading = true;
    this.error = null;

    this.postService.findPostsByCurrentUser().subscribe((response: Post[]) => {
      this.posts = response;
      console.log("own posts:", this.posts);
      this.loading = false;
    }
    );
  }

  get paginatedPosts(): Post[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.posts.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.posts.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPagesArray(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPostDetails(post: Post): void {
    if (post && post.id) {
      console.log(`Navigating to details of post with ID: ${post.id}`);
      // Navigation will be handled by the router link in the template
    } else {
      console.error('Post or Post ID is undefined');
    }
  }

  deletePost(post: Post): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(post.id).subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.id !== post.id);
        },
        error: (err) => {
          console.error('Error deleting post:', err);
          alert('Failed to delete post. Please try again.');
        }
      });
    }
  }
}
