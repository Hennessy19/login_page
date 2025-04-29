import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';
  private cache = new Map<string, { data: any, timestamp: number }>();
  private cacheExpirationMs = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) { }

  // Cache management
  private getCachedData<T>(key: string): T | null {
    if (!this.cache.has(key)) {
      return null;
    }

    const cachedItem = this.cache.get(key)!;
    const now = Date.now();

    if (now - cachedItem.timestamp > this.cacheExpirationMs) {
      this.cache.delete(key);
      return null;
    }

    return cachedItem.data as T;
  }

  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private clearCache(): void {
    this.cache.clear();
  }

  getPosts(page: number = 1, limit: number = 10): Observable<{posts: Post[], total: number}> {
    const cacheKey = `posts-${page}-${limit}`;
    const cachedData = this.getCachedData<{posts: Post[], total: number}>(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get<Post[]>(`${this.apiUrl}/posts`)
      .pipe(
        map(posts => {
          const startIndex = (page - 1) * limit;
          const paginatedPosts = posts.slice(startIndex, startIndex + limit);
          const result = { posts: paginatedPosts, total: posts.length };
          this.setCachedData(cacheKey, result);
          return result;
        }),
        catchError(this.handleError<{posts: Post[], total: number}>('getPosts', {posts: [], total: 0}))
      );
  }

  getPost(id: number): Observable<Post> {
    const cacheKey = `post-${id}`;
    const cachedData = this.getCachedData<Post>(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`)
      .pipe(
        tap(post => this.setCachedData(cacheKey, post)),
        catchError(this.handleError<Post>(`getPost id=${id}`))
      );
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, post)
      .pipe(
        tap(_ => this.clearCache()),
        catchError(this.handleError<Post>('createPost'))
      );
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${post.id}`, post)
      .pipe(
        tap(_ => {
          this.clearCache();
          this.setCachedData(`post-${post.id}`, post);
        }),
        catchError(this.handleError<Post>('updatePost'))
      );
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${id}`)
      .pipe(
        tap(_ => {
          this.clearCache();
          this.cache.delete(`post-${id}`);
        }),
        catchError(this.handleError<any>('deletePost'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Return an empty result to keep the app running
      return of(result as T);
    };
  }
}