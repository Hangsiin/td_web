/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Option,
  Select,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { usePageEffect } from "../core/page";

interface FormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
}

export const Component = function Contact(): JSX.Element {
  usePageEffect({ title: "TopdownAI - 문의하기" });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    _: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    setFormData((prev) => ({ ...prev, serviceType: newValue || "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
    setSubmitted(true);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography level="h1" sx={{ mb: 4, textAlign: "center" }}>
          문의하기
        </Typography>

        <Grid container spacing={4}>
          <Grid xs={12} md={6}>
            <Card variant="outlined" sx={{ mb: 4 }}>
              <CardContent>
                <Typography level="h3" sx={{ mb: 3 }}>
                  TopdownAI에 문의하세요
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  인공지능 프로젝트에 관한 모든 문의를 환영합니다. 부담 없이
                  연락주세요!
                </Typography>
                <Typography sx={{ mb: 3 }}>
                  저희는 한양대 공대 출신 팀으로 이루어져 있으며, 전업으로
                  인공지능 프로젝트를 진행하고 있습니다. 다른 회사나 기업에
                  소속되어있지 않기 때문에, 의뢰인의 프로젝트에 저희의 모든 힘을
                  쏟을 수 있습니다!
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography level="h4" sx={{ mb: 2 }}>
                  의뢰인 준비사항
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  그냥 사실 몸만 오셔도 됩니다. 잘 모르셔도, 어떤 준비를
                  하셔야하는지 알려드릴게요.
                </Typography>
                <Typography component="ol" sx={{ pl: 2 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    희망 작업 기간(최소 언제까지 마무리가 되어야하는지 등)
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    데이터에 대한 설명
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    원하는 작업 방향
                  </Box>
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  제가 교육을 하는 사람이다보니, 의뢰인분이 무엇을 원하는지에
                  대해서 모르는 경우에도 잘 캐치할 수 있으니 부담없이
                  신청해주세요.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={6}>
            {submitted ? (
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography level="h3" sx={{ mb: 2 }}>
                    문의가 접수되었습니다!
                  </Typography>
                  <Typography sx={{ mb: 3 }}>
                    빠른 시일 내에 답변 드리겠습니다. 감사합니다.
                  </Typography>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outlined"
                  >
                    새 문의하기
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography level="h3" sx={{ mb: 3 }}>
                    문의 양식
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                      <FormControl required>
                        <FormLabel>이름</FormLabel>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="홍길동"
                        />
                      </FormControl>

                      <FormControl required>
                        <FormLabel>이메일</FormLabel>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="example@email.com"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>전화번호</FormLabel>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="010-1234-5678"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>관심 서비스</FormLabel>
                        <Select
                          placeholder="서비스 선택"
                          value={formData.serviceType}
                          onChange={handleSelectChange}
                        >
                          <Option value="vision">컴퓨터 비전 (이미지)</Option>
                          <Option value="nlp">자연어 처리 (텍스트)</Option>
                          <Option value="multimodal">멀티모달</Option>
                          <Option value="other">기타</Option>
                        </Select>
                      </FormControl>

                      <FormControl required>
                        <FormLabel>문의 내용</FormLabel>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          minRows={4}
                          placeholder="프로젝트에 대한 간략한 설명이나 궁금한 점을 적어주세요."
                        />
                      </FormControl>

                      <Button type="submit" sx={{ mt: 2 }}>
                        문의하기
                      </Button>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
