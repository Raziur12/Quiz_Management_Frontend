import axios from "axios";

const API_URL = "https://localhost:7285/api/Lesson";

export const getLessons = async () => {
  const response = await axios.get(API_URL);
  return response.data.$values || [];
};

export const getLessonById = async (id: number) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createLesson = async (lessonData: any) => {
  const response = await axios.post(API_URL, lessonData);
  return response.data;
};

export const updateLesson = async (id: number, lessonData: any) => {
  const response = await axios.put(`${API_URL}/${id}`, lessonData);
  return response.data;
};

export const deleteLesson = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};

const TOPIC_API_URL = "https://localhost:7285/api/Topic";

// Get All Topics
export const getTopics = async () => {
  const response = await axios.get(TOPIC_API_URL);
  return response.data.$values || [];
};