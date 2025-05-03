"use client";
import React, { useEffect, useState } from "react";
import { fetchSubject, fetchTopicsBySubject, fetchLessonsByTopic, fetchQuestionsByLesson, fetchAnswers } from "@/services/previewdetails"; // Update the API functions
import PreviewQuiz from "./PreviewQuiz";
import {
    Button,
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
} from "@mui/material";
import { Topic } from "@/services/answerService";
// import Image from "next/image";

// ✅ Wave Background for Top and Bottom
const waveStyle = {
    position: "absolute",
    width: "100%",
    height: "40%",
    zIndex: -1,
    top: 0,
    left: 0,
};

const footerWaveStyle = {
    ...waveStyle,
    top: "auto",
    bottom: 0,
};

const QuizDetails = () => {
    const [quizId, setQuizId] = useState(""); // Default Quiz ID
    const [quizTitle, setQuizTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [topics, setTopics] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<any>(null);
    const [selectedLesson, setSelectedLesson] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
    const [addedTopics, setAddedTopics] = useState<any[]>([]);
    const [topicQuestionMap, setTopicQuestionMap] = useState<any>({});
    const [openAddTopic, setOpenAddTopic] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);

    // Fetch Subject, Topics, Lessons, and Questions
    useEffect(() => {
        const loadData = async () => {
            try {
                const subjectRes = await fetchSubject(1); // Fetch subject by ID
                setQuizId(subjectRes.quizId || "N/A");
                setSubject(subjectRes.subName || "N/A");
                setQuizId(subjectRes.subjectId || "N/A");

                const topicRes = await fetchTopicsBySubject(1); // Fetch topics by subject ID
                setTopics(topicRes.$values || []);

                const lessonRes = await fetchLessonsByTopic(1); // Fetch lessons by topic ID
                setLessons(lessonRes.$values || []);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        loadData();
    }, []);

    const fetchLessonQuestions = async (lessonId: number) => {
        try {
            const questionRes = await fetchQuestionsByLesson(1, selectedTopic?.topicId, lessonId); // Adjust API call
            console.log(questionRes);  // Check if the API returns questions
            const questionsWithAnswers = await Promise.all(
                (questionRes.$values || []).map(async (question: any) => {
                    // Fetch answers for each question
                    const answersRes = await fetchAnswers(question.questionId);
                    return { ...question, answers: answersRes.$values || [] }; // Attach answers to the question
                })
            );
            setQuestions(questionsWithAnswers); // Set questions with answers to state
        } catch (error) {
            console.error("Error fetching questions:", error); // Catch any errors
        }
    };

    // Handle Topic Selection and Load Related Lessons and Questions
    const handleTopicChange = async (topic: Topic) => {
        setSelectedTopic(topic);
        setQuizTitle(topic.topicName || "Topic Quiz");

        const lessonRes = await fetchLessonsByTopic(topic.topicId);
        setLessons(lessonRes.$values || []);
    };

    // Handle Lesson Change
    const handleLessonChange = async (lesson: any) => {
        setSelectedLesson(lesson); // Update selected lesson
        await fetchLessonQuestions(lesson.lessonId); // Fetch questions for the selected lesson
    };


    // Handle Manual Question Selection
    const handleQuestionSelect = (questionId: number, checked: boolean) => {
        const selectedQuestion = questions.find((q) => q.questionId === questionId);

        if (checked) {
            setSelectedQuestions([...selectedQuestions, selectedQuestion]);
        } else {
            const updatedQuestions = selectedQuestions.filter((q) => q.questionId !== questionId);
            setSelectedQuestions(updatedQuestions);
        }
    };

    // Handle Save Topics with Selected Questions
    const handleSaveTopics = () => {
        if (selectedTopic && selectedQuestions.length > 0) {
            setTopicQuestionMap({
                ...topicQuestionMap,
                [selectedTopic.topicId]: selectedQuestions,
            });

            const updatedTopics = [
                ...addedTopics.filter((t) => t.topicId !== selectedTopic.topicId),
                {
                    ...selectedTopic,
                    questions: selectedQuestions,
                },
            ];

            setAddedTopics(updatedTopics);
            setOpenAddTopic(false);
        } else {
            alert("Please select at least one question before saving.");
        }
    };

    // Open Preview
    const handlePreview = () => {
        setOpenPreview(true);
    };

    return (
        <Container sx={{
            position: "relative",
            background: "linear-gradient(to bottom, #3b82f6, #1e3a8a)",
            color: "#fff",
            borderRadius: 3,
            padding: 4,
            overflow: "hidden",
        }}>
            <Typography variant="h4" gutterBottom>
                🎯 Create Quiz
            </Typography>

            <Card sx={{ backgroundColor: "rgba(255, 255, 255, 0.9)", color: "#333" }}>
                <CardContent>
                    <Box display="flex" gap={3} marginBottom={2}>
                        <Box>
                            <Typography variant="subtitle1">QuizId: {quizId}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">QuizTitle: {quizTitle}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">Subject: {subject}</Typography>
                        </Box>
                    </Box>

                    {/* Add Topic Button */}
                    <Button variant="contained" color="primary" onClick={() => setOpenAddTopic(true)}>
                        ➕ Add Topic
                    </Button>

                    {/* Added Topics with Questions */}
                    <Box marginTop={3} border={1} padding={2}>
                        <Typography variant="h6">📚 Added Topic Details</Typography>
                        {addedTopics.length > 0 ? (
                            addedTopics.map((topic, index) => (
                                <Box key={topic.topicId} marginTop={2}>
                                    <Typography variant="subtitle1">
                                        {index + 1}. {topic.topicName}
                                    </Typography>
                                    {topic.questions.map((question: any, qIndex: number) => (
                                        <Typography key={question.questionId} variant="body2" marginLeft={3}>
                                            {qIndex + 1}. {question.questionText}
                                        </Typography>
                                    ))}
                                </Box>
                            ))
                        ) : (
                            <Typography>No topics added yet.</Typography>
                        )}
                    </Box>

                    {/* Preview and Save Buttons */}
                    <Box display="flex" gap={2} marginTop={3}>
                        <Button variant="contained" color="secondary" onClick={handlePreview}>
                            👀 Preview
                        </Button>
                        <Button variant="contained" color="success">
                            💾 Save
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Add Topic Dialog */}
            <Dialog open={openAddTopic} onClose={() => setOpenAddTopic(false)} maxWidth="md" fullWidth>
                <DialogTitle>Select Topics with Lessons</DialogTitle>
                <DialogContent>
                    {topics.map((topic) => (
                        <Box key={topic.topicId} border={1} padding={2} marginTop={1}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedTopic?.topicId === topic.topicId}
                                        onChange={() => handleTopicChange(topic)}
                                    />
                                }
                                label={`Topic: ${topic.topicName}`}
                            />
                            <DialogTitle>Select Lesson with Questions</DialogTitle>

                            {selectedTopic?.topicId === topic.topicId &&
                                lessons
                                    .filter((lesson) => lesson.topicId === topic.topicId)
                                    .map((lesson) => (
                                        <Box key={lesson.lessonId} marginLeft={3}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedLesson?.lessonId === lesson.lessonId}
                                                        onChange={() => handleLessonChange(lesson)}
                                                    />
                                                }
                                                label={`${lesson.lessonName}`}
                                            />
                                            {selectedLesson?.lessonId === lesson.lessonId &&
                                                questions
                                                    .filter((q) => q.lessonId === lesson.lessonId)
                                                    .map((question) => (
                                                        <Box key={question.questionId} marginLeft={3}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={selectedQuestions.some((q) => q.questionId === question.questionId)}
                                                                        onChange={(e) =>
                                                                            handleQuestionSelect(question.questionId, e.target.checked)
                                                                        }
                                                                    />
                                                                }
                                                                label={`${question.questionText}`}
                                                            />
                                                        </Box>
                                                    ))}
                                        </Box>
                                    ))}
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddTopic(false)} color="error">
                        CANCEL
                    </Button>
                    <Button onClick={handleSaveTopics} color="primary">
                        SAVE TOPICS
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
                <DialogTitle>Preview Quiz Data</DialogTitle>
                <DialogContent>
                    <PreviewQuiz
                        quiz={{ title: quizTitle, subject }}
                        topics={addedTopics}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPreview(false)} color="error">
                        CLOSE
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default QuizDetails;
