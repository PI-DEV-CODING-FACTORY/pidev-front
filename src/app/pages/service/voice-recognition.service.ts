import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  tempWords: string = '';
  text: string = '';
  isRecording = false;
  private voiceToTextSubject: Subject<string> = new Subject();
  voiceToText$ = this.voiceToTextSubject.asObservable();

  constructor() {}

  init() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'fr-FR';
    this.recognition.addEventListener('result', (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      this.tempWords = transcript;
      this.voiceToTextSubject.next(transcript);
      console.log('Transcript', transcript);
    });
  }

  start() {
    this.isStoppedSpeechRecog = false;
    this.isRecording = true;
    this.recognition.start();
    console.log('Speech recognition started');

    this.recognition.addEventListener('end', () => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        this.isRecording = false;
        console.log('End speech recognition');
      } else {
        this.wordConcat();
        this.recognition.start();
      }
    });
  }

  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat();
    this.recognition.stop();
    console.log('End speech recognition');
  }

  wordConcat() {
    this.text = `${this.text} ${this.tempWords}.`;
    this.tempWords = '';
  }
}