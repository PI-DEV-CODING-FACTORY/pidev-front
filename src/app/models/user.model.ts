export class User {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    role: string;
    dateOfBirth: Date;
    isActive: boolean;
    createdAt: Date;
    profilePicture: File;
    bachelorDegree: string;
    notesDocument: File;
  
    constructor(
      email: string,
      password: string,
      firstname: string,
      lastname: string,
      role: string,
      dateOfBirth: Date,
      isActive: boolean,
      createdAt: Date,
      profilePicture: File,
      bachelorDegree: string,
      notesDocument: File
    ) {
      this.email = email;
      this.password = password;
      this.firstname = firstname;
      this.lastname = lastname;
      this.role = role;
      this.dateOfBirth = dateOfBirth;
      this.isActive = isActive;
      this.createdAt = createdAt;
      this.profilePicture = profilePicture;
      this.bachelorDegree = bachelorDegree;
      this.notesDocument = notesDocument;
    }
  }