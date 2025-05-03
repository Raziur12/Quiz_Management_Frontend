"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
} from "@mui/material";
import TopicIcon from "@mui/icons-material/Category";
import LessonIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";

// API Base URL
const API_BASE_URL = "https://localhost:7285/api";

const QuizPreview = () => {
  const [quizData, setQuizData] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: number]: any[] }>({});
  const [topicName, setTopicName] = useState<string>("Not Available");
  const [lessonName, setLessonName] = useState<string>("Not Available");

  // ✅ Load Quiz Data from LocalStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("quizData") || "{}");
    setQuizData(data);

    if (data?.selectedQuestions?.length > 0) {
      fetchAnswers(data.selectedQuestions);
    }

    if (data?.subjectId && data?.topicId) {
      fetchTopicAndLesson(data.subjectId, data.topicId);
    }
  }, []);

  // ✅ Fetch Answers for Selected Questions
  const fetchAnswers = async (questions: any[]) => {
    const answersData: { [key: number]: any[] } = {};

    for (const question of questions) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/Answer/GetAnswersByQuestion/${question.questionId}`
        );
        answersData[question.questionId] = response.data?.$values || [];
      } catch (error) {
        console.error(
          `Error fetching answers for question ${question.questionId}:`,
          error
        );
        answersData[question.questionId] = [];
      }
    }
    setAnswers(answersData);
  };

  // ✅ Fetch Topic and Lesson by subjectId and topicId
  const fetchTopicAndLesson = async (subjectId: number, topicId: number) => {
    try {
      // ✅ Fetch Topic Name
      const topicResponse = await axios.get(
        `${API_BASE_URL}/Topic/BySubject/${subjectId}`
      );
      const topic = topicResponse.data?.$values.find(
        (t: any) => t.topicId === topicId
      );
      if (topic) {
        setTopicName(topic.topicName);
      }

      // ✅ Fetch Lesson Name
      const lessonResponse = await axios.get(
        `${API_BASE_URL}/Lesson/GetLessonsByTopic/${topicId}`
      );
      const lesson = lessonResponse.data?.$values[0];
      if (lesson) {
        setLessonName(lesson.lessonName);
      }
    } catch (error) {
      console.error("Error fetching topic or lesson:", error);
    }
  };

  if (!quizData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Quiz Preview - {quizData.quizTitle}
      </Typography>

      {/* ✅ Topic and Lesson Info in a Single Row */}
      <Grid
        container
        spacing={2}
        sx={{
          marginTop: 2,
          marginBottom: 3,
          backgroundColor: "#e3f2fd",
          padding: 2,
          borderRadius: 2,
        }}
      >
        <Grid item xs={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#c8e6c9",
              border: "1px solid #388e3c",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TopicIcon sx={{ color: "#2e7d32", marginRight: 1 }} />
            <Typography variant="h6">
              <strong>Selected Topic:</strong> {topicName}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#fff9c4",
              border: "1px solid #fbc02d",
              display: "flex",
              alignItems: "center",
            }}
          >
            <LessonIcon sx={{ color: "#f57c00", marginRight: 1 }} />
            <Typography variant="h6">
              <strong>Selected Lesson:</strong> {lessonName}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ✅ Table to Display Selected Questions */}
      <TableContainer component={Paper} sx={{ marginTop: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>
                <strong>Question ID</strong>
              </TableCell>
              <TableCell>
                <strong>Question Text</strong>
              </TableCell>
              <TableCell>
                <strong>Correct Answer</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizData.selectedQuestions.map((question: any) => (
              <TableRow key={question.questionId}>
                <TableCell>{question.questionId}</TableCell>
                <TableCell>{question.questionText}</TableCell>
                <TableCell>
                  {answers[question.questionId]?.length > 0 ? (
                    answers[question.questionId].map(
                      (ans: any, index: number) => (
                        <Box
                          key={ans.answerId}
                          sx={{
                            backgroundColor: ans.isCorrect
                              ? "#d4edda"
                              : "#ffebee",
                            color: ans.isCorrect ? "#155724" : "#c62828",
                            padding: "5px",
                            borderRadius: "5px",
                            margin: "2px 0",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {ans.isCorrect ? (
                            <CheckCircleIcon
                              sx={{ fontSize: 18, marginRight: 0.5 }}
                            />
                          ) : (
                            <CancelIcon
                              sx={{ fontSize: 18, marginRight: 0.5 }}
                            />
                          )}
                          {String.fromCharCode(97 + index)}) {ans.answerText}
                        </Box>
                      )
                    )
                  ) : (
                    <Typography>No Answers Available</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default QuizPreview;
