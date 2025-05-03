import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const QuizModal = ({ open, onClose, onSave, initialData, subjects }: any) => {
  const [quizData, setQuizData] = useState({
    quizTitle: "",
    totalDurationTime: "",
    totalQuestions: "",
    totalMarks: "",
    subId: "",
  });

  // ✅ Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setQuizData({
        quizTitle: initialData.quizTitle || "",
        totalDurationTime: initialData.totalDurationTime || "",
        totalQuestions: initialData.totalQuestions || "",
        totalMarks: initialData.totalMarks || "",
        subId: initialData.subId || "",
      });
    }
  }, [initialData]);

  // ✅ Handle form changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  // ✅ Handle save
  const handleSave = () => {
    onSave(quizData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Edit Quiz" : "Add New Quiz"}</DialogTitle>
      <DialogContent>
         {/* ✅ Correct Subject Dropdown */}
         <TextField
          select
          label="Select Subject"
          name="subId"
          value={quizData.subId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {subjects?.map((subject: any) => (
            <MenuItem key={subject.subId} value={subject.subId}>
              {subject.subName}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          label="Quiz Title"
          name="quizTitle"
          value={quizData.quizTitle}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Exam Duration (in minutes)"
          name="totalDurationTime"
          value={quizData.totalDurationTime}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Total Questions"
          name="totalQuestions"
          value={quizData.totalQuestions}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Total Marks"
          name="totalMarks"
          value={quizData.totalMarks}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuizModal;
