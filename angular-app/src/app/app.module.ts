import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { LoginService } from './services/login.service'
import { RouterModule, Routes } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatIconModule} from '@angular/material/icon';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {MatSelectModule} from '@angular/material/select';

import { AppComponent } from './app.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/loginlayout/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { PostsComponent } from './components/posts/posts.component';
import { PostsService } from './services/posts.service';
import { FriendsComponent } from './components/friends/friends.component';
import { RouteGuard } from './guards/route.guard';
import { FlashMessagesModule,FlashMessagesService  } from 'angular2-flash-messages';
import { LoginGuard } from './guards/login.guard';
import { RegisterComponent } from './components/registerlayout/register/register.component';
import { PostDetailsComponent } from './components/posts/post-details/post-details.component'
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import { MatSnackBarConfig } from '@angular/material';
import { LoginlayoutComponent } from './components/loginlayout/loginlayout.component';
import { RegisterlayoutComponent } from './components/registerlayout/registerlayout.component';

const appRoutes: Routes = [
  {path :'',component:HomeComponent,canActivate:[LoginGuard]},
  {path: 'home', component: HomeComponent, canActivate:[LoginGuard]},
  { path: 'login', component: LoginlayoutComponent,canActivate:[LoginGuard]},
  { path: 'profile',component: ProfileComponent,canActivate:[RouteGuard]},
  {path:'posts',component:PostsComponent,canActivate:[RouteGuard]},
  {path:'friends',component:FriendsComponent,canActivate:[RouteGuard]},
  {path:'register',component:RegisterlayoutComponent,canActivate:[LoginGuard]},
  {path:'postdetails/:id',component:PostDetailsComponent,canActivate:[RouteGuard]},
  {path:'**',redirectTo:'home'}
];


@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    PostsComponent,
    FriendsComponent,
    RegisterComponent,
    PostDetailsComponent,
    LoginlayoutComponent,
    RegisterlayoutComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    FlashMessagesModule,
    BrowserAnimationsModule
  ],
  providers: [MatSnackBar,MatSnackBarConfig,LoginService,PostsService,RouteGuard,FlashMessagesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
