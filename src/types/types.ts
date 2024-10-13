
export enum UserRole {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export enum StudentAccessType {
  INTERNAL = "INTERNAL",
  EXTERNAL = "EXTERNAL",
}

export enum ModuleType {
  CHAPTER = "CHAPTER",
  EXAM = "EXAM",
  ASSIGNMENT = "ASSIGNMENT",
  ATTACHMENT = "ATTACHMENT",
}

export enum AnswerType {
  MCQ = "MCQ",
  TRUE_FALSE = "TRUE_FALSE",
  SHORT_ANSWER = "SHORT_ANSWER",
}

// Interfaces corresponding to Prisma models

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  courses: Course[]; // Relation: CourseInstructor
  purchasedCourses: CoursesPurchased[];
}

export interface CoursesPurchased {
  id: string;
  userId: string;
  courseId: string;
  user: User;
  course: Course;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  isFree: boolean;
  accessibility?: AccessibilitySettings; // Optional relation
  objectives: string[];
  parts: Part[];
  modules: Module[];
  instructorId: string;
  instructor: User; // Relation: CourseInstructor
  purchasedCourses: CoursesPurchased[];
  groups: Group[];
}

export interface AccessibilitySettings {
  id: string;
  courseId: string;
  course: Course; // Relation: CourseAccessibility
  studentAccessType: StudentAccessType;
  academicStage: number; // 1, 2, 3, 4 for stages
  canAccessIfPurchased: boolean;
  groups: Group[]; // Relation: AccessibilityGroups
}

export interface Part {
  id: string;
  title: string;
  price: number;
  completionTime: number; // Ideal time to complete the part in hours
  openingDate: Date;
  courseId: string;
  course: Course;
  modules: Module[];
}

export interface Module {
  id: string;
  type: ModuleType;
  partId: string;
  part: Part;
  courseId: string;
  course: Course; // Relation: CourseModules
  lessons: Lesson[];
  questions: Question[];
  attachments: Attachment[];
  assignments: Assignment[]; // Relation: ModuleAssignments
  exams: Exam[]; // Relation: ModuleExams
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl?: string; // Optional, if video is present
  audioUrl?: string; // Optional, if audio is present
  moduleId: string;
  module: Module;
  isPromotional: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  questions: Question[];
  moduleId: string;
  module: Module; // Relation: ModuleAssignments
}

export interface Exam {
  id: string;
  title: string;
  questions: Question[];
  moduleId: string;
  module: Module; // Relation: ModuleExams
}

export interface Question {
  id: string;
  questionText: string;
  answerType: AnswerType;
  options: string[]; // Non-optional array of strings
  correctAnswer: string;
  assignmentId?: string;
  examId?: string;
  moduleId?: string;
  assignment?: Assignment;
  exam?: Exam;
  module?: Module;
}

export interface Attachment {
  id: string;
  fileType: string;
  fileUrl: string;
  description: string;
  moduleId: string;
  module: Module;
}

export interface Group {
  id: string;
  title: string;
  courses: Course[]; // Relation: GroupCourse
  accessibilitySettings: AccessibilitySettings[]; // Relation: AccessibilityGroups
}
