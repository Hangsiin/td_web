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
  DocumentData,
  Query,
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

      // Apply pagination
      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      // Apply limit
      q = query(q, limit(limitCount + 1)); // Get one extra to check if there are more

      // Execute query
      try {
        const querySnapshot = await getDocs(q);
        const posts: Post[] = [];
        let lastVisible: DocumentSnapshot | null = null;
        let hasMore = false;

        if (!querySnapshot.empty) {
          // Check if there are more posts
          if (querySnapshot.docs.length > limitCount) {
            hasMore = true;
            querySnapshot.docs.pop(); // Remove the extra document
          }

          // Get the last visible document for pagination
          lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

          // Convert documents to posts
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            posts.push({
              id: doc.id,
              title: data.title,
              content: data.content,
              authorId: data.authorId,
              authorName: data.authorName,
              authorPhotoURL: data.authorPhotoURL,
              category: data.category,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              commentCount: data.commentCount || 0,
            } as Post);
          });
        }

        return { posts, lastVisible, hasMore };
      } catch (error) {
        console.error("Error getting posts:", error);
        return { posts: [], lastVisible: null, hasMore: false };
      }
    } catch (error) {
      console.error("Error getting posts:", error);
      return { posts: [], lastVisible: null, hasMore: false };
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
        throw new Error("Post not found");
      }
    } catch (error) {
      console.error("Error getting post:", error);
      throw error;
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
    if (!user || !user.uid) {
      console.error("Error creating post: User is not authenticated");
      throw new Error("사용자 인증이 필요합니다. 다시 로그인해주세요.");
    }

    // 데이터 유효성 검사
    if (!post.title || !post.content) {
      console.error("Error creating post: Missing required fields");
      throw new Error("제목과 내용은 필수 입력 항목입니다.");
    }

    try {
      console.log("Creating post with data:", {
        ...post,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
      });

      const newPost = {
        ...post,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorPhotoURL: user.photoURL || undefined,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        commentCount: 0,
      };

      // 서버 타임스탬프 대신 클라이언트 타임스탬프 사용 (에뮬레이터 문제 해결용)
      if (import.meta.env.DEV) {
        const now = Timestamp.now();
        newPost.createdAt = now;
        newPost.updatedAt = now;
      }

      const docRef = await addDoc(this.postsCollection, newPost);
      console.log("Post created successfully with ID:", docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error("Error creating post:", error);

      // 오류 세부 정보 로깅
      if (error.code) {
        console.error(`Firebase error code: ${error.code}`);
      }
      if (error.message) {
        console.error(`Error message: ${error.message}`);
      }

      // 사용자 친화적인 오류 메시지 반환
      if (error.code === "permission-denied") {
        throw new Error("권한이 없습니다. 로그인 상태를 확인해주세요.");
      } else if (error.code === "unavailable") {
        throw new Error(
          "Firebase 서비스에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.",
        );
      } else {
        throw new Error(
          "게시글을 저장하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );
      }
    }
  },

  // Update a post
  async updatePost(postId: string, postData: Partial<Post>, userId: string) {
    try {
      const postRef = doc(this.postsCollection, postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        throw new Error("Post not found");
      }

      const post = postSnap.data() as Post;

      // Check if the user is the author of the post
      if (post.authorId !== userId) {
        throw new Error("Unauthorized: You are not the author of this post");
      }

      await updateDoc(postRef, {
        ...postData,
        updatedAt: serverTimestamp(),
      });

      return postId;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },

  // Delete a post
  async deletePost(postId: string, userId: string) {
    try {
      const postRef = doc(this.postsCollection, postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        throw new Error("Post not found");
      }

      const post = postSnap.data() as Post;

      // Check if the user is the author of the post
      if (post.authorId !== userId) {
        throw new Error("Unauthorized: You are not the author of this post");
      }

      // Delete all comments for this post
      const commentsQuery = query(
        this.commentsCollection,
        where("postId", "==", postId),
      );

      const commentsSnapshot = await getDocs(commentsQuery);

      const deleteCommentPromises = commentsSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref),
      );

      await Promise.all(deleteCommentPromises);

      // Delete the post
      await deleteDoc(postRef);

      return postId;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  // Get comments for a post
  async getComments(postId: string) {
    try {
      const commentsQuery = query(
        this.commentsCollection,
        where("postId", "==", postId),
        orderBy("createdAt", "asc"),
      );

      const querySnapshot = await getDocs(commentsQuery);

      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Comment,
      );
    } catch (error) {
      console.error("Error getting comments:", error);
      throw error;
    }
  },

  // Create a new comment
  async createComment(
    comment: Omit<Comment, "id" | "createdAt" | "updatedAt">,
    user: User,
  ) {
    try {
      // Check if the post exists
      const postRef = doc(this.postsCollection, comment.postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        throw new Error("Post not found");
      }

      const newComment = {
        ...comment,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorPhotoURL: user.photoURL || undefined,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(this.commentsCollection, newComment);

      // Increment comment count on the post
      await updateDoc(postRef, {
        commentCount: increment(1),
      });

      return docRef.id;
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
      const commentRef = doc(this.commentsCollection, commentId);
      const commentSnap = await getDoc(commentRef);

      if (!commentSnap.exists()) {
        throw new Error("Comment not found");
      }

      const comment = commentSnap.data() as Comment;

      // Check if the user is the author of the comment
      if (comment.authorId !== userId) {
        throw new Error("Unauthorized: You are not the author of this comment");
      }

      await updateDoc(commentRef, {
        ...commentData,
        updatedAt: serverTimestamp(),
      });

      return commentId;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },

  // Delete a comment
  async deleteComment(commentId: string, userId: string) {
    try {
      const commentRef = doc(this.commentsCollection, commentId);
      const commentSnap = await getDoc(commentRef);

      if (!commentSnap.exists()) {
        throw new Error("Comment not found");
      }

      const comment = commentSnap.data() as Comment;

      // Check if the user is the author of the comment
      if (comment.authorId !== userId) {
        throw new Error("Unauthorized: You are not the author of this comment");
      }

      // Decrement comment count on the post
      const postRef = doc(this.postsCollection, comment.postId);
      await updateDoc(postRef, {
        commentCount: increment(-1),
      });

      // Delete the comment
      await deleteDoc(commentRef);

      return commentId;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },
};
