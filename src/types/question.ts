"use client";

export interface Question {
  questionId: number;
  questionText: string;
  subId: string;
  topicId: number;
  lessonId: number; 
  lessonName: string;
  marks: number;
  questionTypeId: number;
  durationInMins: number;
}
