import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  authenticateUser(user){
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this.http.post<any>('http://localhost:8080/authenticate',user,{headers:headers})
      .pipe(catchError(this.errorHandler));
  }
  registerUser(user){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post<any>('http://localhost:8080/register',user,{headers:headers})
    .pipe(catchError(this.errorHandler));
  }
  errorHandler(error: HttpErrorResponse){
    return throwError(error);
}


}
