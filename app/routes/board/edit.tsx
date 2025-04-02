/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { ArrowBackIosNew } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCurrentUser } from "../../core/auth";
import { boardService, Post } from "../../core/board";
import { usePageEffect } from "../../core/page";

export const Component = function EditPost(): JSX.Element {
  usePageEffect({ title: "TopdownAI - 게시글 수정" });

  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useCurrentUser();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Load post and categories
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError("게시글 ID가 유효하지 않습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Load post
        const postData = await boardService.getPostById(id);
        if (!postData) {
          setError("게시글을 찾을 수 없습니다.");
          setIsLoading(false);
          return;
        }

        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setCategory(postData.category || "");

        // Check if user is the author
        if (user && postData.authorId !== user.uid) {
          setError("이 게시글을 수정할 권한이 없습니다.");
        }

        // Load categories
        const categoriesList = await boardService.getCategories();
        setCategories(categoriesList);

        // Check if the current category exists in the list
        if (!categoriesList.includes(postData.category)) {
          setShowCustomCategory(true);
          setCustomCategory(postData.category);
        }
      } catch (error) {
        console.error("Error loading post:", error);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      enqueueSnackbar("제목을 입력해주세요.", {
        variant: "warning",
      });
      return;
    }

    if (!content.trim()) {
      enqueueSnackbar("내용을 입력해주세요.", {
        variant: "warning",
      });
      return;
    }

    if (!category && !customCategory) {
      enqueueSnackbar("카테고리를 선택해주세요.", {
        variant: "warning",
      });
      return;
    }

    if (!user || !id) {
      enqueueSnackbar("로그인이 필요하거나 게시글 ID가 유효하지 않습니다.", {
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const finalCategory = showCustomCategory ? customCategory : category;

      await boardService.updatePost(
        id,
        {
          title,
          content,
          category: finalCategory,
        },
        user.uid,
      );

      enqueueSnackbar("게시글이 성공적으로 수정되었습니다.", {
        variant: "success",
      });
      navigate(`/board/post/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      enqueueSnackbar("게시글 수정 중 오류가 발생했습니다.", {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (
    event: React.SyntheticEvent | null,
    value: string | null,
  ) => {
    if (value === "custom") {
      setShowCustomCategory(true);
      setCategory("");
    } else {
      setShowCustomCategory(false);
      setCategory(value || "");
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

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Card variant="outlined">
            <CardContent>
              <Typography level="h3" color="danger" sx={{ mb: 2 }}>
                오류
              </Typography>
              <Typography>{error}</Typography>
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
        <Typography level="h1" sx={{ mb: 4, textAlign: "center" }}>
          게시글 수정
        </Typography>

        <Card variant="outlined">
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <FormControl required>
                  <FormLabel>제목</FormLabel>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                  />
                </FormControl>

                <FormControl required>
                  <FormLabel>카테고리</FormLabel>
                  <Select
                    value={category}
                    onChange={handleCategoryChange}
                    placeholder="카테고리 선택"
                  >
                    {categories.map((cat) => (
                      <Option key={cat} value={cat}>
                        {cat}
                      </Option>
                    ))}
                    <Option value="custom">직접 입력</Option>
                  </Select>
                </FormControl>

                {showCustomCategory && (
                  <FormControl required>
                    <FormLabel>새 카테고리</FormLabel>
                    <Input
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="새 카테고리 이름을 입력하세요"
                    />
                  </FormControl>
                )}

                <FormControl required>
                  <FormLabel>내용</FormLabel>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    minRows={10}
                    placeholder="내용을 입력하세요"
                    sx={{ fontFamily: "monospace" }}
                  />
                </FormControl>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    component={Link}
                    to={`/board/post/${id}`}
                    variant="outlined"
                    startDecorator={<ArrowBackIosNew />}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    startDecorator="💾"
                  >
                    저장
                  </Button>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
