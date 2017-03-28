import {Component, OnInit, Input} from '@angular/core';
import {Video} from "../../../shared/models/video";

@Component({
  selector: 'app-video-comments-item',
  templateUrl: 'video-comments-item.component.html'
})
export class VideoCommentsItemComponent implements OnInit {

  @Input() comment: Comment;
  @Input() video: Video;

  constructor() {
  }

  ngOnInit() {
  }
}
