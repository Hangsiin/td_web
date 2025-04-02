/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
  increment,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";

// Post interface
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  category: string;
  views: number;
  commentCount: number;
}

// Comment interface
export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Board service
export const boardService = {
  // Posts collection reference
  postsCollection: collection(db, "posts"),

  // Comments collection reference
  commentsCollection: collection(db, "comments"),

  // Get all categories
  async getCategories() {
    try {
      try {
        const querySnapshot = await getDocs(this.postsCollection);
        const categories = new Set<string>();

        querySnapshot.forEach((doc) => {
          const post = doc.data() as Post;
          if (post.category) {
            categories.add(post.category);
          }
        });

        return Array.from(categories);
      } catch (error) {
        console.error("Error getting categories:", error);
        return [];
      }
    } catch (error) {
      console.error("Error getting categories:", error);
      return [];
    }
  },

  // Get posts with pagination
  async getPosts(
    category: string | null = null,
    searchTerm: string | null = null,
    limitCount: number = 10,
    startAfterDoc: DocumentSnapshot | null = null,
  ) {
    try {
      let q = query(this.postsCollection, orderBy("createdAt", "desc"));

      // Apply category filter if provided
      if (category) {
        q = query(
          this.postsCollection,
          where("category", "==", category),
          orderBy("createdAt", "desc"),
        );
      }

      // Apply search filter if provided
      // searchTerm 사용하지 않는 변수 주석 처리
      // if (searchTerm) {
      //   // Firestore doesn't support text search natively
      //   // This is a workaround that filters results client-side
      //   // Not recommended for large datasets
      // }

      // Apply pagination
      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc), limit(limitCount));
      } else {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      const posts: Post[] = [];
      let lastVisible = null;

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          posts.push({
            id: doc.id,
            ...postData,
          } as Post);
        });

        lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      }

      // Check if there are more posts
      let hasMore = false;
      if (lastVisible) {
        const nextQuery = query(q, startAfter(lastVisible), limit(1));
        const nextSnapshot = await getDocs(nextQuery);
        hasMore = !nextSnapshot.empty;
      }

      return {
        posts,
        lastVisible,
        hasMore,
      };
    } catch (error) {
      console.error("Error getting posts:", error);
      return {
        posts: [],
        lastVisible: null,
        hasMore: false,
      };
    }
  },

  // Get post by ID
  async getPostById(postId: string) {
    try {
      const postRef = doc(this.postsCollection, postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        // Increment view count
        await updateDoc(postRef, {
          views: increment(1),
        });

        return {
          id: postSnap.id,
          ...postSnap.data(),
        } as Post;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting post:", error);
      return null;
    }
  },

  // Create a new post
  async createPost(
    post: Omit<
      Post,
      "id" | "createdAt" | "updatedAt" | "views" | "commentCount"
    >,
    user: User,
  ) {
    try {
      // Validate user
      if (!user || !user.uid) {
        throw new Error("User not authenticated");
      }

      // Validate post data
      if (!post.title || !post.content) {
        throw new Error("Post title and content are required");
      }

      // Create post with additional metadata
      const postData = {
        ...post,
        authorId: user.uid,
        authorName: user.displayName || "익명 사용자",
        authorPhotoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        commentCount: 0,
      };

      // Add to Firestore
      const docRef = await addDoc(this.postsCollection, postData);

      return {
        id: docRef.id,
        ...postData,
      };
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // Update a post
  async updatePost(postId: string, postData: Partial<Post>, userId: string) {
    try {
      // Get the post
      const postRef = doc(this.postsCollection, postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        throw new Error("Post not found");
      }

      const post = postSnap.data() as Post;

      // Check if user is the author
      if (post.authorId !== userId) {
        throw new Error("You don't have permission to edit this post");
      }

      // Update the post
      await updateDoc(postRef, {
        ...postData,
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },

  // Delete a post
  async deletePost(postId: string, userId: string) {
    try {
      // Get the post
      const postRef = doc(this.postsCollection, postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        throw new Error("Post not found");
      }

      const post = postSnap.data() as Post;

      // Check if user is the author
      if (post.authorId !== userId) {
        throw new Error("You don't have permission to delete this post");
      }

      // Delete all comments for this post
      const commentsQuery = query(
        this.commentsCollection,
        where("postId", "==", postId),
      );

      const commentsSnapshot = await getDocs(commentsQuery);

      const deleteCommentPromises = commentsSnapshot.docs.map((commentDoc) =>
        deleteDoc(doc(this.commentsCollection, commentDoc.id)),
      );

      await Promise.all(deleteCommentPromises);

      // Delete the post
      await deleteDoc(postRef);

      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  // Get comments for a post
  async getComments(postId: string) {
    try {
      const q = query(
        this.commentsCollection,
        where("postId", "==", postId),
        orderBy("createdAt", "asc"),
      );

      const querySnapshot = await getDocs(q);
      const comments: Comment[] = [];

      querySnapshot.forEach((doc) => {
        comments.push({
          id: doc.id,
          ...doc.data(),
        } as Comment);
      });

      return comments;
    } catch (error) {
      console.error("Error getting comments:", error);
      return [];
    }
  },

  // Create a new comment
  async createComment(
    comment: Omit<Comment, "id" | "createdAt" | "updatedAt">,
    user: User,
  ) {
    try {
      // Validate user
      if (!user || !user.uid) {
        throw new Error("User not authenticated");
      }

      // Validate comment data
      if (!comment.content || !comment.postId) {
        throw new Error("Comment content and post ID are required");
      }

      // Create comment with additional metadata
      const commentData = {
        ...comment,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Add to Firestore
      const docRef = await addDoc(this.commentsCollection, commentData);

      // Update comment count on the post
      const postRef = doc(this.postsCollection, comment.postId);
      await updateDoc(postRef, {
        commentCount: increment(1),
      });

      return {
        id: docRef.id,
        ...commentData,
      };
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  // Update a comment
  async updateComment(
    commentId: string,
    commentData: Partial<Comment>,
    userId: string,
  ) {
    try {
      // Get the comment
      const commentRef = doc(this.commentsCollection, commentId);
      const commentSnap = await getDoc(commentRef);

      if (!commentSnap.exists()) {
        throw new Error("Comment not found");
      }

      const comment = commentSnap.data() as Comment;

      // Check if user is the author
      if (comment.authorId !== userId) {
        throw new Error("You don't have permission to edit this comment");
      }

      // Update the comment
      await updateDoc(commentRef, {
        ...commentData,
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },

  // Delete a comment
  async deleteComment(commentId: string, userId: string) {
    try {
      // Get the comment
      const commentRef = doc(this.commentsCollection, commentId);
      const commentSnap = await getDoc(commentRef);

      if (!commentSnap.exists()) {
        throw new Error("Comment not found");
      }

      const comment = commentSnap.data() as Comment;

      // Check if user is the author
      if (comment.authorId !== userId) {
        throw new Error("You don't have permission to delete this comment");
      }

      // Delete the comment
      await deleteDoc(commentRef);

      // Update comment count on the post
      const postRef = doc(this.postsCollection, comment.postId);
      await updateDoc(postRef, {
        commentCount: increment(-1),
      });

      return true;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },
};
