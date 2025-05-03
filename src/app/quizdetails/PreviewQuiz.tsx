import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface PreviewQuizProps {
  quiz: any;
  topics: any[];
}

const PreviewQuiz: React.FC<PreviewQuizProps> = ({ quiz, topics }) => {
  console.log(topics);  // Log topics to see if answers are present

  return (
    <div>
      <Box padding={2} border={1} marginBottom={3}>
        <Typography variant="h6" gutterBottom>
          Quiz: {quiz.title || "N/A"}
        </Typography>
        <Typography variant="subtitle1">{quiz.subName || "N/A"}</Typography>
      </Box>

      {topics.map((topic, tIndex) => (
        <TableContainer component={Paper} key={topic.topicId} sx={{ marginTop: 3 }}>
          <Typography variant="h6" marginTop={2}>
            Topic: {topic.topicName}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question No.</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Answers</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topic.questions.map((question: any, index: number) => (
                <TableRow key={question.questionId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{question.questionText}</TableCell>
                  <TableCell>
                    {question.answers && question.answers.length > 0 ? (
                      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                        {question.answers.map((ans: any) => (
                          <li
                            key={ans.answerId}
                            style={{
                              color: ans.isCorrect ? "green" : "inherit",
                              fontWeight: ans.isCorrect ? "bold" : "normal",
                            }}
                          >
                            {ans.answerText}{" "}
                            {ans.isCorrect && <span style={{ color: "green" }}>(Correct)</span>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No answers"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </div>
  );
};

export default PreviewQuiz;
