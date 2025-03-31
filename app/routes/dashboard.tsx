/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Box, Button, Container, Grid, Stack, Typography } from "@mui/joy";
import { Link } from "react-router-dom";
import { usePageEffect } from "../core/page";

export const Component = function Dashboard(): JSX.Element {
  usePageEffect({ title: "TopdownAI - 최고 성능의 AI 모델 서비스" });

  return (
    <Box sx={{ py: 4 }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography level="h1" sx={{ mb: 2 }}>
            TopdownAI
          </Typography>
          <Typography level="h3" sx={{ mb: 4, fontWeight: "normal" }}>
            최고 성능의 AI 모델을 서비스하는 전문가 팀
          </Typography>
          <Typography sx={{ mb: 4, maxWidth: 800 }}>
            세계 여러 인공지능 대회에서 1등을 기록한 경험을 바탕으로, 기록으로
            검증된 최고 성능의 AI 모델을 서비스합니다. 한양대 공대 출신 팀으로
            이루어져 있으며, 전업으로 인공지능 프로젝트를 진행하고 있습니다.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              to="/services"
              size="lg"
              color="primary"
              variant="solid"
            >
              서비스 알아보기
            </Button>
            <Button component={Link} to="/contact" size="lg" variant="outlined">
              문의하기
            </Button>
            <Button
              component={Link}
              to="/simple-payment"
              size="lg"
              color="success"
              variant="solid"
            >
              결제하기
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* Services Overview */}
      <Box sx={{ bgcolor: "background.level1", py: 8 }}>
        <Container maxWidth="lg">
          <Typography level="h2" sx={{ mb: 4, textAlign: "center" }}>
            주요 서비스
          </Typography>

          <Grid container spacing={4}>
            <Grid xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  height: "100%",
                  bgcolor: "background.surface",
                  borderRadius: "md",
                  boxShadow: "sm",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "md",
                  },
                }}
              >
                <Typography level="h4" sx={{ mb: 2 }}>
                  컴퓨터 비전 (이미지)
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  이미지 분류(classification), 분할(segmentation),
                  탐지(detection), 영상, 생성, 깊이예측, 스타일바꾸기, AI 옷
                  피팅(Vton) 등
                </Typography>
                <Button component={Link} to="/services#vision" variant="plain">
                  자세히 보기
                </Button>
              </Box>
            </Grid>

            <Grid xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  height: "100%",
                  bgcolor: "background.surface",
                  borderRadius: "md",
                  boxShadow: "sm",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "md",
                  },
                }}
              >
                <Typography level="h4" sx={{ mb: 2 }}>
                  자연어 처리 (텍스트)
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  텍스트 분류, 번역, LLM, RAG, 챗봇, 크롤링, 문서요약 등
                </Typography>
                <Button component={Link} to="/services#nlp" variant="plain">
                  자세히 보기
                </Button>
              </Box>
            </Grid>

            <Grid xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  height: "100%",
                  bgcolor: "background.surface",
                  borderRadius: "md",
                  boxShadow: "sm",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "md",
                  },
                }}
              >
                <Typography level="h4" sx={{ mb: 2 }}>
                  멀티모달
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  멀티모달 캡셔닝, OCR, VLM 등
                </Typography>
                <Button
                  component={Link}
                  to="/services#multimodal"
                  variant="plain"
                >
                  자세히 보기
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Achievements Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography level="h2" sx={{ mb: 4, textAlign: "center" }}>
          우리의 성과
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography level="h4" sx={{ mb: 2 }}>
            교육 및 강의
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li">
              <Typography>
                이화여대 컴퓨터공학과 머신러닝 단체강의(1학기, 150명)
              </Typography>
            </Box>
            <Box component="li">
              <Typography>GS건설 임직원대상 머신러닝 출강</Typography>
            </Box>
            <Box component="li">
              <Typography>
                타 플랫폼 직무역량 분야 데이터/개발(ML, AI) 분야 최다 수강생,
                최다리뷰 배출
              </Typography>
            </Box>
            <Box component="li">
              <Typography>약 6년간 수강생 약 2천여명 배출</Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography level="h4" sx={{ mb: 2 }}>
            경쟁에 익숙합니다
          </Typography>
          <Typography sx={{ mb: 2 }}>
            저희는 6년 여간 국내/해외를 가리지 않고 300개 이상의 수 많은
            데이터분석 대회에 참가하여 최상위권 성적을 달성해왔습니다. 덕분에
            저희는 모델의 점수/성능을 올리는 지름길을 누구보다 잘 알고있다고
            자부합니다.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
