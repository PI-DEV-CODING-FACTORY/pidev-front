import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../service/post.service';
import { Post, TypePost } from '../../interfaces/Post';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SplitPipe } from '../post/split.pipe';
import { format } from 'date-fns';
import { VoiceRecognitionService } from '../service/voice-recognition.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService, User } from '../service/auth.service';
@Component({
  selector: 'app-post',
  imports: [CommonModule, FormsModule, SplitPipe, ToastModule,],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  providers: [MessageService]
})
export class PostComponent {
  user!: User;
  message: string = '';
  loggedIn: boolean = false;
  constructor(private router: Router, private postService: PostService, public voiceRecognitionService: VoiceRecognitionService, private messageService: MessageService, private authService: AuthService) {
    
    if (this.inputSubject) {
      this.inputSubject.pipe(
        debounceTime(500),  // Attendez 500ms après la dernière frappe
        switchMap(
          value =>
            this.postService.getResponse("Est ce que ce contenu : " + value + "  contient du code de programmation  . Repondre par vrai ou faux sans details. \n"))// Appeler l'API pour obtenir la réponse)
      ).subscribe((response: string) => {
        console.log("Code :", response);
        if (response == "Vrai.") {
          const inputElement = this.detailsInput.nativeElement.value;
          console.log(inputElement);
          this.postService
            .getResponse("Pseudo Code: \n" + inputElement + " \n A partir de ce pseudo code detecte la ou les  technologie(s) de programmation utilisé(s) sans détails et votre réponse doit etre sous la forme de 'technologie:pourcentage'.")
            .subscribe((response: string) => {

              if (response != null) {
                console.log(response);
                this.technologie = response.split(',').map(item => {
                  // For each pair, split by ':' to separate technology from percentage
                  const parts = item.split(':');
                  return parts[0].trim(); // Return just the technology name (trim to remove extra spaces)
                }).join(', ');

                const badge = document.getElementById('badge');
                if (badge) {
                  badge.classList.toggle("d-none");
                }
                const languageDetectedElement = document.getElementById('language-detected');
                if (languageDetectedElement) {
                  languageDetectedElement.textContent = `${response}`;
                }
              }
            })
        }


      });


    }
    console.log(this.loggedIn);
    this.authService.currentUser.subscribe((currentUser: User | null) => {
      if (currentUser) {

        this.user = currentUser;
        this.loggedIn = true;
        console.log("Current user: ", currentUser);
      } else {
        // Handle the case where currentUser is null
        console.error('User is not logged in');
      }
    });
    this.voiceRecognitionService.init();
  }
  @ViewChild('titleInput') titleInput!: ElementRef;
  @ViewChild('detailsInput') detailsInput!: ElementRef;
  @ViewChild('chatBox') chatBox!: ElementRef;
  @ViewChild('chatbot') chatbot!: ElementRef;
  posts: Post[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  response: string = '';
  messages: { text: string; sender: 'user' | 'bot' }[] = [];
  userInput: string = '';
  isBotTyping: boolean = false;
  technologie: string = '';
  technologiesGetted: string[] = [];
  private inputSubject: Subject<string> = new Subject<string>();
  filteredPosts: Post[] = [];

  selectedPost: any;
  selectedFile: File | null = null;
  selectedFileName: string | undefined;
  public goToPostDetails(post: Post): void {
    if (post && post.id) {
      console.log(`Navigating to details of post with ID: ${post.id}`);
      this.router.navigate(['/pages/postDetails', post.id]);
    } else {
      console.error('Post or Post ID is undefined');
    }
  }
  ngOnInit() {
    this.getPosts();
    this.getTechnologies();
    // this.loadUsernames();
  }

  startRecording() {
    if (!this.voiceRecognitionService.isRecording) {
      this.voiceRecognitionService.start();
      
      // S'abonner aux mises à jour du texte
      this.voiceRecognitionService.voiceToText$.subscribe((text) => {
        this.message = text;
        // Déclencher la détection de technologie
        if (this.detailsInput) {
          this.detailsInput.nativeElement.value = text;
          this.handleType(new Event('input'));
        }
      });
    }
  }

  stopRecording() {
    if (this.voiceRecognitionService.isRecording) {
      this.voiceRecognitionService.stop();
      // Le texte est déjà mis à jour via l'observable
    }
  }

  submitMessage(event: Event) {
    // Handle message submission logic here
    console.log('Message submitted:', this.message);
    this.message = '';
  }
  usernames: { [email: string]: string } = {};
  loadUsernames() {
    
    this.paginatedPosts.forEach(post => {
      const email = post.user_id; // Or post.user.email if structured differently
      if (!this.usernames[email]) {
        this.authService.getUserByEmail(email).subscribe(
        
          user => {
          
            this.usernames[email] = user.firstname+' ' + user.lastname; // Assuming user has firstname and lastname properties
          },
          error => {
            this.usernames[email] = 'Unknown'; // Fallback
          }
          
        );
      }
    });
    console.log(this.usernames);
  }
  public getPosts(): void {
    // if (this.user != null) {
    //   this.postService.findAllPostsWithoutUser().subscribe((response: Post[]) => {
    //     this.posts = response;
    //     console.log("Posts:", this.posts);
    //   });
    // } else {
      this.postService.findAllPostss().subscribe((response: Post[]) => {
        
        this.posts = response.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        console.log("Posts:", this.posts);
        this.loadUsernames(); 
      });
    // }

  }
  public getTechnologies(): void {
    this.postService.findDistinctTechnologies().subscribe((response: string[]) => {
      console.log("Technologies:", response.join(', '));
      const flattenedTechnologies = response
        .flatMap(tech => tech.split(", ").map(item => item.trim()));

      // Étape 2 : Supprimer les doublons avec un Set
      this.technologiesGetted = [...new Set(flattenedTechnologies)];
      console.log("Technologies:", this.technologiesGetted);
    });
  }
  postQuestion() {
    const title = this.titleInput.nativeElement.value;
    const details = this.detailsInput.nativeElement.value;

    if (!title.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Title is required'
      });
      return;
    }

