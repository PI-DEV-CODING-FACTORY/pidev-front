export interface AuthenticationResponse {
    jwt: string;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    profilePicture: string;
}