const BASE_URL = "https://localhost:7285"; // ✅ Updated API URL

// Fetch Quizzes
export const fetchQuizzes = async () => {
  const response = await fetch(`${BASE_URL}/api/QuizModel`);
  if (!response.ok) throw new Error("Failed to fetch quizzes");
  return response.json();
};

// Fetch Topics
export const fetchTopics = async () => {
  const response = await fetch(`${BASE_URL}/api/Topic`);
  if (!response.ok) throw new Error("Failed to fetch topics");
  return response.json();
};

// Fetch Questions
export const fetchQuestions = async () => {
  const response = await fetch(`${BASE_URL}/api/Question`);
  if (!response.ok) throw new Error("Failed to fetch questions");
  return response.json();
};

// Fetch Answers by Question ID
export const fetchAnswers = async (questionId: number) => {
  const response = await fetch(
    `${BASE_URL}/api/Answer/GetAnswersByQuestion/${questionId}`
  );
  if (!response.ok)
    throw new Error(`Failed to fetch answers for question ID: ${questionId}`);
  return response.json();
};


