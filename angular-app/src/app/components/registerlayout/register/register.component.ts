import { Component, OnInit,OnDestroy, ViewContainerRef} from '@angular/core';
import { LoginService } from '../../../services/login.service'
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import { MatSnackBarConfig } from '@angular/material';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private username: string;
  private password: string;
  private name: string;
  private registerSub;  
  private hide=true;

  constructor(private loginAuth: LoginService, private router: Router,private matSnackbar: MatSnackBar, private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {

  }

  registerUser(registerForm) {
    let config = new MatSnackBarConfig();
    config.duration = 1500;
    config.viewContainerRef = this.viewContainerRef;
    config.verticalPosition = "bottom";
    // if (this.name == undefined || this.name.trim()==''){
    //   this.matSnackbar.open('Please enter your Name','',config);
    // }
    // else if (this.username == undefined || this.username.trim()=='') {
    //   this.matSnackbar.open('Please enter your Email','',config);
    // }
    // else if(this.password==undefined){
    //   this.matSnackbar.open('Please enter your Password','',config);
    // }
    if(registerForm.form.invalid){
      this.matSnackbar.open('Please enter all the details correctly','',config);
    }
    else {
      let user = {
        name: this.name,
        email: this.username,
        password: this.password
      }
      this.registerSub = this.loginAuth.registerUser(user).subscribe(data => {
        if (data.success) {
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1000);
          this.matSnackbar.open('Registered Successfully','',config);
        }
        else if(data.msg.code==11000) {
          // console.log(data.msg.code)
          this.matSnackbar.open('User already exists','',config);
        }
      }, error => {
        this.matSnackbar.open('Cannot register','',config);
      });
    }
  }

  ngOnDestroy(){
    if (this.registerSub!=undefined) {
      this.registerSub.complete();
  }
  }

}
