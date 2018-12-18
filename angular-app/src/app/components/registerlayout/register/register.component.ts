import { Component, OnInit,OnDestroy} from '@angular/core';
import { LoginService } from '../../../services/login.service'
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public username: string;
  public password: string;
  public name: string;
  private registerSub;  

  constructor(private loginAuth: LoginService, private router: Router,private flashmessages: FlashMessagesService) { }

  ngOnInit() {

  }

  registerUser() {

    if (this.name == undefined && this.name.trim()==''){
      return this.flashmessages.show('please enter your name' , {cssClass: 'alert-danger',timeout:1000});
    }
    else if (this.username == undefined && this.username.trim()=='') {
      return this.flashmessages.show('please enter your email' , {cssClass: 'alert-danger',timeout:1000});
    }
    else if(this.password==undefined){
      return this.flashmessages.show('please enter password' , {cssClass: 'alert-danger',timeout:1000});
    }
    else {
      let user = {
        name: this.name,
        email: this.username,
        password: this.password
      }
      this.registerSub = this.loginAuth.registerUser(user).subscribe(data => {
        if (data.success) {
          this.router.navigate(['login']);
          this.flashmessages.show('registered successfully' , {cssClass: 'alert-danger',timeout:1500});
        }
        else if(data.msg.code==11000) {
          // console.log(data.msg.code)
          this.flashmessages.show('User Already Exists',{cssClass:'alert-danger',timeout:1500});
        }
      }, error => {
          this.flashmessages.show('Cannot register' , {cssClass: 'alert-danger',timeout:1500});
      });
    }
  }

  ngOnDestroy(){
    if (this.registerSub!=undefined) {
      this.registerSub.complete();
  }
  }

}
