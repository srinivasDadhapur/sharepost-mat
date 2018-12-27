import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private token = localStorage.getItem('userToken');

  constructor(private http: HttpClient) { }
  public userid =  localStorage.getItem('userName');

  getPosts() {
    let headers = new HttpHeaders().set('Content-Type','application/json').set('authorization',this.token);
    return this.http.get<any>('http://localhost:8080/getposts',{headers:headers}).pipe(catchError(this.errorHandler));
  }

  logoutToken(clienttoken){
    let headers = new HttpHeaders().set('Content-Type','application/json').set('authorization',clienttoken);
    return this.http.post<any>('http://localhost:8080/logout',{token:clienttoken},{headers:headers}).pipe(catchError(this.errorHandler));
  }

  getUsers() {
    let headers = new HttpHeaders().set('Content-Type','application/json').set('authorization',this.token);
    return this.http.get<any>('http://localhost:8080/getusers',{headers:headers}).pipe(catchError(this.errorHandler));
  }

  getUsername(clienttoken){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post<any>('http://localhost:8080/jwtaccess',{token:clienttoken},{headers:headers}).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
  postComments(id, comment, user) {
    // let token = localStorage.getItem('userToken');
    let headers = new HttpHeaders().set('Content-Type','application/json').set('authorization',this.token);
    return this.http.put<any>('http://localhost:8080/postcomment',{comment:comment,user:user,id:id},{headers:headers}).pipe(catchError(this.errorHandler));
  }
  addPost(post,username){
    let headers = new HttpHeaders().set('Content-Type','application/json').set('authorization',this.token);
    return this.http.post<any>('http://localhost:8080/post',{userId:username,post:post},{headers:headers}).pipe(catchError(this.errorHandler));
  }
}
