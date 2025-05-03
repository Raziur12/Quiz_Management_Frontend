"use client";

import axios from "axios";

const API_BASE_URL = "https://localhost:7285/api/Answer"; // Backend API URL

export interface Answer {
  answerId: number;
  answerText: string;
  isCorrect: boolean;
  questionId: number;
}

export interface Topic {
  topicId: number;
  topicName: string;
}

export interface Subject {
  subId: number;
  subName: string;
}

// ✅ Fetch answers by Question ID
export const fetchAnswers = async (questionId: number): Promise<Answer[]> => {
  const response = await fetch(`${API_BASE_URL}/GetAnswersByQuestion/${questionId}`);
  const data = await response.json();

  return data.$values || []; // ✅ Ensure it always returns an array
};

// ✅ Add new answer
export const addAnswer = async (answer: Omit<Answer, "answerId">): Promise<Answer> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([answer]), // ✅ Wrap answer in an array
    });

    if (!response.ok) {
      throw new Error("Failed to add answer");
    }

    const data = await response.json();
    console.log("Added Answer Response:", data); // Debugging for API response

    // ✅ Check if the response has $values and it's not empty
    if (!data || !data.$values || data.$values.length === 0 || !data.$values[0].answerId) {
      throw new Error("Invalid response: Missing answerId");
    }

    // ✅ Extract the first item from $values
    const addedAnswer = data.$values[0];

    return addedAnswer;
  } catch (error) {
    console.error("Error adding answer:", error);
    throw error;
  }
};

// ✅ Update answer
export const updateAnswer = async (answer: Answer) => {
  await axios.put(`${API_BASE_URL}/${answer.answerId}`, answer);
};

// ✅ Delete answer
export const deleteAnswer = async (answerId: number) => {
  await axios.delete(`${API_BASE_URL}/${answerId}`);
};


export interface Question {
  questionId: number;
  questionText: string;
  subId: string;
  topicId: number;
  lessonId: number;
  marks: number;
  questionTypeId: number;
  durationInMins: number;
}

// ✅ Fetch questions (utility to get related questions)
export const fetchQuestions = async (
  subId: string,
  topicId: number,
  lessonId: number
): Promise<Question[]> => {
  try {
    const response = await fetch(
      `https://localhost:7285/api/Question/subject/${subId}/topic/${topicId}/lesson/${lessonId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();
    console.log("Fetched Questions:", data); // ✅ Debugging
    return data?.$values ?? [];
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};


// Define Lesson type
export interface Lesson {
  lessonId: number;
  topicId: number;
  lessonName: string;
  description: string;
  topicName: string;
  isActive: boolean;
  createdAt: string;
}

// ✅ Fetch Lessons by Topic
export const fetchLessons = async (topicId: number): Promise<Lesson[]> => {
  try {
    const response = await fetch(
      `https://localhost:7285/api/Lesson/GetLessonsByTopic/${topicId}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching lessons: ${response.statusText}`);
    }
    const data = await response.json();
    return data.$values || [];
  } catch (error) {
    console.error("Error loading lessons:", error);
    return [];
  }
};
