/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  Add,
  ArrowBackIosNew,
  ArrowForwardIos,
  Search,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  IconButton,
  Input,
  Stack,
  Table,
  Typography,
  Chip,
} from "@mui/joy";
import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../core/auth";
import { usePageEffect } from "../core/page";
import { boardService, Post } from "../core/board";
import { DocumentSnapshot } from "firebase/firestore";
import { formatDate } from "../utils/dateUtils";
import { useSnackbar } from "notistack";

export const Component = function Board(): JSX.Element {
  usePageEffect({ title: "TopdownAI - 게시판" });

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [previousLastVisibles, setPreviousLastVisibles] = useState<
    DocumentSnapshot[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const user = useCurrentUser();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const postsPerPage = 10;

  // 게시판 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        // 사용자가 로그인하지 않은 경우 로딩 상태를 해제하고 함수 종료
        if (user === null) {
          setIsLoading(false);
          return;
        }

        // 카테고리 목록 로드
        const categoriesList = await boardService.getCategories();
        setCategories(categoriesList);

        // 게시글 목록 로드
        const {
          posts: fetchedPosts,
          lastVisible: last,
          hasMore: more,
        } = await boardService.getPosts(
          selectedCategory || null,
          searchTerm || null,
          10, // limitCount
          null, // startAfterDoc
        );

        setPosts(fetchedPosts);
        setLastVisible(last);
        setHasMore(more);
      } catch (error) {
        console.error("Error loading board data:", error);
        enqueueSnackbar("게시판 데이터를 불러오는 중 오류가 발생했습니다.", {
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    loadData();
  }, [selectedCategory, searchTerm, enqueueSnackbar, user]);

  const handleNextPage = async () => {
    if (!lastVisible || !hasMore) return;

    try {
      setIsLoading(true);

      // Save current lastVisible for back navigation
      setPreviousLastVisibles((prev) => [...prev, lastVisible]);

      // Load next page
      const {
        posts: fetchedPosts,
        lastVisible: last,
        hasMore: more,
      } = await boardService.getPosts(
        selectedCategory || null,
        searchTerm || null,
        10, // limitCount
        lastVisible, // startAfterDoc
      );

      setPosts(fetchedPosts);
      setLastVisible(last);
      setHasMore(more);
      setCurrentPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading next page:", error);
      setError("다음 페이지를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevPage = async () => {
    if (currentPage === 1 || previousLastVisibles.length === 0) return;

    try {
      setIsLoading(true);

      // Get the previous lastVisible
      const newPreviousLastVisibles = [...previousLastVisibles];
      const prevLastVisible = newPreviousLastVisibles.pop() || null;
      setPreviousLastVisibles(newPreviousLastVisibles);

      // If we're going back to the first page
      if (currentPage === 2) {
        const {
          posts: fetchedPosts,
          lastVisible: last,
          hasMore: more,
        } = await boardService.getPosts(
          selectedCategory || null,
          searchTerm || null,
          10, // limitCount
          null, // startAfterDoc
        );

        setPosts(fetchedPosts);
        setLastVisible(last);
        setHasMore(true);
      } else {
        // Load previous page
        const {
          posts: fetchedPosts,
          lastVisible: last,
          hasMore: more,
        } = await boardService.getPosts(
          selectedCategory || null,
          searchTerm || null,
          10, // limitCount
          prevLastVisible, // startAfterDoc
        );

        setPosts(fetchedPosts);
        setLastVisible(last);
        setHasMore(true);
      }

      setCurrentPage((prev) => prev - 1);
    } catch (error) {
      console.error("Error loading previous page:", error);
      setError("이전 페이지를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPost = (postId: string) => {
    navigate(`/board/post/${postId}`);
  };

  // 로그인하지 않은 경우 로그인 안내 메시지 표시
  if (user === null) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Card>
            <CardContent>
              <Typography level="h4" sx={{ mb: 2 }}>
                로그인이 필요합니다
              </Typography>
              <Typography sx={{ mb: 3 }}>
                게시판을 이용하려면 로그인이 필요합니다. 로그인 후 이용해
                주세요.
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="solid"
                color="primary"
              >
                로그인 하기
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // 로딩 중인 경우 로딩 표시
  if (isLoading && posts.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
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
          <Typography level="h1" sx={{ mb: 4, textAlign: "center" }}>
            TopdownAI 게시판
          </Typography>
          <Card variant="outlined">
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography level="h3" color="danger" sx={{ mb: 2 }}>
                오류
              </Typography>
              <Typography>{error}</Typography>
              <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                다시 시도
              </Button>
            </Box>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography level="h1" sx={{ mb: 4, textAlign: "center" }}>
          TopdownAI 게시판
        </Typography>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip
              variant={selectedCategory === "" ? "solid" : "outlined"}
              color="primary"
              onClick={() => setSelectedCategory("")}
            >
              전체
            </Chip>
            {categories.map((category) => (
              <Chip
                key={category}
                variant={selectedCategory === category ? "solid" : "outlined"}
                color="primary"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Chip>
            ))}
          </Stack>

          <FormControl sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Input
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startDecorator={<Search />}
              sx={{ minWidth: 250 }}
            />
          </FormControl>
        </Box>

        <Card variant="outlined" sx={{ mb: 3 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table sx={{ "& th": { textAlign: "center" } }}>
              <thead>
                <tr>
                  <th style={{ width: 70 }}>번호</th>
                  <th>제목</th>
                  <th style={{ width: 120 }}>작성자</th>
                  <th style={{ width: 120 }}>작성일</th>
                  <th style={{ width: 100 }}>카테고리</th>
                  <th style={{ width: 80 }}>조회수</th>
                </tr>
              </thead>
              <tbody>
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <tr
                      key={post.id}
                      onClick={() => handleViewPost(post.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ textAlign: "center" }}>
                        {(currentPage - 1) * postsPerPage + index + 1}
                      </td>
                      <td>
                        {post.title}
                        {post.commentCount > 0 && (
                          <Typography
                            component="span"
                            color="primary"
                            fontWeight="bold"
                            sx={{ ml: 1 }}
                          >
                            [{post.commentCount}]
                          </Typography>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>{post.authorName}</td>
                      <td style={{ textAlign: "center" }}>
                        {formatDate(post.createdAt)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Chip size="sm" variant="soft">
                          {post.category}
                        </Chip>
                      </td>
                      <td style={{ textAlign: "center" }}>{post.views}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ textAlign: "center", padding: "2rem" }}
                    >
                      {searchTerm || selectedCategory
                        ? "검색 결과가 없습니다."
                        : "게시글이 없습니다. 첫 게시글을 작성해보세요!"}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              disabled={currentPage === 1 || isLoading}
              onClick={handlePrevPage}
            >
              <ArrowBackIosNew />
            </IconButton>
            <Typography sx={{ mx: 2 }}>{currentPage} 페이지</Typography>
            <IconButton
              disabled={!hasMore || isLoading}
              onClick={handleNextPage}
            >
              <ArrowForwardIos />
            </IconButton>
          </Box>

          {user && (
            <Button component={Link} to="/board/write" startDecorator={<Add />}>
              글쓰기
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};
