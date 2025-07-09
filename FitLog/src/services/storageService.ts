export interface GoalEntry {
  targetWeight: number;
  note?: string;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface TrainingEntry {
  exercise: string;
  description?: string;
  weight?: number;
  reps?: number;
  sets?: number;
  date: string;
}

export interface ActivityEntry {
  title: string;
  description?: string;
  date: string;
  selectedExercises?: string[];
}

const GOAL_KEY = "fitlog_goal";
const WEIGHT_LOGS_KEY = "fitlog_weight_logs";
const TRAINING_KEY = "fitlog_trainings";
const ACTIVITY_KEY = "fitlog_activities";

export class StorageService {
  static saveGoal(goal: GoalEntry): void {
    localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
  }

  static loadGoal(): GoalEntry | null {
    const json = localStorage.getItem(GOAL_KEY);
    return json ? JSON.parse(json) : null;
  }

  static addWeight(entry: WeightEntry): void {
    const logs = StorageService.loadWeights();
    if (logs.length === 0) {
      logs.push(entry);
    } else {
      const last = logs[logs.length - 1];
      if (last.weight !== entry.weight || last.date !== entry.date) {
        logs.push(entry);
      }
    }
    localStorage.setItem(WEIGHT_LOGS_KEY, JSON.stringify(logs));
  }

  static loadWeights(): WeightEntry[] {
    const json = localStorage.getItem(WEIGHT_LOGS_KEY);
    return json ? JSON.parse(json) : [];
  }

  static saveTraining(entry: TrainingEntry): void {
    const entries = StorageService.loadTrainings();
    entries.push(entry);
    localStorage.setItem(TRAINING_KEY, JSON.stringify(entries));
  }

  static updateTraining(index: number, entry: TrainingEntry): void {
    const entries = StorageService.loadTrainings();
    entries[index] = entry;
    localStorage.setItem(TRAINING_KEY, JSON.stringify(entries));
  }

  static deleteTraining(index: number): void {
    const entries = StorageService.loadTrainings();
    entries.splice(index, 1);
    localStorage.setItem(TRAINING_KEY, JSON.stringify(entries));
  }

  static loadTrainings(): TrainingEntry[] {
    const json = localStorage.getItem(TRAINING_KEY);
    return json ? JSON.parse(json) : [];
  }

  static saveActivity(entry: ActivityEntry): void {
    const entries = StorageService.loadActivities();
    entries.push(entry);
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(entries));
  }

  static updateActivity(index: number, entry: ActivityEntry): void {
    const entries = StorageService.loadActivities();
    entries[index] = entry;
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(entries));
  }

  static deleteActivity(index: number): void {
    const entries = StorageService.loadActivities();
    entries.splice(index, 1);
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(entries));
  }

  static loadActivities(): ActivityEntry[] {
    const json = localStorage.getItem(ACTIVITY_KEY);
    return json ? JSON.parse(json) : [];
  }
}
