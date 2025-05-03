"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { Add, Edit, Delete, CheckCircle, Cancel } from "@mui/icons-material";
import {
    getLessons,
    createLesson,
    updateLesson,
    deleteLesson,
    getTopics,
} from "@/services/subapi";


// Lesson Interface
interface Lesson {
    lessonId: number;
    lessonName: string;
    description: string;
    topicId: number;
    topicName: string;
    isActive: boolean;
    createdAt: string;
}

// Topic Interface
interface Topic {
    topicId: number;
    topicName: string;
}

export default function SubTopic() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
        lessonName: "",
        description: "",
        topicId: 0,
        topicName: "",
        isActive: true,
    });
    const [open, setOpen] = useState(false);

    // Fetch Lessons & Topics
    useEffect(() => {
        fetchLessons();
        fetchTopics(); // Fetch Topics List
    }, []);

    // Get Lesson List
    async function fetchLessons() {
        try {
            const data = await getLessons();
            setLessons(data);
        } catch (error) {
            console.error("Error fetching lessons:", error);
        }
    }

    // Get Topic List
    async function fetchTopics() {
        try {
            const data = await getTopics();
            setTopics(data);
        } catch (error) {
            console.error("Error fetching topics:", error);
        }
    }

    // Handle Create / Update Lesson
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const timestamp = new Date().toISOString();

        if (selectedLesson) {
            // Update Existing Lesson
            const updatedLesson = {
                ...selectedLesson,
                ...newLesson,
                createdAt: selectedLesson.createdAt,
            };
            await updateLesson(selectedLesson.lessonId, updatedLesson);
        } else {
            // Create New Lesson
            const lessonData = {
                ...newLesson,
                createdAt: timestamp,
            };
            await createLesson(lessonData);
        }

        setOpen(false);
        resetForm();
        fetchLessons();
    };

    // Reset Form After Submit
    const resetForm = () => {
        setNewLesson({
            lessonName: "",
            description: "",
            topicId: 0,
            topicName: "",
            isActive: true,
        });
        setSelectedLesson(null);
    };

    // Handle Edit Button
    const handleEdit = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        setNewLesson(lesson);
        setOpen(true);
    };

    // Handle Delete Button
    const handleDelete = async (lessonId: number) => {
        await deleteLesson(lessonId);
        fetchLessons();
    };

    return (
        <Paper
            sx={{
                padding: 4,
                background: "linear-gradient(to right, #e3f2fd, #e0f7fa)",
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
                    📚 Lesson Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
                >
                    Add Lesson
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ border: "1px solid #ddd" }}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
                        <TableRow>
                            {[
                                "Lesson ID",
                                "Lesson Name",
                                "Description",
                                "Topic Name",
                                "Created At",
                                "Active",
                                "Actions",
                            ].map((header) => (
                                <TableCell key={header} sx={{ fontWeight: "bold" }}>
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lessons.map((lesson) => (
                            <TableRow key={lesson.lessonId}>
                                <TableCell>{lesson.lessonId}</TableCell>
                                <TableCell>{lesson.lessonName}</TableCell>
                                <TableCell>{lesson.description}</TableCell>
                                <TableCell>{lesson.topicName}</TableCell>
                                <TableCell>
                                    {new Date(lesson.createdAt).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {lesson.isActive ? (
                                        <CheckCircle color="success" />
                                    ) : (
                                        <Cancel color="error" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(lesson)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(lesson.lessonId)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for Create & Edit */}
            <Dialog open={open} onClose={() => setOpen(false)}
                aria-hidden="false"
            >
                <DialogTitle>
                    {selectedLesson ? "Edit Lesson" : "Add Lesson"}
                </DialogTitle>
                <DialogContent>
                    {/* Topic Dropdown */}
                    <TextField
                        select
                        label="Select Topic"
                        fullWidth
                        margin="dense"
                        value={newLesson.topicId || ""}
                        onChange={(e) => {
                            const selectedTopic = topics.find(
                                (topic) => topic.topicId === Number(e.target.value)
                            );
                            setNewLesson({
                                ...newLesson,
                                topicId: Number(e.target.value),
                                topicName: selectedTopic?.topicName || "",
                            });
                        }}
                    >
                        <MenuItem value="">Select a Topic</MenuItem>
                        {topics.map((topic) => (
                            <MenuItem key={topic.topicId} value={topic.topicId}>
                                {topic.topicName}
                            </MenuItem>
                        ))}
                    </TextField>


                    <TextField
                        label="Lesson Name"
                        fullWidth
                        margin="dense"
                        value={newLesson.lessonName}
                        onChange={(e) =>
                            setNewLesson({ ...newLesson, lessonName: e.target.value })
                        }
                        required
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="dense"
                        multiline
                        rows={2}
                        value={newLesson.description}
                        onChange={(e) =>
                            setNewLesson({ ...newLesson, description: e.target.value })
                        }
                        required
                    />
                    <Box display="flex" alignItems="center" mt={1}>
                        <Checkbox
                            checked={newLesson.isActive}
                            onChange={(e) =>
                                setNewLesson({ ...newLesson, isActive: e.target.checked })
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
                        startIcon={selectedLesson ? <Edit /> : <Add />}
                    >
                        {selectedLesson ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
