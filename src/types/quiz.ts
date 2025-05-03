"use client";

export interface Subject {
    subId: string;
    subName: string;
}

export interface Topic {
    topicId: number;
    topicName: string;
}

export interface Question {
    id: number;
    text: string;
}

export interface Answer {
    answerId: number;
    answerText: string;
    isCorrect: boolean;
    questionId: number;
}

