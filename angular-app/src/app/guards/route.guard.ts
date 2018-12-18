import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FeedService } from '../services/feed.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {

  private tokenbool = 'Not initialized';
  constructor(private router: Router, private feedService: FeedService) {
  }
  canActivate(): boolean {
    let token = localStorage.getItem('userToken');
    // let tokenval = this.feedService.getUsername(token).subscribe(
    //   data => {
    //     if (data.tokenexists) {
    //       return true
    //     }
    //   }
    // );

    if (!token) {
      this.router.navigate(['login']);
    }
    else {
      return true;
    }

    // if (tokenval) {
    //   console.log(tokenval);
    //   return true;
    // }
    // else {
    //   console.log('no constructor called');
    //   this.router.navigate(['login']);
    // }
  }
}
