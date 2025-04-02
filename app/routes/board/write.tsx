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
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../core/auth";
import { boardService } from "../../core/board";
import { usePageEffect } from "../../core/page";

export const Component = function WritePost(): JSX.Element {
  usePageEffect({ title: "TopdownAI - 게시글 작성" });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const user = useCurrentUser();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await boardService.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
        enqueueSnackbar("카테고리를 불러오는 중 오류가 발생했습니다.", {
          variant: "error",
        });
      }
    };

    loadCategories();
  }, [enqueueSnackbar]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      enqueueSnackbar("로그인이 필요합니다.", { variant: "error" });
      navigate("/login");
      return;
    }

    // Validate form
    if (!title.trim()) {
      enqueueSnackbar("제목을 입력해주세요.", { variant: "warning" });
      return;
    }

    if (!content.trim()) {
      enqueueSnackbar("내용을 입력해주세요.", { variant: "warning" });
      return;
    }

    const finalCategory = showCustomCategory ? customCategory : category;
    if (!finalCategory.trim()) {
      enqueueSnackbar("카테고리를 선택하거나 입력해주세요.", {
        variant: "warning",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Pass the post data directly to createPost
      const postData = {
        title,
        content,
        category: finalCategory,
        authorId: user.uid,
        authorName: user.displayName || "익명 사용자",
        authorPhotoURL: user.photoURL || "",
      };

      const newPostId = await boardService.createPost(postData, user);

      enqueueSnackbar("게시글이 성공적으로 등록되었습니다.", {
        variant: "success",
      });
      navigate(`/board/post/${newPostId}`);
    } catch (error) {
      console.error("Error creating post:", error);
      enqueueSnackbar("게시글 등록 중 오류가 발생했습니다.", {
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

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography level="h1" sx={{ mb: 4, textAlign: "center" }}>
          게시글 작성
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
                    to="/board"
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
                    등록
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
