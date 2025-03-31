/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemContent,
  Typography,
} from "@mui/joy";
import { usePageEffect } from "../core/page";

export const Component = function Services(): JSX.Element {
  usePageEffect({ title: "TopdownAI - 서비스" });

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography level="h1" sx={{ mb: 4, textAlign: "center" }}>
          TopdownAI 서비스
        </Typography>
        <Typography
          sx={{ mb: 6, textAlign: "center", maxWidth: 800, mx: "auto" }}
        >
          세계 여러 인공지능 대회에서 1등을 기록한 경험을 바탕으로, 기록으로
          검증된 최고 성능의 AI 모델을 서비스합니다.
        </Typography>

        {/* Computer Vision Section */}
        <Box id="vision" sx={{ mb: 8, scrollMarginTop: "80px" }}>
          <Typography level="h2" sx={{ mb: 3 }}>
            컴퓨터 비전 (이미지)
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={4}>
            <Grid xs={12} md={6}>
              <Typography sx={{ mb: 2 }}>
                컴퓨터 비전 분야에서 최신 기술을 활용한 다양한 서비스를
                제공합니다. 이미지 분류부터 복잡한 객체 탐지, 세그멘테이션,
                그리고 생성형 AI를 활용한 이미지 생성까지 다양한 작업을 수행할
                수 있습니다.
              </Typography>

              <List sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemContent>이미지 분류(Classification)</ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>객체 탐지(Object Detection)</ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>이미지 분할(Segmentation)</ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>영상 처리 및 분석</ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>AI 이미지 생성</ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>깊이 예측(Depth Estimation)</ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>스타일 변환(Style Transfer)</ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>AI 옷 피팅(Virtual Try-on)</ListItemContent>
                </ListItem>
              </List>
            </Grid>

            <Grid xs={12} md={6}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography level="h3" sx={{ mb: 2 }}>
                    활용 사례
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemContent>
                        제품 결함 자동 검출 시스템
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        의료 영상 분석 및 진단 보조
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        패션 이커머스를 위한 가상 피팅 솔루션
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        보안 카메라 영상 분석 및 이상 탐지
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        자율주행 차량을 위한 객체 인식
                      </ListItemContent>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* NLP Section */}
        <Box id="nlp" sx={{ mb: 8, scrollMarginTop: "80px" }}>
          <Typography level="h2" sx={{ mb: 3 }}>
            자연어 처리 (텍스트)
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={4}>
            <Grid xs={12} md={6}>
              <Typography sx={{ mb: 2 }}>
                자연어 처리 기술을 활용하여 텍스트 데이터를 분석하고 이해하는
                서비스를 제공합니다. 최신 LLM(Large Language Model)과
                RAG(Retrieval-Augmented Generation) 기술을 활용하여 고객의
                요구에 맞는 최적의 솔루션을 제공합니다.
              </Typography>

              <List sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemContent>텍스트 분류 및 감정 분석</ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>언어 번역 시스템</ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>LLM 기반 챗봇 개발</ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>
                    RAG(Retrieval-Augmented Generation)
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>텍스트 요약 및 정보 추출</ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>웹 크롤링 및 데이터 수집</ListItemContent>
                </ListItem>
              </List>
            </Grid>

            <Grid xs={12} md={6}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography level="h3" sx={{ mb: 2 }}>
                    활용 사례
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemContent>고객 서비스 자동화 챗봇</ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        기업 내부 문서 검색 및 질의응답 시스템
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        소셜 미디어 모니터링 및 감정 분석
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>다국어 콘텐츠 자동 번역</ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>뉴스 및 문서 자동 요약</ListItemContent>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Multimodal Section */}
        <Box id="multimodal" sx={{ mb: 8, scrollMarginTop: "80px" }}>
          <Typography level="h2" sx={{ mb: 3 }}>
            멀티모달
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={4}>
            <Grid xs={12} md={6}>
              <Typography sx={{ mb: 2 }}>
                텍스트와 이미지를 함께 처리하는 멀티모달 AI 기술을 활용한
                서비스를 제공합니다. 이미지 캡셔닝, OCR, 비전-언어 모델(VLM) 등
                다양한 멀티모달 기술을 활용하여 복합적인 데이터를 처리하고
                분석합니다.
              </Typography>

              <List sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemContent>멀티모달 캡셔닝</ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>
                    OCR(Optical Character Recognition)
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>VLM(Vision-Language Model)</ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>이미지 기반 질의응답</ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>비주얼 검색 시스템</ListItemContent>
                </ListItem>
              </List>
            </Grid>

            <Grid xs={12} md={6}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography level="h3" sx={{ mb: 2 }}>
                    활용 사례
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemContent>
                        시각 장애인을 위한 이미지 설명 시스템
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        문서 자동화 및 정보 추출
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        제품 이미지 기반 검색 및 추천
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        의료 영상과 진료 기록 통합 분석
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        비디오 콘텐츠 자동 태깅 및 분류
                      </ListItemContent>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Process Section */}
        <Box sx={{ mb: 8 }}>
          <Typography level="h2" sx={{ mb: 3, textAlign: "center" }}>
            서비스 제공 절차
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography level="h3" sx={{ mb: 2 }}>
                    1. 상담 및 요구사항 분석
                  </Typography>
                  <Typography>
                    상담을 통해 샘플데이터(데이터가 없어도 가능한 경우가 있음)
                    및 원하시는 내용을 확인합니다. 부담없이, 아무때나 상담 문의
                    주세요! 언제든 성심성의껏 답변해드립니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography level="h3" sx={{ mb: 2 }}>
                    2. 솔루션 제안 및 합의
                  </Typography>
                  <Typography>
                    가능한 솔루션, 최종 결과물 관련 요구사항을 합의하고 비용을
                    협의합니다. 고객의 요구사항에 맞는 최적의 AI 솔루션을 제안해
                    드립니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography level="h3" sx={{ mb: 2 }}>
                    3. 개발 및 유지보수
                  </Typography>
                  <Typography>
                    모델 개발 및 프로젝트를 수행하고, 수정사항 및 지속적인
                    유지보수 관리를 제공합니다. 프로젝트 완료 후에도 지속적인
                    지원을 약속드립니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};
