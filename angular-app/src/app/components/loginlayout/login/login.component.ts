import { Component, OnInit, ViewChild,ElementRef,ViewContainerRef } from '@angular/core';
import { LoginService } from '../../../services/login.service'
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import { MatSnackBarConfig } from '@angular/material';
// import { SnackBarTemplateComponent }  from '@angular/material';


@ViewChild('')

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username: string;
  public password: string;
  private hide = true;
  constructor(private snackBar: MatSnackBar,private loginAuth: LoginService,
     private router: Router,
     public viewContainerRef: ViewContainerRef,) { }

  ngOnInit() {
    
  }

  loginUser(loginForm) {
    let config = new MatSnackBarConfig(); 
    config.duration = 1500; 
    config.viewContainerRef = this.viewContainerRef; 
    config.verticalPosition = "bottom"
    if (loginForm.form.invalid){
      this.snackBar.open('Please enter all the details correctly','',config);
    }
    else {
      let user = {
        email: this.username,
        password: this.password
      }
      this.loginAuth.authenticateUser(user).subscribe(data => {
        if (data.success) {
          localStorage.setItem('userToken', data.token);
          //console.log(data);
          this.router.navigate(['posts']);
        }
        else {
          this.router.navigate(['loginlayout'])
        }
      }, error => {
        if(error.error.msg=='invalid user'){
          this.snackBar.open('User does not exists', '', config);
          // this.flashmessages.show('User does not exists' , {timeout:1500});
          loginForm.reset();
        }
        else if(error.error.msg='invalid password'){
          this.snackBar.open('Invalid password', '', config);
          //this.flashmessages.show('invalid password' , {timeout:1500});
        }

      });
    }
  }

}
