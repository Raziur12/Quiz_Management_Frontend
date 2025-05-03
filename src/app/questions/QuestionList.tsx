"use client";

import { useEffect, useState } from "react";
import {
  fetchSubjects,
  fetchTopics,
  fetchLessons,
  fetchQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  fetchQuestionTypes,
} from "@/services/api";
import { Question } from "@/types/question";
import { QuestionTypes } from "@/types/questionTypes";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const QuestionList = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<{ subId: string; subName: string }[]>([]);
  const [topics, setTopics] = useState<{ topicId: number; topicName: string }[]>([]);
  const [lessons, setLessons] = useState<{ lessonId: number; lessonName: string }[]>([]);
  const [questionTypes, setQuestionTypes] = useState<QuestionTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [subId, setSubId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<number | null>(null);
  const [lessonId, setLessonId] = useState<number | null>(null);
  const [questionTypeId, setQuestionTypeId] = useState<number | null>(null);
  const [marks, setMarks] = useState<number | null>(null);
  const [durationInMins, setDurationInMins] = useState<number | null>(null);

  useEffect(() => {
    loadSubjects();
    loadQuestionTypes();
  }, []);

  useEffect(() => {
    if (subId) {
      loadTopics(subId);
    }
  }, [subId]);

  useEffect(() => {
    if (topicId) {
      loadLessons(topicId);
    }
  }, [topicId]);

  useEffect(() => {
    if (subId && topicId && lessonId) {
      loadQuestions(subId, topicId, lessonId);
    }
  }, [subId, topicId, lessonId]);

  // ✅ Load Subjects
  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await fetchSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fix in loadTopics if required
  const loadTopics = async (subjectId: string) => {
    try {
      setLoading(true);
      const data = await fetchTopics(subjectId);
      console.log("Fetched Topics:", data); // Debug the response

      if (Array.isArray(data)) {
        setTopics(data);
      } else if (data?.$values && Array.isArray(data.$values)) {
        setTopics(data.$values);
      } else {
        setTopics([]);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };



  // ✅ Load Lessons (SubTopics)
  const loadLessons = async (topicId: number) => {
    try {
      setLoading(true);
      const data = await fetchLessons(topicId);
      console.log("Fetched Lessons:", data); // For debugging

      // ✅ Check if data is an array before setting
      if (Array.isArray(data)) {
        setLessons(data);
      } else if (data?.$values && Array.isArray(data.$values)) {
        setLessons(data.$values); // Handle $values if it exists
      } else {
        setLessons([]); // Default to empty array if invalid
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };


  // ✅ Load Questions
  const loadQuestions = async (subjectId: string, topicId: number, lessonId: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://localhost:7285/api/Question/subject/${subjectId}/topic/${topicId}/lesson/${lessonId}`
      );
      const data = await response.json();

      if (data?.$values && Array.isArray(data.$values)) {
        setQuestions(data.$values);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load Question Types
  const loadQuestionTypes = async () => {
    try {
      const data = await fetchQuestionTypes();
      setQuestionTypes(data?.$values || []);
    } catch (error) {
      console.error("Error fetching question types:", error);
    }
  };

  // ✅ Open Dialog
  const handleOpen = (question: Question | null = null) => {
    setCurrentQuestion(question);
    setQuestionText(question?.questionText || "");
    setSubId(question ? question.subId : subId);
    setTopicId(question ? question.topicId : topicId);
    setLessonId(question ? question.lessonId : lessonId);
    setQuestionTypeId(question?.questionTypeId || null);
    setMarks(question?.marks || null);
    setDurationInMins(question?.durationInMins || null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentQuestion(null);
    setQuestionText("");
    setLessonId(null);
    setQuestionTypeId(null);
    setMarks(null);
    setDurationInMins(null);
  };

  // ✅ Save Question
  const handleSave = async () => {
    try {
      if (!subId || !topicId || !lessonId || !questionTypeId || !questionText.trim()) {
        alert("Please fill all required fields.");
        return;
      }

      const payload = [
        {
          questionText: questionText.trim(),
          subId: String(subId),
          topicId: Number(topicId),
          lessonId: Number(lessonId),
          questionTypeId: Number(questionTypeId),
          marks: marks !== null ? Number(marks) : 0,
          durationInMins: durationInMins !== null ? Number(durationInMins) : 0,
        },
      ];

      if (currentQuestion) {
        await updateQuestion(currentQuestion.questionId, payload[0]);
      } else {
        await addQuestion(payload);
      }

      handleClose();
      loadQuestions(subId, topicId, lessonId);
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  // ✅ Delete Question
  const handleDelete = async (questionId: number) => {
    try {
      await deleteQuestion(questionId);
      loadQuestions(subId as string, topicId as number, lessonId as number);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {loading && <CircularProgress />}
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Question
      </Button>

      <Box display="flex" gap={2} flexWrap="wrap">
        {questions.map((question) => (
          <Card key={question.questionId} sx={{ width: 250, p: 2 }}>
            <CardContent>
              <Typography variant="h6">{question.questionText}</Typography>
              <Button size="small" color="primary" onClick={() => handleOpen(question)}>
                Edit
              </Button>
              <Button size="small" color="secondary" onClick={() => handleDelete(question.questionId)}>
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* ✅ Dialog for Add/Edit */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentQuestion ? "Edit Question" : "Add Question"}</DialogTitle>
        <DialogContent>
          {/* Select Subject */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Select Subject</InputLabel>
            <Select value={subId || ""} onChange={(e) => setSubId(e.target.value)}>
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
            <Select value={topicId || ""} onChange={(e) => setTopicId(Number(e.target.value))}>
              {topics.map((topic) => (
                <MenuItem key={topic.topicId} value={topic.topicId}>
                  {topic.topicName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Select Lesson (SubTopic) */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Select Lesson</InputLabel>
            <Select value={lessonId || ""} onChange={(e) => setLessonId(Number(e.target.value))}>
              {lessons.map((lesson) => (
                <MenuItem key={lesson.lessonId} value={lesson.lessonId}>
                  {lesson.lessonName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Select Question Type */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Select Question Type</InputLabel>
            <Select value={questionTypeId || ""} onChange={(e) => setQuestionTypeId(Number(e.target.value))}>
              {questionTypes.map((questionType) => (
                <MenuItem key={questionType.questionTypeId} value={questionType.questionTypeId}>
                  {questionType.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Question Text */}
          <TextField
            label="Question Text"
            fullWidth
            margin="dense"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />

          {/* Marks */}
          <TextField
            label="Marks"
            type="number"
            fullWidth
            margin="dense"
            value={marks || ""}
            onChange={(e) => setMarks(Number(e.target.value))}
          />

          {/* Duration */}
          <TextField
            label="Duration (mins)"
            type="number"
            fullWidth
            margin="dense"
            value={durationInMins || ""}
            onChange={(e) => setDurationInMins(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionList;
