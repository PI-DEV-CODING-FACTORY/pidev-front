import { User } from "../pages/service/auth.service";

export enum TypePost {
    question, response
}

export class Post {
    id!: number;
    title!: string;
    content!: string;
    user_id!: string;
    createdAt!: string;
    type!: TypePost;
    parent_post_id?: number;
    tags!: string;
    image!: string;
    bestAnswerId?: number;
    // likes!: number;
    constructor(id: number, title: string, content: string, user_id: string , createdAt: string, type: TypePost, parent_post_id: number, tags: string, image: string,) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.user_id = user_id;
        this.createdAt = createdAt;
        this.type = type;
        this.parent_post_id = parent_post_id;
        this.tags = tags;
        this.image = image;
        // this.likes = likes;
    }
}
