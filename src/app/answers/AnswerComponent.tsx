"use client";
import React, { useEffect, useState } from "react";
import {
  fetchAnswers,
  addAnswer,
  deleteAnswer,
  Answer,
  fetchQuestions,
  Subject,
  Topic,
  Lesson,
  fetchLessons
} from "@/services/answerService";
import {
  fetchSubjects,
  fetchTopics,
  Question,
} from "@/services/api";
import {
  Button,
  TextField,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  MenuItem,
  Select,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Fab,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const AnswerComponent: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedTopicId, setSelectedTopicId] = useState<number | "">("");
  const [selectedLessonId, setSelectedLessonId] = useState<number | "">("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | "">("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState<Omit<Answer, "answerId">>({
    answerText: "",
    isCorrect: false,
    questionId: 0,
  });

  // ✅ Load Subjects on Component Mount
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await fetchSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    loadSubjects();
  }, []);

  // ✅ Load Topics when Subject Changes
  useEffect(() => {
    if (selectedSubjectId) {
      fetchTopics(selectedSubjectId)
        .then(setTopics)
        .catch(console.error);
      setSelectedTopicId("");
      setLessons([]);
      setQuestions([]);
      setSelectedLessonId("");
      setSelectedQuestionId("");
      setAnswers([]);
    }
  }, [selectedSubjectId]);

  // ✅ Load Lessons when Topic Changes
  useEffect(() => {
    if (selectedTopicId) {
      fetchLessons(selectedTopicId)
        .then(setLessons)
        .catch(console.error);
      setSelectedLessonId("");
      setQuestions([]);
      setSelectedQuestionId("");
      setAnswers([]);
    }
  }, [selectedTopicId]);

  // ✅ Load Questions when Lesson Changes
  useEffect(() => {
    if (selectedSubjectId && selectedTopicId && selectedLessonId) {
      fetchQuestions(selectedSubjectId, selectedTopicId, Number(selectedLessonId))
        .then((data) => {
          console.log("Questions Loaded:", data);
          setQuestions(data);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
          setQuestions([]);
        });
    }
  }, [selectedSubjectId, selectedTopicId, selectedLessonId]);

  // ✅ Load Answers when Question Changes
  useEffect(() => {
    if (selectedQuestionId) {
      loadAnswers(selectedQuestionId);
    } else {
      setAnswers([]);
    }
  }, [selectedQuestionId]);

  const loadAnswers = async (questionId: number) => {
    try {
      const data = await fetchAnswers(questionId);
      setAnswers(data);
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  };

  const handleAddAnswer = async () => {
    if (!selectedQuestionId || newAnswer.answerText.trim() === "") {
      alert("Please select a question and enter a valid answer!");
      return;
    }

    try {
      const addedAnswer = await addAnswer({
        ...newAnswer,
        questionId: selectedQuestionId,
      });

      if (!addedAnswer || !addedAnswer.answerId) {
        throw new Error("Invalid response from API. Missing answerId.");
      }

      setAnswers([...answers, { ...addedAnswer, answerId: addedAnswer.answerId }]);
      setNewAnswer({ answerText: "", isCorrect: false, questionId: selectedQuestionId });
    } catch (error) {
      console.error("Error adding answer:", error);
    }
  };

  const handleDeleteAnswer = async (answerId: number) => {
    try {
      await deleteAnswer(answerId);
      setAnswers(answers.filter((a) => a.answerId !== answerId));
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #e3f2fd, #f1f8e9, #e8f5e9)",
        minHeight: "100vh",
        padding: 3,
      }}
    >
      <Paper
        sx={{
          padding: 3,
          maxWidth: 900,
          margin: "20px auto",
          borderRadius: 4,
          boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          Manage Answers
        </Typography>
        <hr />

        {/* Select Subject */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Select Subject</InputLabel>
          <Select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            <MenuItem value="" disabled>
              Select a Subject
            </MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject.subId} value={subject.subId}>
                {subject.subName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select Topic */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Select Topic</InputLabel>
          <Select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(Number(e.target.value))}
          >
            <MenuItem value="" disabled>
              Select a Topic
            </MenuItem>
            {topics.map((topic) => (
              <MenuItem key={topic.topicId} value={topic.topicId}>
                {topic.topicName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select Lesson */}
        {selectedTopicId && (
          <FormControl fullWidth margin="dense">
            <InputLabel>Select Lesson</InputLabel>
            <Select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(Number(e.target.value))}
            >
              <MenuItem value="" disabled>
                Select a Lesson
              </MenuItem>
              {lessons.map((lesson) => (
                <MenuItem key={lesson.lessonId} value={lesson.lessonId}>
                  {lesson.lessonName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Select Question */}
        {selectedLessonId && (
          <FormControl fullWidth margin="dense">
            <InputLabel>Select Question</InputLabel>
            <Select
              value={selectedQuestionId}
              onChange={(e) => setSelectedQuestionId(Number(e.target.value))}
            >
              <MenuItem value="" disabled>
                Select a Question
              </MenuItem>
              {questions.map((question) => (
                <MenuItem key={question.questionId} value={question.questionId}>
                  {question.questionText}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Add Answer */}
        {selectedQuestionId && (
          <Box display="flex" gap={2} alignItems="center" marginTop={3}>
            <TextField
              label="Answer Text"
              fullWidth
              value={newAnswer.answerText}
              onChange={(e) =>
                setNewAnswer({ ...newAnswer, answerText: e.target.value })
              }
            />
            <Checkbox
              checked={newAnswer.isCorrect}
              onChange={(e) =>
                setNewAnswer({ ...newAnswer, isCorrect: e.target.checked })
              }
            />
            <Fab
              color="primary"
              onClick={handleAddAnswer}
              size="small"
              sx={{ backgroundColor: "#1e88e5", "&:hover": { backgroundColor: "#1565c0" } }}
            >
              <Add />
            </Fab>
          </Box>
        )}

        {/* Answer Table */}
        {answers.length > 0 ? (
          <Table
            sx={{
              marginTop: 3,
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Answer</TableCell>
                <TableCell>Correct</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {answers.map((answer) => (
                <TableRow key={answer.answerId}>
                  <TableCell>{answer.answerId}</TableCell>
                  <TableCell>{answer.answerText}</TableCell>
                  <TableCell>{answer.isCorrect ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => handleDeleteAnswer(answer.answerId)}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body2" textAlign="center" marginTop={3}>
            No answers found.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AnswerComponent;
