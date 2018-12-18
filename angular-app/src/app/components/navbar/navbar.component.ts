import { Component, OnInit } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  constructor(private feedService: FeedService) { }

  ngOnInit() {
  }

  checkUser(): boolean{
    if(localStorage.getItem('userToken')){
      return true;
    }
    return false;
  }
  clearItem(){
    let token = localStorage.getItem('userToken');
    this.feedService.logoutToken(token).subscribe(data=>{
    alert(data.msg);
    },error=>{

    })
    localStorage.removeItem('userToken');
  }



}
