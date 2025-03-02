import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../service/post.service';
import { Post, TypePost } from '../../interfaces/Post';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SplitPipe } from '../post/split.pipe';

import { VoiceRecognitionService } from '../service/voice-recognition.service';
@Component({
  selector: 'app-post',
  imports: [CommonModule, FormsModule, SplitPipe],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {

  message: string = '';
  constructor(private router: Router, private postService: PostService, private voiceRecognitionService: VoiceRecognitionService) {

    if (this.inputSubject) {
      this.inputSubject.pipe(
        debounceTime(500),  // Attendez 500ms après la dernière frappe
        switchMap(value => this.postService.getResponse("Pseudo Code: \n" + value + " \n A partir de ce pseudo code detecte la ou les  technologie(s) de programmation utilisé(s) sans détails et votre réponse doit etre sous la forme de 'technologie:pourcentage'."))// Appeler l'API pour obtenir la réponse)
      ).subscribe((response: string) => {
        if (response != null) {

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
      });


    }
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

  }

  startRecording() {
    this.voiceRecognitionService.start();
  }

  stopRecording() {
    this.voiceRecognitionService.stop();
    this.message += this.voiceRecognitionService.text;
    this.voiceRecognitionService.text = ''; // Clear the recognized text after appending to message
  }

  submitMessage(event: Event) {
    // Handle message submission logic here
    console.log('Message submitted:', this.message);
    this.message = ''; // Clear the input after submission
  }

  public getPosts(): void {
    this.postService.findAllPosts().subscribe((response: Post[]) => {
      this.posts = response;
      console.log("Posts:", this.posts);
    });
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


    if (this.selectedFile != null) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      this.postService.uploadImage(formData).subscribe(
        (imageName: string) => {
          const post: Post = new Post(0, title, details, 0, new Date(), TypePost.question, 0, this.technologie, imageName.toString());
          if (post != null) {
            this.postService.addPost(post).subscribe((response: Post) => {
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
    // // Simple responses (Replace this with API call)
    // const responses: { [key: string]: string } = {
    //   "hello": "Hi there! How can I assist you?",
    //   "how are you": "I'm just a bot, but I'm doing great! 😊",
    //   "bye": "Goodbye! Have a great day! 👋"
    // };
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
    // Wait for the chatbot to be visible, then scroll down
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight, // Scroll to the bottom of the page
        behavior: 'smooth' // Add smooth scrolling
      });
    }, 100); // Delay to ensure the visibility toggle has occurred
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



