import {ListResult} from "../interface/list-result.interface";

export class Video {
  id: number;
  title: string;
  description: string;
  status: string;
  imageName: string;
  videoName: string;
  createdAt: string;
  updatedAt: string;
  miniatureNumber: number;
  videoUrl: string;
  imagesUrl: any;
  imagesThumbsUrl: any;
  user: any;
  lasts: ListResult<Video>;
  comments: ListResult<Comment>;
}
