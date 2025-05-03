"use client";

export const fetchSubjects = async () => {
  try {
    const response = await fetch("https://localhost:7285/api/Subject");
    if (!response.ok) {
      throw new Error("Failed to fetch subjects");
    }
    const data = await response.json();
    return data?.$values || [];
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
};

export const fetchTopicsBySubjectId = async (subId: string) => {
  try {
    const response = await fetch(`https://localhost:7285/api/Topic/BySubject/${subId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch topics");
    }
    const data = await response.json();
    return data?.$values || [];
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
};

export const fetchQuestions = async (subjectId: string, topicId: number) => {
  try {
    const response = await fetch(
      `https://localhost:7285/api/Question?subjectId=${subjectId}&topicId=${topicId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    const data = await response.json();
    return data?.$values || [];
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};
