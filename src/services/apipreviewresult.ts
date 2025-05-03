// ✅ Fetch Subjects
export const fetchSubjects = async () => {
    try {
        const response = await fetch("https://localhost:7285/api/Subject");
        if (!response.ok) throw new Error("Failed to fetch subjects");
        const data = await response.json();
        console.log("Fetched Subjects:", data.$values); // ✅ Debugging
        return data.$values || [];
    } catch (error) {
        console.error("Error fetching subjects:", error);
        return [];
    }
};

// ✅ Fetch Topics
export const fetchTopics = async (subId: string) => {
    try {
        const response = await fetch(`https://localhost:7285/api/Topic/BySubject/${subId}`);
        if (!response.ok) throw new Error("Failed to fetch topics");
        const data = await response.json();
        console.log("Fetched Topics:", data.$values); // ✅ Debugging
        return Array.isArray(data.$values) ? data.$values : [];
    } catch (error) {
        console.error("Error fetching topics:", error);
        return [];
    }
};

// ✅ Fetch Lessons
export const fetchLessons = async (topicId: number) => {
    try {
        const response = await fetch(`https://localhost:7285/api/Lesson/GetLessonsByTopic/${topicId}`);
        if (!response.ok) throw new Error("Failed to fetch lessons");
        const data = await response.json();
        console.log("Fetched Lessons:", data.$values); // ✅ Debugging
        return data.$values || [];
    } catch (error) {
        console.error("Error fetching lessons:", error);
        return [];
    }
};

// ✅ Fetch Questions
export const fetchQuestions = async (subId: string, topicId: number, lessonId: number) => {
    const response = await fetch(
        `https://localhost:7285/api/Question/subject/${subId}/topic/${topicId}/lesson/${lessonId}`
    );
    const data = await response.json();
    console.log("Fetched Questions:", data.$values); // ✅ Debugging
    return data.$values || [];
};