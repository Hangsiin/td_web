/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { ArrowBackIosNew } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  IconButton,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCurrentUser } from "../../core/auth";
import { Comment, Post, boardService } from "../../core/board";
import { usePageEffect } from "../../core/page";
import { formatDate } from "../../utils/dateUtils";

// 커스텀 아바타 컴포넌트
function CustomAvatar({
  src,
  alt,
  sx,
}: {
  src?: string;
  alt?: string;
  sx?: any;
}) {
  const defaultStyle = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#bdbdbd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "1rem",
    fontWeight: 500,
    ...sx,
  };

  if (src) {
    return <img src={src} alt={alt || "avatar"} style={defaultStyle} />;
  }

  // 이니셜 표시
  const initial = alt ? alt.charAt(0).toUpperCase() : "U";

  return <div style={defaultStyle}>{initial}</div>;
}

export const Component = function PostDetail(): JSX.Element {
  usePageEffect({ title: "TopdownAI - 게시글 상세" });

  const { id = "" } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const user = useCurrentUser();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Load post and comments
  useEffect(() => {
    const loadPostAndComments = async () => {
      if (!id) {
        enqueueSnackbar("게시글 ID가 유효하지 않습니다.", {
          variant: "error",
        });
        navigate("/board");
        return;
      }

      try {
        setIsLoading(true);
        const fetchedPost = await boardService.getPostById(id);
        if (!fetchedPost) {
          enqueueSnackbar("게시글을 찾을 수 없습니다.", {
            variant: "error",
          });
          navigate("/board");
          return;
        }
        setPost(fetchedPost);

        const fetchedComments = await boardService.getComments(id);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error loading post:", error);
        enqueueSnackbar("게시글을 불러오는 중 오류가 발생했습니다.", {
          variant: "error",
        });
        navigate("/board");
      } finally {
        setIsLoading(false);
      }
    };

    loadPostAndComments();
  }, [id, navigate, enqueueSnackbar]);

  const handleDeletePost = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    try {
      setIsLoading(true);
      if (!user || !user.uid) {
        throw new Error("User not authenticated");
      }

      await boardService.deletePost(id, user.uid);
      enqueueSnackbar("게시글이 삭제되었습니다.", {
        variant: "success",
      });
      navigate("/board");
    } catch (error) {
      console.error("Error deleting post:", error);
      enqueueSnackbar("게시글 삭제 중 오류가 발생했습니다.", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !user) return;

    setIsSubmittingComment(true);

    try {
      // Make sure we have all required fields for the comment
      const commentData: Omit<Comment, "id" | "createdAt" | "updatedAt"> = {
        postId: id,
        content: commentText,
        authorId: user.uid,
        authorName: user.displayName ?? "익명 사용자",
        authorPhotoURL: user.photoURL ?? undefined,
      };

      await boardService.createComment(commentData, user);

      // Refresh comments
      const updatedComments = await boardService.getComments(id);
      setComments(updatedComments);
      setCommentText("");
      enqueueSnackbar("댓글이 등록되었습니다.", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      enqueueSnackbar("댓글 등록 중 오류가 발생했습니다.", {
        variant: "error",
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    try {
      if (!user || !user.uid) {
        throw new Error("User not authenticated");
      }

      await boardService.deleteComment(commentId, user.uid);

      // Refresh comments
      const updatedComments = await boardService.getComments(id);
      setComments(updatedComments);

      enqueueSnackbar("댓글이 삭제되었습니다.", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      enqueueSnackbar("댓글 삭제 중 오류가 발생했습니다.", {
        variant: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Card variant="outlined">
            <CardContent>
              <Typography level="h3" color="danger" sx={{ mb: 2 }}>
                오류
              </Typography>
              <Typography>게시글을 찾을 수 없습니다.</Typography>
              <Button
                component={Link}
                to="/board"
                sx={{ mt: 2 }}
                startDecorator={<ArrowBackIosNew />}
              >
                게시판으로 돌아가기
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Button
                component={Link}
                to="/board"
                variant="outlined"
                startDecorator={<ArrowBackIosNew />}
              >
                목록으로
              </Button>

              {user && post.authorId === user.uid && (
                <Stack direction="row" spacing={1}>
                  <Button
                    component={Link}
                    to={`/board/edit/${id}`}
                    variant="outlined"
                    startDecorator="✏️"
                  >
                    수정
                  </Button>
                  <Button
                    variant="outlined"
                    color="danger"
                    startDecorator="🗑️"
                    onClick={handleDeletePost}
                  >
                    삭제
                  </Button>
                </Stack>
              )}
            </Box>

            <Typography level="h2" sx={{ mb: 1 }}>
              {post.title}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CustomAvatar
                  src={post.authorPhotoURL}
                  alt={post.authorName}
                  sx={{ width: 24, height: 24 }}
                />
                <Typography level="body1">{post.authorName}</Typography>
              </Box>
              <Typography level="body1">
                {formatDate(post.createdAt)}
              </Typography>
              <Typography level="body1">조회수: {post.views}</Typography>
              <Typography level="body1" color="primary">
                {post.category}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography level="body1" sx={{ mb: 2 }}>
              {post.content}
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Typography level="body1" color="neutral">
                카테고리: {post.category}
              </Typography>
              <Typography level="body1" color="neutral">
                조회수: {post.views}
              </Typography>
              <Typography level="body1" color="neutral">
                작성일: {formatDate(post.createdAt)}
              </Typography>
              <Typography level="body1" color="neutral">
                수정일: {formatDate(post.updatedAt)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography level="body1" sx={{ mb: 2 }}>
              댓글 ({comments.length})
            </Typography>

            {comments.length > 0 ? (
              <Stack spacing={2} sx={{ mb: 3 }}>
                {comments.map((comment) => (
                  <Card key={comment.id} variant="soft" sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CustomAvatar
                          src={comment.authorPhotoURL}
                          alt={comment.authorName}
                          sx={{ width: 24, height: 24 }}
                        />
                        <Typography level="body1" fontWeight="bold">
                          {comment.authorName}
                        </Typography>
                        <Typography level="body2" color="neutral">
                          {formatDate(comment.createdAt)}
                        </Typography>
                      </Box>
                      {user && comment.authorId === user.uid && (
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="danger"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          🗑️
                        </IconButton>
                      )}
                    </Box>
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      {comment.content}
                    </Typography>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography
                level="body1"
                sx={{ textAlign: "center", my: 4, color: "text.tertiary" }}
              >
                아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
              </Typography>
            )}

            {user ? (
              <form onSubmit={(e) => e.preventDefault()}>
                <FormControl sx={{ mb: 2 }}>
                  <Textarea
                    placeholder="댓글을 입력하세요"
                    minRows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    endDecorator={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          pt: 1,
                        }}
                      >
                        <Button
                          onClick={handleAddComment}
                          loading={isSubmittingComment}
                          startDecorator="📤"
                        >
                          등록
                        </Button>
                      </Box>
                    }
                  />
                </FormControl>
              </form>
            ) : (
              <Box
                sx={{
                  p: 2,
                  textAlign: "center",
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: "sm",
                }}
              >
                <Typography level="body1" sx={{ mb: 1 }}>
                  댓글을 작성하려면 로그인이 필요합니다.
                </Typography>
                <Button
                  component={Link}
                  to="/login"
                  size="sm"
                  variant="outlined"
                >
                  로그인하기
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
