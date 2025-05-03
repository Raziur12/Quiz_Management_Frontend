"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Checkbox,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete, CheckCircle, Cancel } from "@mui/icons-material";

interface Subject {
  subId: number;
  subName: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isActive: boolean;
}

export default function SubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    subId: 0,
    subName: "",
    description: "",
    isActive: true,
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function fetchSubjects() {
    try {
      const response = await axios.get("https://localhost:7285/api/Subject");
      setSubjects(response.data.$values || response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();

    if (selectedSubject) {
      const updatedSubject = {
        ...selectedSubject,
        subName: newSubject.subName || "",
        description: newSubject.description || "",
        updatedBy: "Admin",
        updatedAt: timestamp,
        isActive: newSubject.isActive ?? true,
      };
      try {
        await axios.put(
          `https://localhost:7285/api/Subject/${selectedSubject.subId}`,
          updatedSubject
        );
        setSubjects(
          subjects.map((sub) =>
            sub.subId === selectedSubject.subId ? updatedSubject : sub
          )
        );
        setSelectedSubject(null);
      } catch (error) {
        console.error("Error updating subject:", error);
      }
    } else {
      const subjectData = {
        subName: newSubject.subName || "",
        description: newSubject.description || "",
        createdBy: "Admin",
        createdAt: timestamp,
        updatedBy: "Admin",
        updatedAt: timestamp,
        isActive: newSubject.isActive ?? true,
      };
      try {
        const response = await axios.post(
          "https://localhost:7285/api/Subject",
          subjectData
        );
        setSubjects([...subjects, response.data]);
      } catch (error) {
        console.error("Error adding subject:", error);
      }
    }

    setNewSubject({
      subId: 0,
      subName: "",
      description: "",
      isActive: true,
    });
    setOpen(false);
  };

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setNewSubject(subject);
    setOpen(true);
  };

  const handleDelete = async (subId: number) => {
    try {
      await axios.delete(`https://localhost:7285/api/Subject/${subId}`);
      setSubjects(subjects.filter((sub) => sub.subId !== subId));
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  return (
    <Paper
      sx={{
        padding: 4,
        background: "linear-gradient(to right, #e0f7fa, #f1f8e9)",
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
          🎯 Subjects Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Subject
        </Button>
      </Box>

      {/* **Table to Display Subjects** */}
      <TableContainer component={Paper} sx={{ border: "1px solid #ddd" }}>
        <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              {[
                "Subject ID",
                "Subject Name",
                "Description",
                "Created At",
                "Updated At",
                "Active",
                "Actions",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                    backgroundColor: "#e0f7fa",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow
                key={subject.subId}
                sx={{
                  borderBottom: "1px solid #ddd",
                  "&:hover": { backgroundColor: "#f1f8e9" },
                }}
              >
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  {subject.subId}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  {subject.subName}
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    maxWidth: "250px",
                  }}
                >
                  {subject.description}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  {subject.createdAt
                    ? new Date(subject.createdAt).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  {subject.updatedAt
                    ? new Date(subject.updatedAt).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  {subject.isActive ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Cancel color="error" />
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(subject)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(subject.subId)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* **Dialog for Create & Edit** */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        disableEnforceFocus
        disableScrollLock
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle sx={{ backgroundColor: "#e0f7fa" }}>
          {selectedSubject ? "Edit Subject" : "Add Subject"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Subject ID"
            fullWidth
            margin="dense"
            type="number"
            value={newSubject.subId || ""}
            onChange={(e) =>
              setNewSubject({ ...newSubject, subId: Number(e.target.value) })
            }
            required
            disabled={!!selectedSubject}
          />
          <TextField
            label="Subject Name"
            fullWidth
            margin="dense"
            value={newSubject.subName || ""}
            onChange={(e) =>
              setNewSubject({ ...newSubject, subName: e.target.value })
            }
            required
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            multiline
            minRows={2}
            value={newSubject.description || ""}
            onChange={(e) =>
              setNewSubject({ ...newSubject, description: e.target.value })
            }
            required
          />
          <Box display="flex" alignItems="center" mt={1}>
            <Checkbox
              checked={newSubject.isActive ?? true}
              onChange={(e) =>
                setNewSubject({ ...newSubject, isActive: e.target.checked })
              }
            />
            <Typography>Active</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            startIcon={selectedSubject ? <Edit /> : <Add />}
          >
            {selectedSubject ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
