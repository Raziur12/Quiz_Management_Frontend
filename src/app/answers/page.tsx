import React from "react";
import AnswerComponent from "./AnswerComponent";
import { Typography, Container } from "@mui/material";

export default function AnswerPage() {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>Answers</Typography>
            <AnswerComponent />
        </Container>
    );
}
