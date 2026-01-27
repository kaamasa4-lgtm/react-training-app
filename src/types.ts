export type TrainingRecord = {
    id?: string;
    part: string;
    name: string;
    weight?: number;
    reps?: number;
    interval?: number;
};

export type TrainingSession = {
    date: string; // YYYY-MM-DD
    records: TrainingRecord[];
};
