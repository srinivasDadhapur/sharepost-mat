import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';
import {MatSnackBar} from '@angular/material';
import { MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  constructor(private feedService: FeedService,private router: Router,
    public viewContainerRef: ViewContainerRef,private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  checkUser(): boolean{
    if(localStorage.getItem('userToken')){
      return true;
    }
    return false;
  }
  clearItem(){
    let config = new MatSnackBarConfig(); 
    config.duration = 1500; 
    config.viewContainerRef = this.viewContainerRef; 
    config.verticalPosition = "bottom"
    let token = localStorage.getItem('userToken');
    this.feedService.logoutToken(token).subscribe(data=>{
    this.snackBar.open('Logged Out Successfully','',config)
    },error=>{
      if(!error.success){
        this.snackBar.open(error.msg,'',config);
      }
    })
    localStorage.removeItem('userToken');
  }



}
