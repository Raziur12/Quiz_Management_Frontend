import SubjectList from "./SubjectList";
import { Typography, Container } from "@mui/material";

const SubjectsPage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom></Typography>
      <SubjectList />
    </Container>
  );
};

export default SubjectsPage;
