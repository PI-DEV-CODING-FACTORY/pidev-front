import { User } from "../pages/service/auth.service";
import { Post } from "./Post";

export interface CommentNotificationRequest {
  user: User;
  post: Post;
  commenterName: string;
}
