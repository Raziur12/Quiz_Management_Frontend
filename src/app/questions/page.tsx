import QuestionList from "./QuestionList";
import { Typography, Container } from "@mui/material";

const QuestionsPage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>🎯 Questions</Typography>
      <QuestionList />
    </Container>
  );
};

export default QuestionsPage;
