import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router){}
  canActivate(): boolean{
    let token = localStorage.getItem('userToken');
    if (!token) {
      return true
    }
    else {
      this.router.navigate(['posts']);
    }
  }
    
}
