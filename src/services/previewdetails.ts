import axios from 'axios';

// Base URL for your API
const BASE_URL = 'https://localhost:7285/api';

// Fetch Subject by ID
export const fetchSubject = async (subjectId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/Subject/${subjectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching subject:', error);
        throw error;
    }
};

// Fetch Topics by Subject
export const fetchTopicsBySubject = async (subjectId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/Topic`);
        return response.data;
    } catch (error) {
        console.error('Error fetching topics:', error);
        throw error;
    }
};


// Fetch Lessons by Topic
export const fetchLessonsByTopic = async (topicId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/Lesson/GetLessonsByTopic/${topicId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lessons:', error);
        throw error;
    }
};

// Fetch Questions by Lesson
export const fetchQuestionsByLesson = async (subjectId: number, topicId: number, lessonId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/Question`);
        return response.data;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
};

// Fetch Answers by Question ID
export const fetchAnswers = async (questionId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/Answer/GetAnswersByQuestion/${questionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching answers:', error);
        throw error;
    }
};
