import React from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

interface AddQuestionFormProps {
  subjects: { subId: string; subName: string }[];
  topics: { topicId: number; topicName: string }[];
  questionTypes: { id: number; name: string }[];
  subId: string | null;
  topicId: number | null;
  questionTypeId: number | null;
  questionText: string;
  marks: number | null;
  durationInMins: number | null;
  onSubIdChange: (value: string) => void;
  onTopicIdChange: (value: number) => void;
  onQuestionTypeIdChange: (value: number) => void;
  onQuestionTextChange: (value: string) => void;
  onMarksChange: (value: number) => void;
  onDurationChange: (value: number) => void;
}

const AddQuestionForm: React.FC<AddQuestionFormProps> = ({
  subjects,
  topics,
  questionTypes,
  subId,
  topicId,
  questionTypeId,
  questionText,
  marks,
  durationInMins,
  onSubIdChange,
  onTopicIdChange,
  onQuestionTypeIdChange,
  onQuestionTextChange,
  onMarksChange,
  onDurationChange,
}) => {
  return (
    <>
      {/* Select Subject */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Select Subject</InputLabel>
        <Select value={subId || ""} onChange={(e) => onSubIdChange(e.target.value)}>
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
        <Select value={topicId || ""} onChange={(e) => onTopicIdChange(Number(e.target.value))}>
          {topics.map((topic) => (
            <MenuItem key={topic.topicId} value={topic.topicId}>
              {topic.topicName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Select Question Type */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Select Question Type</InputLabel>
        <Select value={questionTypeId || ""} onChange={(e) => onQuestionTypeIdChange(Number(e.target.value))}>
          {questionTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Question Text */}
      <TextField fullWidth margin="dense" label="Question Text" value={questionText} onChange={(e) => onQuestionTextChange(e.target.value)} />

      {/* Marks */}
      <TextField fullWidth margin="dense" label="Marks" type="number" value={marks || ""} onChange={(e) => onMarksChange(Number(e.target.value))} />

      {/* Duration */}
      <TextField fullWidth margin="dense" label="Duration (mins)" type="number" value={durationInMins || ""} onChange={(e) => onDurationChange(Number(e.target.value))} />
    </>
  );
};

export default AddQuestionForm;
