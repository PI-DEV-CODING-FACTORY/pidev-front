import { User } from "../pages/service/auth.service";
import { Post } from "./Post";

export interface CommentNotificationRequest {
  user_id: string;
  post: Post;
  commenterName: string;
}
