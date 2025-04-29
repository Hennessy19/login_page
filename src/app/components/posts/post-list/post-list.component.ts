import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../models/post';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  error = '';
  currentPage = 1;
  pageSize = 10;
  totalPosts = 0;
  totalPages = 0;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    console.log('Loading posts...');
    this.loading = true;
    this.postService.getPosts(this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          console.log('Posts loaded: ✅✅', data);
          this.posts = data.posts;
          this.totalPosts = data.total;
          this.totalPages = Math.ceil(this.totalPosts / this.pageSize);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load posts. Please try again later.';
          this.loading = false;
        }
      });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.loadPosts();
  }

  deletePost(id: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(id).subscribe({
        next: () => {
          this.posts = this.posts.filter(post => post.id !== id);
          alert('Post deleted successfully!');
        },
        error: () => {
          this.error = 'Failed to delete post.';
        }
      });
    }
  }

  get pages(): number[] {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}