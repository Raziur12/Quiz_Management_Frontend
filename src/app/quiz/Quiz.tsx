"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";

// ✅ Fetch Subjects
const fetchSubjects = async () => {
  try {
    const res = await fetch("https://localhost:7285/api/Subject");
    const data = await res.json();
    return data.$values || [];
  } catch (error) {
    console.error("❌ Error fetching subjects:", error);
    return [];
  }
};

// ✅ Fetch Topics
const fetchTopics = async (subjectId: number) => {
  try {
    const res = await fetch(
      `https://localhost:7285/api/Topic/BySubject/${subjectId}`
    );
    const data = await res.json();
    return data?.$values || [];
  } catch (error) {
    console.error("❌ Error fetching topics:", error);
    return [];
  }
};

// ✅ Fetch Lessons
const fetchLessons = async (topicId: number) => {
  try {
    const res = await fetch(
      `https://localhost:7285/api/Lesson/GetLessonsByTopic/${topicId}`
    );
    const data = await res.json();
    return data?.$values || [];
  } catch (error) {
    console.error("❌ Error fetching lessons:", error);
    return [];
  }
};

// ✅ Fetch Questions with Count
const fetchQuestions = async (
  subId: number,
  topicId: number,
  lessonId: number,
  count: number
) => {
  try {
    const res = await fetch(
      `https://localhost:7285/api/Question/subject/${subId}/topic/${topicId}/lesson/${lessonId}?count=${count}`
    );
    const data = await res.json();
    return data?.$values || [];
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    return [];
  }
};

// ✅ Fetch Answers
const fetchAnswers = async (questionId: number) => {
  try {
    const res = await fetch(
      `https://localhost:7285/api/Answer/GetAnswersByQuestion/${questionId}`
    );
    const data = await res.json();
    return data.$values || [];
  } catch (error) {
    console.error("❌ Error fetching answers:", error);
    return [];
  }
};

// ✅ Submit Quiz Attempt
const submitQuizAttempt = async (attemptData: any) => {
  try {
    const res = await fetch("https://localhost:7285/api/QuizAttempt/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attemptData),
    });

    if (!res.ok) throw new Error("❌ Quiz submission failed.");

    const result = await res.json();
    console.log("👉 Backend Response", result);
    window.location.href = `/result?status=${attemptData.isPassed}&score=${attemptData.totalScore}&id=0`;
  } catch (error) {
    console.error("❌ Error submitting quiz:", error);
    alert("❌ Error submitting quiz!");
  }
};

