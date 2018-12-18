import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { LoginService } from '../../services/login.service';
import { FeedService } from '../../services/feed.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

    private posts = [];
    private post;
    private title;
    private userId;

    constructor(private postService: PostsService,
            private loginService: LoginService,
            private feedService:FeedService,
            private router: Router,
            private flashmessages: FlashMessagesService) { }

    ngOnInit() {
        let token = localStorage.getItem('userToken');
        this.feedService.getUsername(token).subscribe(data=>{
            if(data.tokenexists){
                this.getposts(data.email);
                this.userId = data.email;
            }
        });
    }


    getposts(email) {
        this.postService.getPosts(email).subscribe(data => {
            this.posts = data;
            // console.log(this.posts);
        });
    }

    newpost() {
        if (this.post !=undefined && this.title!=undefined) {
            this.postService.addPost(this.title,this.post, this.userId).subscribe(data => {
                if(data){
                    this.flashmessages.show('Posted Successfully!',{cssClass:'text-success',timeout:1500});
                    this.getposts(this.userId);
                    
                }
                else{
                    this.flashmessages.show('Something went wrong, Please try again',{cssClass:'text-danger',timeout:1500});
                }
            },error=>{
                this.flashmessages.show('Something went wrong, Please try again',{cssClass:'text-danger',timeout:1500});
            });
        }
        else{
            this.flashmessages.show('Please provide the data',{cssClass:'text-danger',timeout:1500});

        }
    }

    postDetails(postid){
        this.router.navigate(['/postdetails',postid]);
    }

    deletePost(postId){
        this.postService.deletePost(postId).subscribe(data=>{
            if(data.success){
                this.flashmessages.show(data.msg,{cssClass:'text-success',timeout:1500})
            }
            else{
                this.flashmessages.show(data.msg,{cssClass:'text-success',timeout:1500})

            }
            this.getposts(this.userId);
        },error=>{
            this.flashmessages.show('something went wrong',{cssClass:'text-success',timeout:1500})
        })
    }


    // postComment(commentarea,user){
    //   console.log(commentarea.value+ ' User is : '+user)
    //   this.postService.postComments(commentarea,user).subscribe(data => {
    //     console.log(data);
    // });
    // }

}
