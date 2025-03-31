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
  Chip,
  Container,
  Divider,
  FormControl,
  IconButton,
  Input,
  Stack,
  Table,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../core/auth";
import { usePageEffect } from "../core/page";

// Sample board data
interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  category: string;
  views: number;
  content?: string;
}

const samplePosts: Post[] = [
  {
    id: 1,
    title: "컴퓨터 비전 프로젝트 성공 사례: 제조업 결함 탐지 !!!",
    author: "김민수",
    date: "2025-03-28",
    category: "성공사례",
    views: 152,
  },
  {
    id: 2,
    title: "자연어 처리 기술을 활용한 고객 서비스 자동화",
    author: "이지현",
    date: "2025-03-25",
    category: "기술소개",
    views: 98,
  },
  {
    id: 3,
    title: "TopdownAI의 최신 멀티모달 기술 소개",
    author: "박준호",
    date: "2025-03-20",
    category: "기술소개",
    views: 210,
  },
  {
    id: 4,
    title: "인공지능 프로젝트 의뢰 시 고려해야 할 사항",
    author: "최유진",
    date: "2025-03-15",
    category: "가이드",
    views: 175,
  },
  {
    id: 5,
    title: "AI 모델 성능 향상을 위한 데이터 전처리 방법",
    author: "정승훈",
    date: "2025-03-10",
    category: "기술팁",
    views: 132,
  },
  {
    id: 6,
    title: "2025년 인공지능 트렌드 분석",
    author: "김민수",
    date: "2025-03-05",
    category: "트렌드",
    views: 245,
  },
  {
    id: 7,
    title: "TopdownAI 4월 세미나 안내",
    author: "이지현",
    date: "2025-03-01",
    category: "공지사항",
    views: 87,
  },
  {
    id: 8,
    title: "의료 분야 AI 적용 사례 연구",
    author: "박준호",
    date: "2025-02-28",
    category: "성공사례",
    views: 120,
  },
  {
    id: 9,
    title: "금융권 AI 프로젝트 성공 사례",
    author: "최유진",
    date: "2025-02-25",
    category: "성공사례",
    views: 110,
  },
  {
    id: 10,
    title: "인공지능 모델 배포 및 운영 가이드",
    author: "정승훈",
    date: "2025-02-20",
    category: "가이드",
    views: 95,
  },
];

// Sample post detail
const samplePostDetail: Post = {
  id: 1,
  title: "컴퓨터 비전 프로젝트 성공 사례: 제조업 결함 탐지",
  author: "김민수",
  date: "2025-03-28",
  category: "성공사례",
  views: 152,
  content: `
    ## 프로젝트 배경

    제조업체 A사는 생산라인에서 제품 결함을 육안으로 검사하는 방식을 사용하고 있었습니다. 이 방식은 시간이 많이 소요되고, 인적 오류가 발생할 가능성이 높았습니다. TopdownAI는 컴퓨터 비전 기술을 활용하여 자동화된 결함 탐지 시스템을 개발하였습니다.

    ## 도전 과제

    - 다양한 유형의 결함을 높은 정확도로 탐지해야 함
    - 실시간 처리가 가능해야 함
    - 기존 생산 라인에 쉽게 통합될 수 있어야 함
    - 오탐지(false positive)와 미탐지(false negative)를 최소화해야 함

    ## 솔루션

    TopdownAI는 딥러닝 기반의 객체 탐지 모델을 개발하여 이 문제를 해결했습니다. 주요 구성 요소는 다음과 같습니다:

    1. **데이터 수집 및 전처리**: 다양한 조명 조건과 각도에서 정상 제품과 결함 제품의 이미지를 수집하고 전처리했습니다.
    2. **모델 개발**: YOLOv5 아키텍처를 기반으로 한 커스텀 모델을 개발하고, 수집된 데이터로 학습시켰습니다.
    3. **실시간 처리 시스템**: 생산 라인에 설치된 카메라에서 캡처한 이미지를 실시간으로 처리할 수 있는 시스템을 구축했습니다.
    4. **결과 시각화 및 알림**: 탐지된 결함을 시각적으로 표시하고, 필요한 경우 담당자에게 알림을 보내는 기능을 구현했습니다.

    ## 결과

    - 결함 탐지 정확도 99.2% 달성
    - 검사 시간 85% 단축
    - 인적 오류로 인한 불량품 출하 90% 감소
    - 연간 약 3억 원의 비용 절감 효과

    ## 결론

    이 프로젝트는 컴퓨터 비전 기술이 제조업의 품질 관리 프로세스를 어떻게 혁신할 수 있는지 보여주는 좋은 사례입니다. TopdownAI는 고객의 요구사항을 정확히 이해하고, 최적의 솔루션을 제공하여 성공적인 결과를 이끌어냈습니다.
  `,
};

export const Component = function Board(): JSX.Element {
  usePageEffect({ title: "TopdownAI - 게시판" });

  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPost, setCurrentPost] = useState<Post>(samplePostDetail);

  const user = useCurrentUser();

  const postsPerPage = 10;
  const totalPages = Math.ceil(samplePosts.length / postsPerPage);

  const filteredPosts = samplePosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? post.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  const categories = Array.from(
    new Set(samplePosts.map((post) => post.category)),
  );

  const handleViewPost = (postId: number) => {
    const post = samplePosts.find((p) => p.id === postId) || samplePostDetail;
    setCurrentPost({ ...post, content: samplePostDetail.content });
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography level="h1" sx={{ mb: 4, textAlign: "center" }}>
          TopdownAI 게시판
        </Typography>

        {viewMode === "list" ? (
          <>
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
                  variant={selectedCategory === null ? "solid" : "outlined"}
                  color="primary"
                  onClick={() => setSelectedCategory(null)}
                >
                  전체
                </Chip>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    variant={
                      selectedCategory === category ? "solid" : "outlined"
                    }
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
                  {paginatedPosts.length > 0 ? (
                    paginatedPosts.map((post) => (
                      <tr
                        key={post.id}
                        onClick={() => handleViewPost(post.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td style={{ textAlign: "center" }}>{post.id}</td>
                        <td>{post.title}</td>
                        <td style={{ textAlign: "center" }}>{post.author}</td>
                        <td style={{ textAlign: "center" }}>{post.date}</td>
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
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
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
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  <ArrowBackIosNew />
                </IconButton>
                <Typography sx={{ mx: 2 }}>
                  {currentPage} / {Math.max(1, totalPages)}
                </Typography>
                <IconButton
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  <ArrowForwardIos />
                </IconButton>
              </Box>

              {user && (
                <Button
                  component={Link}
                  to="/board/write"
                  startDecorator={<Add />}
                >
                  글쓰기
                </Button>
              )}
            </Box>
          </>
        ) : (
          <Card variant="outlined">
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
                  variant="outlined"
                  startDecorator={<ArrowBackIosNew />}
                  onClick={handleBackToList}
                >
                  목록으로
                </Button>

                {user && currentPost.author === "김민수" && (
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined">수정</Button>
                    <Button variant="outlined" color="danger">
                      삭제
                    </Button>
                  </Stack>
                )}
              </Box>

              <Typography level="h2" sx={{ mb: 1 }}>
                {currentPost.title}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <Typography level="body-sm">
                  작성자: {currentPost.author}
                </Typography>
                <Typography level="body-sm">
                  작성일: {currentPost.date}
                </Typography>
                <Typography level="body-sm">
                  조회수: {currentPost.views}
                </Typography>
                <Chip size="sm" variant="soft">
                  {currentPost.category}
                </Chip>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ whiteSpace: "pre-wrap" }}>{currentPost.content}</Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};
