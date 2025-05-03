"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import QuizModal from "./QuizModel"; // Updated Modal
import {
  fetchQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from "@/services/api";
import { fetchSubjects, fetchTopicsBySubjectId } from "@/services/apiService";
import { fetchQuestions, fetchAnswers } from "@/services/answerService";

const Page: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]); // ✅ Subjects state
  const [openModal, setOpenModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingQuizDetails, setViewingQuizDetails] = useState<any>(null);

  // ✅ Load quizzes and subjects on component mount
  useEffect(() => {
    loadQuizzes();
    loadSubjects(); // ✅ Load subjects on page load
  }, []);

  // ✅ Fetch quizzes from API
  const loadQuizzes = async () => {
    try {
      const data = await fetchQuizzes();
      console.log("Fetched quizzes:", data);
      if (Array.isArray(data)) {
        setQuizzes(data);
      } else if (data?.$values) {
        setQuizzes(data.$values);
      } else {
        setQuizzes([]);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setQuizzes([]);
    }
  };

  // ✅ Fetch subjects for the dropdown
  const loadSubjects = async () => {
    try {
      const data = await fetchSubjects();
      console.log("Fetched subjects:", data);
      if (data?.$values) {
        setSubjects(data.$values);
      } else if (Array.isArray(data)) {
        setSubjects(data);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setSubjects([]);
    }
  };

  // ✅ Add or update quiz
  const handleAddOrUpdateQuiz = async (quizData: any) => {
    try {
      if (editingQuiz) {
        await updateQuiz(editingQuiz.quizId, {
          ...quizData,
          totalQuestions: parseInt(quizData.totalQuestions),
          totalMarks: parseInt(quizData.totalMarks),
        });
      } else {
        await createQuiz({
          ...quizData,
          totalQuestions: parseInt(quizData.totalQuestions),
          totalMarks: parseInt(quizData.totalMarks),
        });
      }
      loadQuizzes();
      setEditingQuiz(null);
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  // ✅ Edit quiz
  const handleEdit = (quiz: any) => {
    setEditingQuiz(quiz);
    setOpenModal(true);
  };

  // ✅ Delete quiz
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteQuiz(id);
        loadQuizzes();
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };

  // ✅ View subject, topics, questions, and answers
  const handleView = async (quiz: any) => {
    console.log("Selected quiz:", quiz);
    try {
      const subjects = await fetchSubjects();
      const subject = subjects.find((s: any) => s.subId === quiz.subId);
      const topics = await fetchTopicsBySubjectId(quiz.subId);

      const topicDetails = await Promise.all(
        topics.map(async (topic: any) => {
          const questions = await fetchQuestions(quiz.subId, topic.topicId);
          const questionsWithAnswers = await Promise.all(
            questions.map(async (question: any) => {
              const answers = await fetchAnswers(question.questionId);
              return { ...question, answers };
            })
          );
          return { ...topic, questions: questionsWithAnswers };
        })
      );

      setViewingQuizDetails({
        subject,
        topicDetails,
        totalQuestions: quiz.totalQuestions,
        totalMarks: quiz.totalMarks,
      });
      setViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    }
  };

  return (
    <Paper
      sx={{
        padding: 4,
        background: "linear-gradient(to right, #f8fafc, #e2e8f0)",
        borderRadius: 4,
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        marginTop: 4,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Typography variant="h4" color="primary">
          🎯 Manage Quizzes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          color="primary"
          onClick={() => {
            setEditingQuiz(null);
            setOpenModal(true);
          }}
        >
          Add New Quiz
        </Button>
      </Box>

      {/* ✅ Quiz Table */}
      <Table
        sx={{
          marginTop: 2,
          backgroundColor: "#fff",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <TableHead sx={{ backgroundColor: "#3b82f6", color: "#fff" }}>
          <TableRow>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Title
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Duration (Min)
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Total Questions
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Total Marks
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(quizzes) && quizzes.length > 0 ? (
            quizzes.map((quiz: any) => (
              <TableRow
                key={quiz.quizId}
                sx={{
                  "&:nth-of-type(even)": { backgroundColor: "#f8fafc" },
                  "&:hover": { backgroundColor: "#e2e8f0" },
                }}
              >
                <TableCell>{quiz.quizId}</TableCell>
                <TableCell>{quiz.quizTitle}</TableCell>
                <TableCell>{quiz.totalDurationTime}</TableCell>
                <TableCell>{quiz.totalQuestions}</TableCell>
                <TableCell>{quiz.totalMarks}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(quiz)}
                    title="Edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="info"
                    onClick={() => handleView(quiz)}
                    title="View"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(quiz.quizId)}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No quizzes found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ✅ Add/Edit Modal */}
      <QuizModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleAddOrUpdateQuiz}
        initialData={editingQuiz}
        subjects={subjects} // ✅ Pass subjects here
      />

      {/* ✅ View Quiz Details Modal */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>📚 View Quiz Details</DialogTitle>
        <DialogContent dividers>
          {viewingQuizDetails ? (
            <>
              <Typography variant="h6" color="primary">
                Subject: {viewingQuizDetails.subject?.subName || "N/A"}
              </Typography>
              <Typography variant="body1">
                Total Questions: {viewingQuizDetails.totalQuestions}
              </Typography>
              <Typography variant="body1">
                Total Marks: {viewingQuizDetails.totalMarks}
              </Typography>
            </>
          ) : (
            <Typography>No details available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Page;
