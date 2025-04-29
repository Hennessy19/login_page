import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../models/post';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  postForm: FormGroup;
  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', [Validators.required, Validators.minLength(10)]],
      userId: [1, Validators.required] // Default user ID
    });
  }

  get f() { return this.postForm.controls; }

  onSubmit(): void {
    if (this.postForm.invalid) {
      Object.keys(this.postForm.controls).forEach(key => {
        const control = this.postForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    const newPost: Post = this.postForm.value;

    this.postService.createPost(newPost).subscribe({
      next: (post) => {
        this.submitting = false;
        alert('Post created successfully!');
        this.router.navigate(['/posts']);
      },
      error: (err) => {
        this.submitting = false;
        this.error = 'Failed to create post. Please try again.';
      }
    });
  }
}