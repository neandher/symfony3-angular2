import {ListResult} from "../interface/list-result.interface";
export class Comment {
  id: number;
  body: string;
  createdAt: string;
  user: any;
  video: any;
  commentChildren: ListResult<Comment>;
}
