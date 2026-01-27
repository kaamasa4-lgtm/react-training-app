import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getHistoryByDate, updateHistoryForDate } from "../utils/storage";
import type { TrainingSession } from "../types";

const HistoryPage = () => {
    const { date } = useParams<{ date: string }>();
    const [sessions, setSessions] = useState<TrainingSession[]>([]);

    useEffect(() => {
        if (date) {
            setSessions(getHistoryByDate(date));
        }
    }, [date]);

    if (!date) {
        return <Navigate to="/" />;
    }

    // 合計ボリューム計算（重量×回数）
    let totalVolume = 0;
    sessions.forEach((s) => {
        s.records.forEach((r) => {
            if (r.weight && r.reps) {
                totalVolume += r.weight * r.reps;
            }
        });
    });

    const handleDelete = (sessionIndex: number, recordIndex: number) => {
        if (!window.confirm("この記録を削除しますか？")) return;

        const newSessions = [...sessions];
        const session = newSessions[sessionIndex];

        // 指定したレコードを削除
        session.records.splice(recordIndex, 1);

        // レコードがなくなったセッションは削除
        if (session.records.length === 0) {
            newSessions.splice(sessionIndex, 1);
        }

        setSessions(newSessions);
        updateHistoryForDate(date, newSessions);
    };

    if (sessions.length === 0) {
        return (
            <div>
                <h2 style={{ marginBottom: "var(--spacing-md)" }}>{date} の記録</h2>
                <div style={emptyState}>
                    記録はありません。
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ marginBottom: "var(--spacing-md)" }}>{date} の記録</h2>

            <div style={summaryCard}>
                <span style={{ fontSize: "0.9rem", color: "var(--text-sub)" }}>総負荷量</span>
                <strong style={{ fontSize: "1.5rem", color: "var(--primary-color)" }}>{totalVolume} kg</strong>
            </div>

            {sessions.map((session, sIndex) => (
                <div key={sIndex} style={sessionBlock}>
                    {session.records.map((r, rIndex) => (
                        <div key={rIndex} style={row}>
                            <span style={partBadge}>{r.part}</span>
                            <div style={{ flex: 1 }}>
                                <span style={name}>{r.name}</span>
                                <div style={detail}>
                                    {r.weight && r.reps ? (
                                        <span>
                                            <span style={{ fontWeight: "bold" }}>{r.weight}</span>kg × <span style={{ fontWeight: "bold" }}>{r.reps}</span>回
                                        </span>
                                    ) : r.interval ? (
                                        <span>休憩 {r.interval}秒</span>
                                    ) : (
                                        <span>-</span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(sIndex, rIndex)}
                                style={deleteButton}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default HistoryPage;

/* ===== styles ===== */

const emptyState: React.CSSProperties = {
    textAlign: "center",
    color: "var(--text-sub)",
    marginTop: "var(--spacing-xl)",
};

const summaryCard: React.CSSProperties = {
    background: "var(--primary-light)",
    padding: "var(--spacing-md)",
    borderRadius: "var(--radius-md)",
    marginBottom: "var(--spacing-md)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

const sessionBlock: React.CSSProperties = {
    background: "var(--bg-card)",
    borderRadius: "var(--radius-md)",
    padding: "var(--spacing-md)",
    marginBottom: "var(--spacing-md)",
    boxShadow: "var(--shadow-sm)",
};

const row: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "var(--spacing-sm) 0",
    borderBottom: "1px solid var(--border-color)",
};

const partBadge: React.CSSProperties = {
    background: "var(--bg-main)",
    color: "var(--text-sub)",
    fontSize: "0.75rem",
    padding: "4px 8px",
    borderRadius: "var(--radius-sm)",
    marginRight: "var(--spacing-md)",
    minWidth: "48px",
    textAlign: "center",
    alignSelf: "flex-start",
    marginTop: "4px",
};

const name: React.CSSProperties = {
    display: "block",
    fontWeight: "600",
    marginBottom: "2px",
    color: "var(--text-main)",
};

const detail: React.CSSProperties = {
    color: "var(--text-sub)",
    fontSize: "0.9rem",
};

const deleteButton: React.CSSProperties = {
    background: "#ffe3e3",
    color: "#fa5252",
    border: "none",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "0.8rem",
    marginLeft: "var(--spacing-md)",
};
