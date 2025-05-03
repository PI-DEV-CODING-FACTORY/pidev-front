import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { PostService } from '../service/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post, TypePost } from '../../interfaces/Post';
import { SplitPipe } from '../post/split.pipe';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { format } from 'date-fns';
import { AuthService, User } from '../service/auth.service';
import { NotificationService } from '../service/notification.service';
import { CommentNotificationRequest } from '../../interfaces/CommentNotificationRequest';
interface MentionUser {
  id: number;
  name: string;
  avatar?: string;
}

interface UploadedFile {
  file: File;
  name: string;
  preview: string;
  type: string;
}
@Component({
  selector: 'app-post-details',
  imports: [CommonModule, FormsModule, SplitPipe, ToastModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss',
  providers: [MessageService]
})
export class PostDetailsComponent {
  post!: Post;
  comments: Post[] = [];
  commentText: string = '';
  isSubmitting: boolean = false;

  // Mention system properties
  showMentionDropdown: boolean = false;
  mentionUsers: User[] = [];
  filteredMentionUsers: User[] = [];
  mentionSearchTerm: string = '';
  uploadedFile: UploadedFile | null = null;
  selectedFile: File | null = null;
  selectedFileName: string | undefined;
  // Emoji picker properties
  showEmojiPicker: boolean = false;
  user!: User;
  emojis: string[] = ['😀', '😂', '😊', '❤️', '👍', '🔥', '🎉', '🤔', '😎', '👏',
    '😃', '🥰', '😇', '🙂', '😋', '😉', '😍', '😘', '🤗', '😈',
    '👋', '👌', '✌️', '🤞', '👏', '🙏', '🤝', '💪', '✨', '⭐'];

  // AI Solution properties
  showAiSolutionModal: boolean = false;
  isLoadingAiSolution: boolean = false;
  aiSolution: string | null = null;
  needHelp: boolean = false;


  // likes: number = 0;
  @ViewChild('commentInput') commentInput!: ElementRef;
  constructor(private postService: PostService, private route: ActivatedRoute, private messageService: MessageService, private authService: AuthService, private notificatonService: NotificationService) {
    this.route.params.subscribe(params => {
      this.postService.findPostById(params['id']).subscribe((post: Post) => {
        this.post = post;
        this.getComments(post.id);
        this.loadUserPost(post);

        console.log("Post details: ", this.post);
      });
    });
    this.authService.currentUser.subscribe((currentUser: User | null) => {
      if (currentUser) {
        this.user = currentUser;
        console.log("Current user: ", currentUser);
      } else {
        // Handle the case where currentUser is null
        console.error('User is not logged in');
      }
    });
    this.loadMentionUsers();

  }
  ngOnInit(): void {
    // Load mention users (could be from an API)
    this.loadMentionUsers();
  
  }
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  usernames: { [email: string]: string } = {};
  getComments(postId: number) {
    this.postService.findCommentsByPostId(postId).subscribe((response: Post[]) => {
      // Trier les commentaires par date décroissante, avec la meilleure réponse en premier
      this.comments = response.sort((a, b) => {
        // Si l'un des commentaires est la meilleure réponse, le mettre en premier
        if (this.post.bestAnswerId === a.id) return -1;
        if (this.post.bestAnswerId === b.id) return 1;
        // Sinon, trier par date décroissante

        console.log("Comments Usernames: ", this.usernames);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      this.comments.forEach(comment => {
        const email = comment.user_id; // Or post.user.email if structured differently
        if (!this.usernames[email]) {
          this.authService.getUserByEmail(email).subscribe(

            user => {
            
              this.usernames[email] = user.firstname + ' ' + user.lastname; // Assuming user has firstname and lastname properties
            },
            error => {
              this.usernames[email] = 'Unknown'; // Fallback
            }

          );
        }
      });
      console.log("Comments:", this.comments);
    });
    this.mentionned = false;
  }
  // postComment() {
  //   const comment = this.commentInput.nativeElement.value;

  //   const post: Post = new Post(0, "", comment, 0, new Date(), TypePost.response, this.post.id, "this.technologie", "");
  //   if (post != null) {
  //     this.postService.addPost(post).subscribe((response: Post) => {
  //       console.log(response);
  //       this.getComments(this.post.id);
  //       // this.getTechnologies();
  //       this.commentInput.nativeElement.value = '';
  //     });
  //   }
  // }

  // like() {
  //   if (this.post != null) {
  //     this.likes++;
  //   }
  //   this.post.likes = this.likes;
  //   this.postService.updatePostById(this.post, this.post.id);
  // }

  // Comment form properties


  // MENTION SYSTEM FUNCTIONS
  loadMentionUsers(): void {

    // In a real app, this would be an API call
    this.authService.findAllUsers().subscribe((response: User[]) => {
      this.mentionUsers = response.filter(user => user.id !== this.user.id); // Exclude the current user
      this.filteredMentionUsers = [...this.mentionUsers];
    });
  }

  userPosted!: User;

  loadUserPost(post: Post): void {

    const email = post.user_id;
    this.authService.getUserByEmail(email).subscribe(

      user => {

        this.userPosted = user;
        console.log("UserPosted:" + this.userPosted);
      });

  }
  toggleMentionDropdown(): void {
    this.showMentionDropdown = !this.showMentionDropdown;
    if (this.showEmojiPicker) {
      this.showEmojiPicker = false;
    }
  }

  filterMentionUsers(): void {
    if (!this.mentionSearchTerm) {
      this.filteredMentionUsers = [...this.mentionUsers];
      return;
    }

    const searchTerm = this.mentionSearchTerm.toLowerCase();
    this.filteredMentionUsers = this.mentionUsers.filter(user =>
      user.firstname.toLowerCase().includes(searchTerm)
    );
  }
  mentionnedUser!: User;
  addMention(user: User): void {
    this.commentText += ` @${user.firstname} `;
    this.mentionnedUser = user;
    this.showMentionDropdown = false;
    this.mentionSearchTerm = '';
    this.mentionned = true;
  }




  removeFile(): void {
    this.uploadedFile = null;
  }

  isImageFile(file: UploadedFile): boolean {
    return file.type.startsWith('image/');
  }



  // EMOJI PICKER FUNCTIONS
  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (this.showMentionDropdown) {
      this.showMentionDropdown = false;
    }
  }

  addEmoji(emoji: string): void {
    this.commentText += emoji;
    this.showEmojiPicker = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        alert('Veuillez sélectionner uniquement des fichiers image (JPEG, PNG).');
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.processFile(file);
    }
  }

  processFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const uploadedFile: UploadedFile = {
        file: file,
        name: file.name,
        type: file.type,
        preview: e.target?.result as string || ''
      };
      this.uploadedFile = uploadedFile;

    };

    reader.readAsDataURL(file);
  }
  // SUBMIT COMMENT FUNCTION
  postComment(): void {
    if (!this.commentText.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Comment is required'
      });
      return;// Don't submit empty comments
    }
    if (this.selectedFile != null) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      this.postService.uploadImage(formData).subscribe(
        (imageName: string) => {
          this.isSubmitting = true;
          const formattedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
          const post: Post = new Post(0, "", this.commentText, this.user.id, formattedDate, TypePost.response, this.post.id, "", imageName);
          if (post != null) {
            this.postService.addPost(post).subscribe((response: Post) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Comment added sucessfully.'
              });

              if (this.mentionned) {
                this.notificatonService.createMentionNotification(this.mentionnedUser.id, this.post, this.user.firstname + ' ' + this.user.lastname).subscribe(() => {
                  console.log('Mention notification sent successfully');
                });
                if (this.post.user_id != this.user.id) {
                  this.notificatonService.createCommentNotification(this.post.user_id, this.post, this.user.firstname + ' ' + this.user.lastname).subscribe(() => {
                    console.log('Comment notification sent successfully');
                  });

                }
              }
              else {
                if (this.post.user_id != this.user.id) {
                
                  this.notificatonService.createCommentNotification(this.post.user_id, this.post, this.user.firstname + ' ' + this.user.lastname).subscribe(() => {
                    console.log('Comment notification sent successfully');
                  });

                }
              }
              console.log(response);
              this.getComments(this.post.id);
              this.resetForm();
              this.isSubmitting = false;
              this.uploadedFile = null;
              this.selectedFile = null;
              // this.getTechnologies();
              this.commentInput.nativeElement.value = '';
            });
          }
        });
    } else {
      this.isSubmitting = true;
      const formattedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const post: Post = new Post(0, "", this.commentText, this.user.id, formattedDate, TypePost.response, this.post.id, "", '');
      console.log("Menttioned: ", this.mentionned);
      if (post != null) {

        this.postService.addPost(post).subscribe((response: Post) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Comment added sucessfully.'
          });

          if (this.mentionned) {
            this.notificatonService.createMentionNotification(this.mentionnedUser.id, this.post, this.user.firstname + ' ' + this.user.lastname).subscribe(() => {
              console.log('Mention notification sent successfully');
            });
            if (this.post.user_id != this.user.id) {
           
                this.notificatonService.createCommentNotification(this.post.user_id, this.post, this.user.firstname + ' ' + this.user.lastname).subscribe(() => {
                  console.log('Comment notification sent successfully');
                });
        

            }
          }
          else {
         

            if (this.post.user_id != this.user.id) {
              console.log("User ID: ", this.post.user_id);
              console.log("Current User ID: ", this.user.firstname + ' ' + this.user.lastname);
              this.notificatonService.createCommentNotification(this.post.user_id, this.post, this.user.firstname + ' ' + this.user.lastname).subscribe(() => {
                console.log('Comment notification sent successfully');
              });
            }
          }
          console.log(response);
          this.getComments(this.post.id);
          this.resetForm();
          this.isSubmitting = false;
          this.uploadedFile = null;
          this.selectedFile = null;
          // this.getTechnologies();
          this.commentInput.nativeElement.value = '';
        });
      }
    }
  }

  resetForm(): void {
    this.commentText = '';
    this.showEmojiPicker = false;
    this.showMentionDropdown = false;
  }

  reportPost(post: Post): void {
    if (confirm('Are you sure you want to report this post?')) {
      this.postService.reportPost(post.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Post reported successfully'
          });
        },
        error: (error) => {
          console.error('Error reporting post:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to report post'
          });
        }
      });
    }
  }

  markAsBestAnswer(commentId: number): void {
    this.postService.markAsBestAnswer(this.post.id, commentId).subscribe({
      next: () => {
        this.post.bestAnswerId = commentId;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Comment marked as best answer'
        });
      },
      error: (error) => {
        console.error('Error marking best answer:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to mark comment as best answer'
        });
      }
    });
  }
  mentionned: boolean = false;
  // Click outside handlers
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    // Close mention dropdown when clicking outside
    if (this.showMentionDropdown) {
      const target = event.target as HTMLElement;
      const mentionArea = document.querySelector('.mention-toolbar');
      console.log("Mention area: ", mentionArea);
      if (mentionArea && !mentionArea.contains(target)) {
        this.showMentionDropdown = false;
      }

    }

    // Close emoji picker when clicking outside
    if (this.showEmojiPicker) {
      const target = event.target as HTMLElement;
      const emojiArea = document.querySelector('.dropdown');
      if (emojiArea && !emojiArea.contains(target)) {
        this.showEmojiPicker = false;
      }
    }

    // Close AI solution modal when clicking outside
    if (this.showAiSolutionModal) {
      const target = event.target as HTMLElement;
      const modalContent = document.querySelector('.ai-solution-content');
      if (modalContent && !modalContent.contains(target) && target.className === 'ai-solution-modal show') {
        this.closeAiSolutionModal();
      }
    }
  }

  // AI Solution methods
  generateAISolution(): void {
    this.needHelp = false;
    this.showAiSolutionModal = true;
    this.isLoadingAiSolution = true;
    this.aiSolution = null;

    // Create a prompt for the AI based on the post content
    const prompt = `Please provide the best solution for this question: \n\n${this.post.title}\n\n${this.post.content}`;

    // Call the API
    this.postService.getResponse(prompt).subscribe({
      next: (response: string) => {
        this.aiSolution = response;
        this.isLoadingAiSolution = false;
      },
      error: (error) => {
        console.error('Error generating AI solution:', error);
        this.aiSolution = 'Sorry, there was an error generating a solution. Please try again later.';
        this.isLoadingAiSolution = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to generate AI solution'
        });
      }
    });
    // // Simulate AI processing
    // setTimeout(() => {
    //   this.isLoadingAiSolution = false;
    //   this.aiSolution = 'Here is your AI-generated solution...';
    // }, 2000);
  }

  closeAiSolutionModal(): void {
    this.showAiSolutionModal = false;
  }

}


