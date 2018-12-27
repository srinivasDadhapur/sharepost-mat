import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FeedService } from './feed.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private token = localStorage.getItem('userToken');

  constructor(private http: HttpClient, private feedService: FeedService) {
    // console.log('New instance is created');
    
   }


   getPost(postId){
    let headers = new HttpHeaders().set('Content-Type','application/json').set('authorization',this.token);
    return this.http.post<any>('http://localhost:8080/getpost',{id:postId},{headers:headers}).pipe(catchError(this.errorHandler));
   }

   deletePost(postid){
    let headers = new HttpHeaders().set('Content-Type','application/json').set('authorization',this.token);
    return this.http.post<any>('http://localhost:8080/deletepost',{id:postid},{headers:headers}).pipe(catchError(this.errorHandler)); 
   }


  getPosts(userId) {
    let headers = new HttpHeaders().set('Content-Type','application/json').set('authorization',this.token);
    return this.http.post<any>('http://localhost:8080/getposts',{userId:userId},{headers:headers}).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

  updatePost(title,post,username,postid){
    let headers = new HttpHeaders().set('Content-Type','application/json').set('authorization',this.token);
    return this.http.post<any>('http://localhost:8080/updatepost',{title:title,userId:username,post:post,postid:postid},{headers:headers}).pipe(catchError(this.errorHandler));
  }

  addPost(title,post,username){
    let headers = new HttpHeaders().set('Content-Type','application/json').set('authorization',this.token);
    return this.http.post<any>('http://localhost:8080/post',{title:title,userId:username,post:post},{headers:headers}).pipe(catchError(this.errorHandler));
  }
}
