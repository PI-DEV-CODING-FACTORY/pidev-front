import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { Post } from '../../interfaces/Post';
import { PostService } from '../service/post.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-user-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ToastModule],
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss'],
  providers: [MessageService]
})
export class UserPostsComponent implements OnInit {
  posts: Post[] = [];
  loading = false;
  error = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  editingPost: Post | null = null;
  private editModal: Modal | null = null;

  constructor(private postService: PostService, private router: Router, private messageService: MessageService) { }

  ngOnInit() {
    this.loadPosts();
    this.initializeModal();
  }

  private initializeModal() {
    const modalElement = document.getElementById('editPostModal');
    if (modalElement) {
      this.editModal = new Modal(modalElement);
    }
  }

  loadPosts() {
    this.loading = true;
    this.error = '';
    this.postService.findPostsByCurrentUser().subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
        this.totalPages = Math.ceil(this.posts.length / this.itemsPerPage);
        this.loading = false;
      },

    });
  }

  get paginatedPosts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.posts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  editPost(post: Post) {
    this.editingPost = { ...post };
    this.editModal?.show();
  }
  @ViewChild('editTitle') editTitle!: ElementRef;
  @ViewChild('editContent') editContent!: ElementRef;
  updatePost() {
    const title = this.editTitle.nativeElement.value;
    const content = this.editContent.nativeElement.value;
    if (this.editingPost) {
      if (!title.trim()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'title is required'
        });
        return;// Don't submit empty comments
      }
      if (!content.trim()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'content is required'
        });
        return;// Don't submit empty comments
      }
      this.postService.updatePostById(this.editingPost, this.editingPost.id).subscribe({
        next: () => {
          const index = this.posts.findIndex(p => p.id === this.editingPost?.id);
          if (index !== -1) {
            this.posts[index] = { ...this.editingPost! };

          }
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Post updated sucessfully.'
          });
          this.editModal?.hide();
          this.editingPost = null;
        },

      });
    }
  }

  deletePost(post: Post) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(post.id).subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.id !== post.id);
          this.totalPages = Math.ceil(this.posts.length / this.itemsPerPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Post deleted sucessfully.'
          });
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1;

          }

        },
        error: (error: any) => {
          console.error('Error deleting post:', error);
          // Handle error appropriately
        }
      });
    }
  }
}
