import TopicList from "./TopicList";
import { Typography, Container } from "@mui/material";

const TopicsPage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>🎯 Topics</Typography>
      <TopicList />
    </Container>
  );
};

export default TopicsPage;
