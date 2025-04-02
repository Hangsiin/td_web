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
  FormLabel,
  IconButton,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCurrentUser } from "../../core/auth";
import { usePageEffect } from "../../core/page";
import { boardService, Post, Comment } from "../../core/board";
import { formatDate } from "../../utils/dateUtils";
import { useSnackbar } from "notistack";

// 커스텀 아바타 컴포넌트
function CustomAvatar({
  src,
  alt,
  sx,
}: {
  src?: string;
  alt?: string;
  sx?: Record<string, unknown>;
}) {
  const initials = alt
    ? alt
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const colorFromName = (name?: string): string => {
    if (!name) return "#9c27b0";
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    return colors[hash % colors.length];
  };

  return (
    <div
      style={{
        width:
          typeof sx?.width === "number" || typeof sx?.width === "string"
            ? sx.width
            : 40,
        height:
          typeof sx?.height === "number" || typeof sx?.height === "string"
            ? sx.height
            : 40,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: src ? "transparent" : colorFromName(alt),
        overflow: "hidden",
        ...sx,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "User avatar"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ color: "#fff", fontWeight: "bold" }}>{initials}</span>
      )}
    </div>
  );
}

export const Component = function PostDetail(): JSX.Element {
  usePageEffect({ title: "TopdownAI - 게시글" });

  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const user = useCurrentUser();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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

      await boardService.deletePost(id!, user.uid);
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
        postId: id!,
        content: commentText,
        authorId: user.uid,
        authorName: user.displayName ?? "익명 사용자",
        authorPhotoURL: user.photoURL ?? undefined,
      };

      await boardService.createComment(commentData, user);

      // Refresh comments
      const updatedComments = await boardService.getComments(id!);
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
      const updatedComments = await boardService.getComments(id!);
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
              <Typography level="body1">조회 {post.views}</Typography>
              <Typography level="body1">댓글 {post.commentCount}</Typography>
              <Typography level="body1">카테고리: {post.category}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontFamily: "monospace",
                mb: 3,
              }}
            >
              {post.content}
            </Typography>
          </CardContent>
        </Card>

        {/* 댓글 섹션 */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography level="h4" sx={{ mb: 2 }}>
              댓글 ({comments.length})
            </Typography>

            {comments.length > 0 ? (
              comments.map((comment) => (
                <Box
                  key={comment.id}
                  sx={{
                    mb: 2,
                    pb: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CustomAvatar
                        src={comment.authorPhotoURL}
                        alt={comment.authorName}
                        sx={{ width: 24, height: 24 }}
                      />
                      <Typography level="body1" fontWeight="bold">
                        {comment.authorName}
                      </Typography>
                      <Typography
                        level="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </Box>

                    {user && comment.authorId === user.uid && (
                      <IconButton
                        size="sm"
                        variant="plain"
                        color="neutral"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        🗑️
                      </IconButton>
                    )}
                  </Box>

                  <Typography
                    sx={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {comment.content}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ mb: 2, color: "text.secondary" }}>
                아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
              </Typography>
            )}

            {user ? (
              <Box
                component="form"
                onSubmit={(e: React.FormEvent) => {
                  e.preventDefault();
                  handleAddComment();
                }}
              >
                <FormControl sx={{ mb: 1 }}>
                  <FormLabel>댓글 작성</FormLabel>
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    minRows={2}
                    placeholder="댓글을 입력하세요"
                    sx={{ mb: 1 }}
                  />
                </FormControl>
                <Button
                  type="submit"
                  disabled={!commentText.trim() || isSubmittingComment}
                  loading={isSubmittingComment}
                  sx={{ float: "right" }}
                >
                  댓글 등록
                </Button>
              </Box>
            ) : (
              <Typography sx={{ color: "text.secondary" }}>
                댓글을 작성하려면 로그인이 필요합니다.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
