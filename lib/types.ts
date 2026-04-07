export interface Task {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number; // user's estimate
  realisticMinutes: number; // AI-calculated
  worthIt: boolean;
  verdict: string; // AI explanation
  gain: string; // what you get from it
  addedAt: string;
}

export interface ReconResult {
  worthIt: boolean;
  verdict: string;
  realisticMinutes: number;
  reasoning: string;
  hiddenSteps: string[];
}
