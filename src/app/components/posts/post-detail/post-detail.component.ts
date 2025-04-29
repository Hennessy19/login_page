import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../models/post';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.getPost();
  }

  getPost(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error = 'Invalid post ID';
      this.loading = false;
      return;
    }

    this.postService.getPost(id).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load post. Please try again later.';
        this.loading = false;
      }
    });
  }

  deletePost(): void {
    if (!this.post?.id || !confirm('Are you sure you want to delete this post?')) {
      return;
    }

    this.postService.deletePost(this.post.id).subscribe({
      next: () => {
        alert('Post deleted successfully!');
        this.router.navigate(['/posts']);
      },
      error: () => {
        this.error = 'Failed to delete post.';
      }
    });
  }
}