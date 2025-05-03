"use client";

import { useEffect, useState } from "react";
import {
  fetchTopics, addTopic, updateTopic, deleteTopic, fetchSubjects
} from "@/services/api";
import { Topic } from "@/types/topic";
import {
  Card, CardContent, Typography, CircularProgress, Box, Button,
  TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Select, MenuItem, FormControl, InputLabel
} from "@mui/material";

const TopicList = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjects, setSubjects] = useState<{ subId: string; subName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [topicName, setTopicName] = useState("");
  const [subId, setSubId] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      loadTopics(selectedSubject);
    }
  }, [selectedSubject]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await fetchSubjects();
      setSubjects(Array.isArray(data) ? data : []); // Ensure subjects is always an array
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setSubjects([]); // Fallback to an empty array
      setLoading(false);
    }
  };

  const loadTopics = async (subjectId: string) => {
    try {
      setLoading(true);
      const data = await fetchTopics(subjectId);

      console.log("API Response:", data);

      setTopics(data); // ✅ Only topics of selected subject will be set
      setLoading(false);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  console.log("Selected Subject:", selectedSubject);
  console.log("Fetched Topics:", topics);

  const handleOpen = (topic: Topic | null = null) => {
    setCurrentTopic(topic);
    setTopicName(topic?.topicName || "");
    setSubId(topic?.subId || selectedSubject);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentTopic(null);
    setTopicName("");
    setSubId("");
  };

  const handleSave = async () => {
    try {
      if (currentTopic) {
        await updateTopic(currentTopic.topicId, { topicName, subId });
      } else {
        await addTopic({ topicName, subId });
      }
      handleClose();
      loadTopics(selectedSubject);
    } catch (error) {
      console.error("Error saving topic:", error);
    }
  };

  const handleDelete = async (topicId: number) => {
    try {
      await deleteTopic(topicId);
      loadTopics(selectedSubject);
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Subject Dropdown */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Select Subject</InputLabel>
        <Select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          {subjects.map((subject) => (
            <MenuItem key={subject.subId} value={subject.subId}>
              {subject.subName} ({subject.subId})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Add Topic Button (Disabled when no subject is selected) */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        disabled={!selectedSubject}
      >
        Add Topic
      </Button>

      {/* Display Topics Based on Selected Subject */}
      <Box display="flex" gap={2} flexWrap="wrap">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <Card key={topic.topicId} sx={{ width: 250, p: 2 }}>
              <CardContent>
                <Typography variant="h6">TopicName: {topic.topicName}</Typography>
                <Typography variant="body2">Subject ID: {topic.subId}</Typography>
                <Button size="small" color="primary" onClick={() => handleOpen(topic)}>
                  Edit
                </Button>
                <Button size="small" color="secondary" onClick={() => handleDelete(topic.topicId)}>
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No topics found for the selected subject.</Typography>
        )}
      </Box>

      {/* Dialog for Adding/Editing Topics */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentTopic ? "Edit Topic" : "Add Topic"}</DialogTitle>
        <DialogContent>

          <FormControl fullWidth margin="dense">
            <InputLabel>Subject</InputLabel>
            <Select
              value={subId}
              onChange={(e) => setSubId(e.target.value)}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject.subId} value={subject.subId}>
                  {subject.subName} ({subject.subId})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="dense"
            label="Topic Name"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
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

export default TopicList;
