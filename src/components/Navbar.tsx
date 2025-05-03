"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Preview
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"; // Quizzes
import AutoStoriesIcon from "@mui/icons-material/AutoStories"; // Subjects
import CategoryIcon from "@mui/icons-material/Category"; // Topics
import LayersIcon from "@mui/icons-material/Layers"; // SubTopic
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // Questions
import FactCheckIcon from "@mui/icons-material/FactCheck"; // Answers
import QuizIcon from "@mui/icons-material/Quiz"; // Preview Quiz
import HistoryEduIcon from "@mui/icons-material/HistoryEdu"; // Student Quiz Attempt
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Result Details

const drawerWidth = 240;

const menuItems = [
  { text: "QuizManagement", icon: <HomeIcon />, link: "/quizmanagement" },
  { text: "Preview", icon: <VisibilityIcon />, link: "/quizmanagement/preview" },
  { text: "Quizzes", icon: <AssignmentTurnedInIcon />, link: "/quizpage" },
  { text: "Subjects", icon: <AutoStoriesIcon />, link: "/subjects" },
  { text: "Topics", icon: <CategoryIcon />, link: "/topics" },
  { text: "SubTopic", icon: <LayersIcon />, link: "/subtopic" },
  { text: "Questions", icon: <HelpOutlineIcon />, link: "/questions" },
  { text: "Answers", icon: <FactCheckIcon />, link: "/answers" },
  { text: "PreviewQuiz", icon: <QuizIcon />, link: "/quizdetails" },
  { text: "StudentQuizAttempt", icon: <HistoryEduIcon />, link: "/quiz" },
  { text: "ResultDetails", icon: <EmojiEventsIcon />, link: "/result" },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <>
      <CssBaseline />
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background:
              "linear-gradient(to bottom, rgba(132, 160, 206, 0.9), rgba(166, 189, 124, 0.9))",
            backdropFilter: "blur(10px)",
            color: "#fff",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <Box
          sx={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            background: "rgba(15, 23, 42, 0.9)",
            color: "#fff",
            fontSize: "1.2rem",
            letterSpacing: "1px",
          }}
        >
          📚 Quiz Management
        </Box>

        <List>
          {menuItems.map((item, index) => (
            <Link href={item.link} key={index} passHref>
              <ListItem
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(104, 58, 28, 0.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          marginLeft: `${drawerWidth}px`,
          padding: 3,
          backgroundColor: "#F1F5F9",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </>
  );
}
