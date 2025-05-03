"use client";

import axios from "axios";

export interface Question {
  questionId: number;
  questionText: string;
}

// export const fetchTopics = async () => {
//   try {
//     const response = await fetch("https://localhost:7285/api/Topic");
//     if (!response.ok) throw new Error("Failed to fetch topics");
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching topics:", error);
//     return null;
//   }
// };

export const addTopic = async (topicData: { topicName: string; subId: string }) => {
  try {
    const response = await fetch("https://localhost:7285/api/Topic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(topicData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding topic:", error);
  }
};

export const updateTopic = async (topicId: number, updatedData: { topicName: string; subId: string }) => {
  try {
    const response = await fetch(`https://localhost:7285/api/Topic/${topicId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating topic:", error);
  }
};

export const deleteTopic = async (topicId: number) => {
  try {
    const response = await fetch(`https://localhost:7285/api/Topic/${topicId}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting topic:", error);
    return false;
  }
};

export const fetchQuestionsTopic = async (
  subjectId: string,
  topicId: number,
  lessonId: number
): Promise<Question[]> => {
  try {
    const response = await fetch(
      `https://localhost:7285/api/Question/subject/${subjectId}/topic/${topicId}/lesson/${lessonId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();
    console.log("Fetched Questions:", data);

    return data?.$values ?? [];
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};




export const addQuestion = async (questionData: {
  questionText: string;
  subId: string;
  topicId: number;
  lessonId: number;
  marks: number;
  questionTypeId: number;
  durationInMins: number;
}[]) => {

  try {
    console.log("Sending data:", JSON.stringify(questionData));

    const response = await fetch("https://localhost:7285/api/Question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionData), // Array bhej rahe hain
    });

    const result = await response.json();
    console.log("API Response:", result);

    if (!response.ok) {
      console.error("Error response:", result);
    }
  } catch (error) {
    console.error("Error adding question:", error);
  }
};


export const updateQuestion = async (questionId: number, updatedData: {
  questionText: string;
  subId: string;
  topicId: number;
  marks: number;
  questionTypeId: number;
  durationInMins: number;
}) => {

  try {
    const response = await fetch(`https://localhost:7285/api/Question/${questionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating question:", error);
  }
};

export const deleteQuestion = async (questionId: number) => {
  try {
    const response = await fetch(`https://localhost:7285/api/Question/${questionId}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting question:", error);
    return false;
  }
};

export const fetchSubjects = async () => {
  try {
    const response = await fetch("https://localhost:7285/api/Subject");
    const data = await response.json(); // Parse JSON response
    console.log("Fetched Subjects:", data);
    return Array.isArray(data?.$values) ? data.$values : [];
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return []; // Return an empty array on error
  }
};

export const fetchTopics = async (subId: string) => {
  try {
    const response = await fetch(`https://localhost:7285/api/Topic/BySubject/${subId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch topics");
    }

    const data = await response.json();
    console.log("Fetched Topics:", data); // ✅ Add this for debugging
    // ✅ Ensure correct array extraction
    return Array.isArray(data) ? data : data?.$values || [];
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
};



export const fetchQuestions = async (topicId: number) => {
  const response = await fetch(`https://localhost:7285/api/Question?topicId=${topicId}`);
  return response.json();
};



export const fetchTopicsBySubjectId = async (subjectId: number) => {
  try {
    const response = await fetch(`https://localhost:7285/api/Topic?subjectId=${subjectId}`);
    if (!response.ok) throw new Error("Failed to fetch topics");
    return await response.json();
  } catch (error) {
    console.error("Error fetching topics:", error);
    return null;
  }
};

export const fetchQuestionTypes = async () => {
  try {
    const response = await fetch("https://localhost:7285/api/QuestionType");
    if (!response.ok) throw new Error("Failed to fetch question types");

    const data = await response.json();
    console.log("Fetched Question Types:", data);
    return data;
  } catch (error) {
    console.error("Error fetching question types:", error);
    return null;
  }
};

const API_URL = "https://localhost:7285/api/QuizModel";

export const fetchQuizzes = async () => {
  const response = await fetch(`${API_URL}`);
  if (!response.ok) {
    throw new Error("Error fetching quizzes");
  }

  const data = await response.json();
  console.log("Fetched quizzes:", data); // ✅ Debugging
  if (data?.$values) {
    return data.$values;
  }
  return [];
};

export const fetchQuizById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Error fetching quiz with ID ${id}`);
  }
  return response.json();
};

export const createQuiz = async (quizData: any) => {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quizData),
  });
  if (!response.ok) {
    throw new Error("Error creating quiz");
  }
  return response.json();
};

export const updateQuiz = async (id: number, quizData: any) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quizData),
  });
  if (!response.ok) {
    throw new Error(`Error updating quiz with ID ${id}`);
  }
  return response.json();
};

export const deleteQuiz = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error deleting quiz with ID ${id}`);
  }
};

const API_URLS = "https://localhost:7285/api/Lesson";

// ✅ Correct fetchLessons function
export const fetchLessons = async (topicId: number) => {
  const response = await fetch(`https://localhost:7285/api/Lesson?topicId=${topicId}`);
  if (!response.ok) {
    throw new Error("Error fetching lessons.");
  }
  return await response.json();
};


