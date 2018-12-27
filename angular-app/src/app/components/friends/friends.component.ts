import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import { MatSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  private users = [];
  private posts = [];
  private showuser=true;
  private commentEmpty = false;

  constructor(private feedService: FeedService, private router: Router, 
    private viewContainerRef: ViewContainerRef,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getposts();
    // this.getUsers();
    
  }

  postDetails(postid){
    this.router.navigate(['/postdetails',postid]);
}
  getposts() {
    let config = new MatSnackBarConfig(); 
    config.duration = 1500; 
    config.viewContainerRef = this.viewContainerRef; 
    config.verticalPosition = "bottom"
    this.feedService.getPosts().subscribe(data => {
        this.posts = data;
        // console.log(data);
    },error=>{
        if(!error.success){
            this.snackBar.open(error.msg,'',config);
        }
        else{
            this.snackBar.open('Internal error, Please try again later','',config);
        }
    });
}

checkUser(username){
  for( let i=0; i<this.posts.length; i++){
    if(this.posts[i].userId==username){
      return true
    }
  }
  return false
}

getUsers(){
  this.feedService.getUsers().subscribe(data => {
    this.users = data;
    // console.log(data);
});
}
    postComment(validcomment, comment, id) {
        if (comment != '') {
            let token = localStorage.getItem('userToken');
            this.feedService.getUsername(token).subscribe(data => {
                let postedUser = data.name;
                this.feedService.postComments(id, comment, postedUser).subscribe(data => {
                    // console.log(data);
                    this.getposts();
                }, error => {
                    // console.log(error);
                });
            });
        }
        else {
            validcomment.hidden = false;
        }
        // console.log(comment+ " " + user+ " postedUser: "+ postedUser+ " post"+id);

    }

}
