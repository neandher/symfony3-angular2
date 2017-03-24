import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-video-comments-item',
  templateUrl: 'video-comments-item.component.html'
})
export class VideoCommentsItemComponent implements OnInit {

  @Input() comment: Comment;

  constructor() {
  }

  ngOnInit() {
  }
}
