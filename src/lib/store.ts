// Simple app state management with localStorage
export interface Skill {
  id: string;
  name: string;
  category: string;
  confirmed: boolean;
  readiness: 'not-assessed' | 'resume-ready' | 'needs-revision' | 'not-ready';
  confidenceRatings: number[];
  questionsAnswered: number;
  totalQuestions: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  skills: string[];
  confirmed: boolean;
}

export interface AppState {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
  resumeUploaded: boolean;
  resumeFileName: string;
  skills: Skill[];
  projects: Project[];
  currentStep: 'upload' | 'review' | 'practice' | 'dashboard';
}

const DEFAULT_STATE: AppState = {
  isAuthenticated: false,
  user: null,
  resumeUploaded: false,
  resumeFileName: '',
  skills: [],
  projects: [],
  currentStep: 'upload',
};

export function getState(): AppState {
  try {
    const stored = localStorage.getItem('resume-prep-state');
    return stored ? { ...DEFAULT_STATE, ...JSON.parse(stored) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export function setState(partial: Partial<AppState>) {
  const current = getState();
  const next = { ...current, ...partial };
  localStorage.setItem('resume-prep-state', JSON.stringify(next));
  return next;
}

export function clearState() {
  localStorage.removeItem('resume-prep-state');
}

// Mock data for demo
export const MOCK_SKILLS: Skill[] = [
  { id: '1', name: 'React.js', category: 'Frontend', confirmed: true, readiness: 'resume-ready', confidenceRatings: [4, 5, 4], questionsAnswered: 3, totalQuestions: 5 },
  { id: '2', name: 'TypeScript', category: 'Language', confirmed: true, readiness: 'resume-ready', confidenceRatings: [5, 4, 5], questionsAnswered: 3, totalQuestions: 5 },
  { id: '3', name: 'Node.js', category: 'Backend', confirmed: true, readiness: 'needs-revision', confidenceRatings: [3, 2, 3], questionsAnswered: 3, totalQuestions: 5 },
  { id: '4', name: 'PostgreSQL', category: 'Database', confirmed: true, readiness: 'not-ready', confidenceRatings: [2, 1], questionsAnswered: 2, totalQuestions: 5 },
  { id: '5', name: 'Docker', category: 'DevOps', confirmed: true, readiness: 'needs-revision', confidenceRatings: [3, 3, 2], questionsAnswered: 3, totalQuestions: 5 },
  { id: '6', name: 'Python', category: 'Language', confirmed: true, readiness: 'not-assessed', confidenceRatings: [], questionsAnswered: 0, totalQuestions: 5 },
  { id: '7', name: 'REST APIs', category: 'Backend', confirmed: true, readiness: 'resume-ready', confidenceRatings: [4, 4, 5], questionsAnswered: 3, totalQuestions: 5 },
  { id: '8', name: 'Git', category: 'Tools', confirmed: true, readiness: 'resume-ready', confidenceRatings: [5, 5], questionsAnswered: 2, totalQuestions: 5 },
];

export const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'E-commerce Platform', description: 'Full-stack online store with payment integration', skills: ['React.js', 'Node.js', 'PostgreSQL'], confirmed: true },
  { id: '2', name: 'Task Management App', description: 'Real-time collaborative task board', skills: ['React.js', 'TypeScript', 'REST APIs'], confirmed: true },
  { id: '3', name: 'CI/CD Pipeline', description: 'Automated deployment pipeline for microservices', skills: ['Docker', 'Python', 'Git'], confirmed: true },
];

export interface InterviewQuestion {
  id: string;
  skillId: string;
  question: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  hint: string;
}

export const MOCK_QUESTIONS: Record<string, InterviewQuestion[]> = {
  '1': [
    { id: 'q1', skillId: '1', question: "Can you explain how React's virtual DOM works and why it improves performance?", difficulty: 'basic', hint: 'Think about how React compares the previous and next state of the DOM tree.' },
    { id: 'q2', skillId: '1', question: "Walk me through how you'd manage complex state in a React application. What patterns have you used?", difficulty: 'intermediate', hint: 'Consider Context API, Redux, Zustand, or custom hooks.' },
    { id: 'q3', skillId: '1', question: "How would you optimize a React component that re-renders too frequently?", difficulty: 'advanced', hint: 'Think about React.memo, useMemo, useCallback, and component structure.' },
  ],
  '3': [
    { id: 'q4', skillId: '3', question: "What is the event loop in Node.js and how does it handle asynchronous operations?", difficulty: 'basic', hint: 'Think about the call stack, callback queue, and how Node handles I/O.' },
    { id: 'q5', skillId: '3', question: "How would you handle error management in a Node.js REST API?", difficulty: 'intermediate', hint: 'Consider middleware, try-catch patterns, and centralized error handling.' },
    { id: 'q6', skillId: '3', question: "Explain how you'd design a Node.js application that needs to handle 10,000 concurrent connections.", difficulty: 'advanced', hint: 'Think about clustering, load balancing, and connection pooling.' },
  ],
  '4': [
    { id: 'q7', skillId: '4', question: "What's the difference between a JOIN and a subquery? When would you use each?", difficulty: 'basic', hint: 'Consider readability and performance trade-offs.' },
    { id: 'q8', skillId: '4', question: "How would you optimize a slow database query?", difficulty: 'intermediate', hint: 'Think about indexes, EXPLAIN ANALYZE, and query structure.' },
  ],
};
