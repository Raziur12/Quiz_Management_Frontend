"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
} from "@mui/material";
import axios from "axios";

// ✅ API URLs
const API_BASE_URL = "https://localhost:7285/api";

// ✅ Subject Interface
interface Subject {
  subId: number;
  subName: string;
}

// ✅ Topic Interface
interface Topic {
  topicId: number;
  topicName: string;
}

// ✅ Lesson Interface
interface Lesson {
  lessonId: number;
  lessonName: string;
}

// ✅ Question Interface
interface Question {
  questionId: number;
  questionText: string;
  lessonId: number;
  marks: number;
}

// ✅ Main Component
const QuizManagement = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  // ✅ Fetch Subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Subject`);
        setSubjects(response.data?.$values || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  // ✅ Fetch Topics based on Subject
  const handleSubjectChange = async (subId: number) => {
    setSelectedSubject(subId);
    setQuizTitle(subjects.find((sub) => sub.subId === subId)?.subName || "");

    try {
      const response = await axios.get(`${API_BASE_URL}/Topic/BySubject/${subId}`);
      setTopics(response.data?.$values || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  // ✅ Fetch Lessons based on Topic
  const handleTopicChange = async (topicId: number) => {
    setSelectedTopic(topicId);
    try {
      const response = await axios.get(`${API_BASE_URL}/Lesson/GetLessonsByTopic/${topicId}`);
      setLessons(response.data?.$values || []);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  // ✅ Fetch Questions based on Lesson
  const handleLessonChange = async (lessonId: number) => {
    setSelectedLesson(lessonId);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Question/subject/${selectedSubject}/topic/${selectedTopic}/lesson/${lessonId}`
      );
      setQuestions(response.data?.$values || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // ✅ Handle Question Selection
  const handleQuestionToggle = (questionId: number) => {
    const currentIndex = selectedQuestions.indexOf(questionId);
    const newSelected = [...selectedQuestions];

    if (currentIndex === -1) {
      newSelected.push(questionId);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setSelectedQuestions(newSelected);
  };

  // ✅ Save Selected Questions and Navigate to Table Page
  const handleSave = () => {
    const selectedData = {
      quizTitle,
      subjectId: selectedSubject,
      topicId: selectedTopic,
      lessonId: selectedLesson,
      selectedQuestions: questions.filter((q) => selectedQuestions.includes(q.questionId)),
    };

    localStorage.setItem("quizData", JSON.stringify(selectedData));
    window.location.href = "/quizmanagement/preview"; // Navigate to Preview Page
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Quiz Management - {quizTitle}
      </Typography>

      {/* ✅ Select Subject */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Subject</InputLabel>
        <Select
          value={selectedSubject || ""}
          onChange={(e) => handleSubjectChange(Number(e.target.value))}
        >
          {subjects.map((subject) => (
            <MenuItem key={subject.subId} value={subject.subId}>
              {subject.subName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ✅ Select Topic */}
      <FormControl fullWidth margin="normal" disabled={!selectedSubject}>
        <InputLabel>Topic</InputLabel>
        <Select
          value={selectedTopic || ""}
          onChange={(e) => handleTopicChange(Number(e.target.value))}
        >
          {topics.map((topic) => (
            <MenuItem key={topic.topicId} value={topic.topicId}>
              {topic.topicName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ✅ Select Lesson */}
      <FormControl fullWidth margin="normal" disabled={!selectedTopic}>
        <InputLabel>Lesson</InputLabel>
        <Select
          value={selectedLesson || ""}
          onChange={(e) => handleLessonChange(Number(e.target.value))}
        >
          {lessons.map((lesson) => (
            <MenuItem key={lesson.lessonId} value={lesson.lessonId}>
              {lesson.lessonName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ✅ Select Questions */}
      <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6">Select Questions:</Typography>
        <List>
          {questions.map((question) => (
            <ListItem
            key={question.questionId}
            component="button" // ✅ Treat as button
            onClick={() => handleQuestionToggle(question.questionId)}
            sx={{ cursor: "pointer", textAlign: "left", width: "100%", padding: 1 }}
          >
            <Checkbox checked={selectedQuestions.includes(question.questionId)} />
            <ListItemText primary={question.questionText} />
          </ListItem>          
          ))}
        </List>
      </Paper>

      {/* ✅ Save Button */}
      <Box textAlign="center" marginTop={2}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save & Preview
        </Button>
      </Box>
    </Container>
  );
};

export default QuizManagement;