const Quiz = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);

  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(10);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 min
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Load Subjects
  useEffect(() => {
    const loadSubjects = async () => {
      setLoading(true);
      const data = await fetchSubjects();
      setSubjects(data);
      setLoading(false);
    };
    loadSubjects();
  }, []);

  // ✅ Load Topics
  useEffect(() => {
    if (selectedSubject !== null) {
      setTopics([]);
      setLessons([]);
      setSelectedTopic(null);
      setSelectedLesson(null);
      fetchTopics(selectedSubject).then(setTopics);
    }
  }, [selectedSubject]);

  // ✅ Load Lessons
  useEffect(() => {
    if (selectedTopic !== null) {
      setLessons([]);
      setSelectedLesson(null);
      fetchLessons(selectedTopic).then(setLessons);
    }
  }, [selectedTopic]);

  // ✅ Load Questions
  useEffect(() => {
    if (
      selectedSubject !== null &&
      selectedTopic !== null &&
      selectedLesson !== null
    ) {
      setQuestions([]);
      setCurrentQuestionIndex(0);
      fetchQuestions(
        selectedSubject,
        selectedTopic,
        selectedLesson,
        questionCount
      ).then(setQuestions);
    }
  }, [selectedSubject, selectedTopic, selectedLesson, questionCount]);

  // ✅ Load Answers
  useEffect(() => {
    if (questions.length > 0) {
      const qid = questions[currentQuestionIndex]?.questionId;
      if (qid) {
        fetchAnswers(qid).then(setAnswers);
      }
    } else {
      setAnswers([]);
    }
  }, [questions, currentQuestionIndex]);

  // ✅ Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Select Answer
  const handleAnswerSelect = (answerId: number) => {
    setSelectedAnswer(answerId);
    const questionId = questions[currentQuestionIndex]?.questionId;
    const isCorrect = answers.find((a) => a.answerId === answerId)?.isCorrect || false;

    const updatedAttempt = {
      questionId,
      selectedAnswerId: answerId,
      isCorrect,
    };

    setQuizAttempts((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? updatedAttempt : a
        );
      }
      return [...prev, updatedAttempt];
    });
  };

  // ✅ Navigation
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(null);
    }
  };

  // ✅ Final Submission
  const handleSubmit = () => {
    const totalCorrect = quizAttempts.filter((a) => a.isCorrect).length;
    const totalAttempted = quizAttempts.length;
    const totalQuestions = questions.length;
    const isPassed = (totalCorrect / totalQuestions) * 100 >= 70;

    const attemptData = {
      id: 0,
      quizId: selectedTopic,
      subId: selectedSubject,
      studentId: 2,
      examDurationInMin: 5,
      totalExamTakenDurationInMin: 5 - Math.floor(timeLeft / 60),
      totalQuestions,
      totalAttemptedQuestions: totalAttempted,
      totalCorrectAnswers: totalCorrect,
      totalIncorrectAnswers: totalAttempted - totalCorrect,
      totalScore: totalCorrect * 5,
      isPassed,
      quizDateTime: new Date().toISOString(),
      message: isPassed ? "Congratulations! You passed the quiz." : "Better luck next time.",
      quizResults: quizAttempts.map((a) => ({
        questionId: a.questionId,
        selectedAnswerId: a.selectedAnswerId,
        timeTakenInSec: 0,
        isCorrect: a.isCorrect,
      })),
    };

    submitQuizAttempt(attemptData);
  };

  if (loading) return <CircularProgress />;
  if (!subjects.length)
    return <Typography>No subjects available.</Typography>;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
      <Paper sx={{ width: 600, p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h5">🎯 React Quiz</Typography>
          <Typography
            sx={{
              backgroundColor: timeLeft < 60 ? "#ef5350" : "#4caf50",
              color: "#fff",
              px: 2,
              py: 1,
              borderRadius: 1,
              fontSize: 14,
            }}
          >
            ⏰ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </Typography>
        </Box>

        {/* Subject Selection */}
        <Typography>📚 Select Subject</Typography>
        <Select
          fullWidth
          value={selectedSubject || ""}
          onChange={(e) => setSelectedSubject(Number(e.target.value))}
          displayEmpty
        >
          <MenuItem value="" disabled>Select a subject</MenuItem>
          {subjects.map((s) => (
            <MenuItem key={s.subId} value={s.subId}>{s.subName}</MenuItem>
          ))}
        </Select>

        {/* Topic Selection */}
        {selectedSubject && (
          <>
            <Typography mt={2}>📝 Select Topic</Typography>
            <Select
              fullWidth
              value={selectedTopic || ""}
              onChange={(e) => setSelectedTopic(Number(e.target.value))}
              displayEmpty
            >
              <MenuItem value="" disabled>Select a topic</MenuItem>
              {topics.map((t) => (
                <MenuItem key={t.topicId} value={t.topicId}>{t.topicName}</MenuItem>
              ))}
            </Select>
          </>
        )}

        {/* Lesson Selection */}
        {selectedTopic && (
          <>
            <Typography mt={2}>📖 Select Lesson</Typography>
            <Select
              fullWidth
              value={selectedLesson || ""}
              onChange={(e) => setSelectedLesson(Number(e.target.value))}
              displayEmpty
            >
              <MenuItem value="" disabled>Select a lesson</MenuItem>
              {lessons.map((l) => (
                <MenuItem key={l.lessonId} value={l.lessonId}>{l.lessonName}</MenuItem>
              ))}
            </Select>
          </>
        )}

        {/* Question Count Selection */}
        {selectedLesson && (
          <>
            <Typography mt={2}>🔢 Number of Questions</Typography>
            <Select
              fullWidth
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
            >
              {[2, 5, 10, 15, 20].map((q) => (
                <MenuItem key={q} value={q}>{q}</MenuItem>
              ))}
            </Select>
          </>
        )}

        {/* Quiz Question */}
        {selectedLesson && questions.length > 0 && (
          <Box mt={4}>
            <Typography fontWeight="bold">
              ❓ Q{currentQuestionIndex + 1} / {questions.length}:
            </Typography>
            <Typography mb={2}>{questions[currentQuestionIndex]?.questionText}</Typography>
            <RadioGroup
              value={selectedAnswer}
              onChange={(e) => handleAnswerSelect(Number(e.target.value))}
            >
              {answers.map((a) => (
                <FormControlLabel
                  key={a.answerId}
                  value={a.answerId}
                  control={<Radio />}
                  label={a.answerText}
                />
              ))}
            </RadioGroup>

            {/* Navigation Buttons */}
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="contained">Previous</Button>
              {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={handleNext} variant="contained" color="primary">Next</Button>
              ) : (
                <Button onClick={handleSubmit} variant="contained" color="success">Submit</Button>
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Quiz;
