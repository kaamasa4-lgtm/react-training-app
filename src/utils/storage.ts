import type { TrainingSession } from "../types";

const HISTORY_KEY = "training_history";

export const getHistory = (): TrainingSession[] => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
};

export const saveHistory = (newSession: TrainingSession) => {
    const history = getHistory();
    // 同じ日の記録があればマージする仕様にするか、追記するか。
    // 今回は単純に追記（1日に複数回トレーニングする場合も考慮して別エントリにするが、
    // UI側で日付ごとにまとめる処理が必要になるかもしれない。
    // 簡易的に「同日ならマージ」よりは「リストに追加」の方が安全。
    const updated = [...history, newSession];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const getHistoryByDate = (date: string): TrainingSession[] => {
    const history = getHistory();
    return history.filter((s) => s.date === date);
};

export const getTrainedDates = (): string[] => {
    const history = getHistory();
    const dates = new Set(history.map((s) => s.date));
    return Array.from(dates);
};
export const updateHistoryForDate = (date: string, updatedSessions: TrainingSession[]) => {
    const history = getHistory();
    // 指定した日付以外のデータを保持し、更新後のセッションを追加
    // updatedSessionsが空の場合はその日のデータが消えることになる（日付リストからも消える）
    const others = history.filter((s) => s.date !== date);

    // updatedSessionsが空配列なら、その日のセッションを全削除＝追加しない
    if (updatedSessions.length === 0) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(others));
        return;
    }

    const newHistory = [...others, ...updatedSessions];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
};
