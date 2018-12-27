import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { LoginService } from '../../services/login.service';
import { FeedService } from '../../services/feed.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import { MatSnackBarConfig } from '@angular/material';

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
    private selected = 1;
    private update = false;
    private postid;

    constructor(private postService: PostsService,
            private loginService: LoginService,
            private feedService:FeedService,
            private router: Router,public viewContainerRef: ViewContainerRef,
            private snackBar: MatSnackBar) { }

    ngOnInit() {

         let config = new MatSnackBarConfig(); 
        config.duration = 1500; 
        config.viewContainerRef = this.viewContainerRef; 
        config.verticalPosition = "bottom"


        let token = localStorage.getItem('userToken');
        this.feedService.getUsername(token).subscribe(data=>{
            if(data.tokenexists){
                this.getposts(data.email);
                this.userId = data.email;
            }
            
        },error=>{
            if(!error.success){
                this.snackBar.open(error.msg,'',config);
            }
            else{
                this.snackBar.open('Internal error, Please try again later','',config);
            }
        });
    }


    getposts(email) {
        let config = new MatSnackBarConfig(); 
        config.duration = 1500; 
        config.viewContainerRef = this.viewContainerRef; 
        config.verticalPosition = "bottom"
        this.postService.getPosts(email).subscribe(data => {
            this.posts = data;
            // console.log(data.success);
        },error=>{
            if(error.success==false){
                // console.log('hey error');
                this.snackBar.open(error.msg,'',config);
            }else{
                this.snackBar.open('Internal error, Please try again later','',config);
            }
        });
    }

    updatePost(updateForm){
        let config = new MatSnackBarConfig(); 
        config.duration = 1500; 
        config.viewContainerRef = this.viewContainerRef; 
        config.verticalPosition = "bottom"
        if(updateForm.form.invalid){
            this.snackBar.open('Please enter the details correctly','',config);
        }
        else if (this.post !=undefined && this.title!=undefined && this.post.trim()!='' && this.title.trim()!='') {
            this.postService.updatePost(this.title,this.post, this.userId,this.postid).subscribe(data => {
                if(data){
                    // this.flashmessages.show('Posted Successfully!',{cssClass:'text-success',timeout:1500});
                    this.snackBar.open(data.msg,'',config);
                    updateForm.reset();
                    this.update = false;
                    this.selected = 1;
                    this.getposts(this.userId);
                    
                }
                else{
                    this.snackBar.open('Something went wrond, Please try again','',config);
                }
            },error=>{
                console.log(error);
                this.snackBar.open('Something went wrond, Please try again','',config);
            });
        }
        else{
           this.snackBar.open('Something went wrond, Please try again','',config);

        }
    }

    editPost(postid){
        this.selected =0;
        this.postService.getPost(postid).subscribe(data=>{
            this.title = data.title;
            this.post = data.post;
            this.update = true;
            this.postid = data._id;
        },error=>{
            console.log(error);
            
        })
        // this.title = post.title;
        // this.post = post.post;
        // console.log(title);
        
    }

    newpost(postForm) {
        let config = new MatSnackBarConfig(); 
        config.duration = 1500; 
        config.viewContainerRef = this.viewContainerRef; 
        config.verticalPosition = "bottom"
        if(postForm.form.invalid){
            this.snackBar.open('Please enter the details correctly','',config);
        }
        else if (this.post !=undefined && this.title!=undefined && this.post.trim()!='' && this.title.trim()!='') {
            this.postService.addPost(this.title,this.post, this.userId).subscribe(data => {
                if(data){
                    // this.flashmessages.show('Posted Successfully!',{cssClass:'text-success',timeout:1500});
                    this.snackBar.open('Posted Successfully','',config);
                    postForm.reset();
                    this.selected = 1;
                    this.getposts(this.userId);
                    
                }
                else{
                    this.snackBar.open('Something went wrond, Please try again','',config);
                }
            },error=>{
                this.snackBar.open('Something went wrond, Please try again','',config);
            });
        }
        else{
           this.snackBar.open('Something went wrond, Please try again','',config);

        }
    }

    postDetails(postid){
        this.router.navigate(['/postdetails',postid]);
    }

    deletePost(postId){
        let config = new MatSnackBarConfig(); 
        config.duration = 1500; 
        config.viewContainerRef = this.viewContainerRef; 
        config.verticalPosition = "bottom"
        this.postService.deletePost(postId).subscribe(data=>{
            if(data.success){
                this.snackBar.open(data.msg,'',config);
                // this.flashmessages.show(data.msg,{cssClass:'text-success',timeout:1500})
            }
            else{
                this.snackBar.open(data.msg,'',config);
                // this.flashmessages.show(data.msg,{cssClass:'text-success',timeout:1500})

            }
            this.getposts(this.userId);
        },error=>{
            this.snackBar.open('Something went wrond, Please try again','',config);
            // this.flashmessages.show('something went wrong',{cssClass:'text-success',timeout:1500})
        })
    }


    // postComment(commentarea,user){
    //   console.log(commentarea.value+ ' User is : '+user)
    //   this.postService.postComments(commentarea,user).subscribe(data => {
    //     console.log(data);
    // });
    // }

}
