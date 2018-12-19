import { Component, OnInit, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';
import { FeedService } from 'src/app/services/feed.service';
import {MatSnackBar} from '@angular/material';
import { MatSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})

export class PostDetailsComponent implements OnInit {
    @ViewChild('commentvalidref') commentrefvariable: ElementRef;

  private post = {};
  private comment;

  constructor(private route:ActivatedRoute,private postService:PostsService, private feedService: FeedService,
    public viewContainerRef: ViewContainerRef,
            private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  this.getpost();
  }


  getpost(){
    this.postService.getPost(this.route.snapshot.paramMap.get('id')).subscribe(data=>{
      this.post = data;
    //   console.log(this.post);

    });
  }



  postComment(id,commentForm) {
    let config = new MatSnackBarConfig(); 
    config.duration = 1000; 
    config.viewContainerRef = this.viewContainerRef; 
    config.verticalPosition = "bottom"
    if(commentForm.form.invalid || this.comment.trim()==''){
        this.snackBar.open('Write something to comment','',config)
    }

    else if (this.comment != undefined && this.comment.trim()!='') {
        let token = localStorage.getItem('userToken');
        this.feedService.getUsername(token).subscribe(data => {
            let postedUser = data.name;
            this.feedService.postComments(id, this.comment, postedUser).subscribe(data => {
                // console.log(data);
                commentForm.reset();
                this.getpost();
            }, error => {
                // console.log(error);
            });
        });
    }
    // console.log(comment+ " " + user+ " postedUser: "+ postedUser+ " post"+id);

}





}
