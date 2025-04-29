import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { PostDetailComponent } from './components/posts/post-detail/post-detail.component';
import { PostCreateComponent } from './components/posts/post-create/post-create.component';
import { PostEditComponent } from './components/posts/post-edit/post-edit.component';
import { FormValidatorDemoComponent } from './components/form-validator-demo/form-validator-demo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'posts', component: PostListComponent },
  { path: 'posts/create', component: PostCreateComponent },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: 'posts/:id/edit', component: PostEditComponent },
  {path: 'form-validator', component: FormValidatorDemoComponent},
];