    if (!details.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Details are required'
      });
      return;
    }

    if (details.trim().length < 20) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Details must be at least 20 characters long'
      });
      return;
    }



    if (this.selectedFile != null) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      this.postService.uploadImage(formData).subscribe(
        (imageName: string) => {
          const formattedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
          console.log("User post:"+this.user);
          const post: Post = new Post(0, title, details, this.user.id, formattedDate, TypePost.question, 0, this.technologie, imageName.toString());
          if (post != null) {
            this.postService.addPost(post).subscribe((response: Post) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Post added sucessfully.'
              });
              console.log(response);
              this.getPosts();
              this.getTechnologies();
              this.selectedFileName = "";
              this.selectedFile = null;
              this.titleInput.nativeElement.value = '';
              this.detailsInput.nativeElement.value = '';
              this.toggleQuestionForm();
            });
          }


        });
    } else {
      const formattedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      console.log(formattedDate);
      console.log("User post:"+this.user.id);
      const post: Post = new Post(0, title, details, this.user.id, formattedDate, TypePost.question, 0, this.technologie, '');

      this.postService.addPost(post).subscribe((response: Post) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Post added sucessfully.'
        });

        
        console.log(response);
        this.getPosts();
        this.getTechnologies();
        this.selectedFileName = "";
        this.selectedFile = null;
        this.titleInput.nativeElement.value = '';
        this.detailsInput.nativeElement.value = '';
        this.toggleQuestionForm();
      });
    }
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
    }
    else {
      this.selectedFileName = "choisir une image";
    }
  }

  toggleQuestionForm() {
    const form = document.getElementById("questionForm");

    if (form) {
      form.classList.toggle("d-none");
    }
  }

  get paginatedPosts(): Post[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;


    const postsToPaginate = this.filteredPosts.length > 0 ? this.filteredPosts : this.posts;
    
    return postsToPaginate.slice(startIndex, endIndex);
  
  }

  get totalPages(): number {
    const postsToPaginate = this.filteredPosts.length > 0 ? this.filteredPosts : this.posts;
    return Math.ceil(postsToPaginate.length / this.itemsPerPage);
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
  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message
    this.messages.push({ text: this.userInput, sender: 'user' });

    // Clear input field
    const userMessage = this.userInput;
    this.userInput = '';
    // Show typing indicator
    this.isBotTyping = true;
    // Simulate bot response
    setTimeout(() => {
      this.getBotResponse(userMessage);

      this.scrollToBottom();
    }, 1000);
  }

  getBotResponse(input: string): string {
    this.postService.getResponse(input).subscribe((response: string) => {
      this.response = response;

      if (response != null) {
        this.isBotTyping = false;
        this.messages.push({ text: response, sender: 'bot' });
      }
    });

    return this.response;
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }, 100);
  }

  toggleChatbot() {
    const chat = document.getElementById("chatbot");

    if (chat) {
      this.scrollToBottomPage();
      chat.classList.toggle("d-none");

    }
  }
  scrollToBottomPage() {
   
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight, // Scroll to the bottom of the page
        behavior: 'smooth' 
      });
    }, 100);
  }
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  handleType(event: Event) {
    const inputElement = this.detailsInput.nativeElement;

    // Émettre la valeur de l'input au sujet
    if (inputElement.value.trim() !== '') {
      this.inputSubject.next(inputElement.value);
      const randomColor = this.getRandomColor();
      const languageIndicator = document.getElementById('language-indicator');

      if (languageIndicator) {
        languageIndicator.style.backgroundColor = randomColor;

      }
    } else {
      const badge = document.getElementById('badge');
      if (badge) {
        badge.classList.add("d-none");
      }
    }

  }


  filterPosts(event: Event) {
    const selectedTech = (event.target as HTMLSelectElement).value;

    if (selectedTech) {
      this.filteredPosts = this.posts.filter(post => post.tags.includes(selectedTech));
    } else {
      this.filteredPosts = []; // Réinitialiser les posts filtrés si aucune technologie n'est sélectionnée
    }

    // Réinitialiser la pagination à la première page après le filtrage
    this.currentPage = 1;
  }
  closeChatBot() {
    const chat = document.getElementById("chatbot");
    if (chat) {
      chat.classList.add("d-none");
    }
  }
}



