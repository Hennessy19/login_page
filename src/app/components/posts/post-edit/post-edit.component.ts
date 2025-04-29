import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../models/post';

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
  postForm: FormGroup;
  postId = 0;
  loading = true;
  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', [Validators.required, Validators.minLength(10)]],
      userId: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.postId)) {
      this.error = 'Invalid post ID';
      this.loading = false;
      return;
    }

    this.loadPost();
  }

  loadPost(): void {
    this.postService.getPost(this.postId).subscribe({
      next: (post) => {
        this.postForm.patchValue({
          title: post.title,
          body: post.body,
          userId: post.userId
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load post. Please try again later.';
        this.loading = false;
      }
    });
  }

  get f() { return this.postForm.controls; }

  onSubmit(): void {
    if (this.postForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.postForm.controls).forEach(key => {
        const control = this.postForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    const updatedPost: Post = {
      ...this.postForm.value,
      id: this.postId
    };

    this.postService.updatePost(updatedPost).subscribe({
      next: (post) => {
        this.submitting = false;
        alert('Post updated successfully!');
        this.router.navigate(['/posts', this.postId]);
      },
      error: (err) => {
        this.submitting = false;
        this.error = 'Failed to update post. Please try again.';
      }
    });
  }
}