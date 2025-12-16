// PlayPage.tsx
import { useState, useEffect } from "react";
import { trainings } from "../data/trainings";       // 値としての配列
import type { Training } from "../data/trainings";   // 型だけ
import React from "react";


type Record = {
  part: string;
  name: string;
  weight?: number;
  reps?: number;
  interval?: number;
};

const PlayPage = () => {
  const [part, setPart] = useState("");
  const [trainingName, setTrainingName] = useState("");
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [weight, setWeight] = useState<number | "">("");
  const [reps, setReps] = useState<number | "">("");
  const [interval, setInterval] = useState<number | "">("");
  const [records, setRecords] = useState<Record[]>([]);
  const deleteRecord = (index: number) => {
  const updated = records.filter((_, i) => i !== index);
  setRecords(updated);
  localStorage.setItem("records", JSON.stringify(updated));
};


  useEffect(() => {
    const stored = localStorage.getItem("records");
    if (stored) setRecords(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const t = trainings.find(t => t.name === trainingName) || null;
    setSelectedTraining(t);
  }, [trainingName]);

  const saveRecord = () => {
    if (!part || !trainingName) return alert("部位と種目を選んでください");
    const newRecord: Record = {
      part,
      name: trainingName,
      weight: weight ? Number(weight) : undefined,
      reps: reps ? Number(reps) : undefined,
    };
    const updated = [...records, newRecord];
    setRecords(updated);
    localStorage.setItem("records", JSON.stringify(updated));
    setWeight("");
    setReps("");
  };

  const addInterval = () => {
    if (!interval) return;
    const newRecord: Record = { part: "インターバル", name: "休憩", interval: Number(interval) };
    const updated = [...records, newRecord];
    setRecords(updated);
    localStorage.setItem("records", JSON.stringify(updated));
    setInterval("");
  };

  const parts = Array.from(new Set(trainings.map(t => t.part)));

  return (
    <div style={container}>
      <h2 style={heading}>
  今日の記録（{new Date().toLocaleDateString("ja-JP")}）
</h2>

<ul style={recordList}>
  {records.map((r, i) => (
    <li key={i} style={recordCard}>
      <strong>{r.part}/{r.name}</strong>
      <div style={recordDetail}>
        {r.weight !== undefined && r.reps !== undefined && `${r.weight}kg × ${r.reps}rep`}
        {r.interval !== undefined && `${r.interval}秒`}
      </div>
      <button onClick={() => deleteRecord(i)} style={deleteButton}>削除</button>
    </li>
  ))}
</ul>


      <h3 style={sectionHeading}>トレーニング入力</h3>
      <div style={formRow}>
        <select
          value={part}
          onChange={(e) => { setPart(e.target.value); setTrainingName(""); }}
          style={selectStyle}
        >
          <option value="">部位を選択</option>
          {parts.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {part && (
          <select
            value={trainingName}
            onChange={(e) => setTrainingName(e.target.value)}
            style={selectStyle}
          >
            <option value="">種目を選択</option>
            {trainings.filter(t => t.part === part).map(t => (
              <option key={t.slug} value={t.name}>{t.name}</option>
            ))}
          </select>
        )}

<select
  value={weight}
  onChange={(e) => setWeight(Number(e.target.value))}
  style={selectStyle}
>
  <option value="">重量(kg)</option>
  {Array.from({ length: 200 }, (_, i) => i + 1).map(base => (
    <React.Fragment key={base}>
      <option value={base}>{base}kg</option>
      <option value={base + 0.5}>{base}.5kg</option>
    </React.Fragment>
  ))}
</select>


<select
  value={reps}
  onChange={(e) => setReps(Number(e.target.value))}
  style={selectStyle}
>
  <option value="">回数(reps)</option>
  {Array.from({ length: 100 }, (_, i) => i + 1).map(rep => (
    <option key={rep} value={rep}>{rep}回</option>
  ))}
</select>



        <button onClick={saveRecord} style={addButton}>追加</button>
      </div>

      {selectedTraining && (
        <div style={trainingInfo}>
          <strong>説明:</strong> {selectedTraining.description}
          {selectedTraining.youtube && (
            <div>
              <a href={selectedTraining.youtube} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                動画リンク
              </a>
            </div>
          )}
        </div>
      )}

      <h3 style={sectionHeading}>インターバル</h3>
      <div style={formRow}>
        <select value={interval} onChange={(e) => setInterval(Number(e.target.value))} style={selectStyle}>
          <option value="">選択してください</option>
          {[30, 60, 90, 120, 180, 300, 600].map(sec => (
            <option key={sec} value={sec}>{sec}秒</option>
          ))}
        </select>
        <button onClick={addInterval} style={intervalButton}>休憩追加</button>
      </div>
    </div>
  );
};

export default PlayPage;

/* ===== styles ===== */

const container: React.CSSProperties = {
  padding: "16px 12px 80px",
  fontFamily: "'Segoe UI', Roboto, sans-serif",
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
};

const heading: React.CSSProperties = {
  fontSize: "1.8rem",
  marginBottom: "12px",
};

const sectionHeading: React.CSSProperties = {
  fontSize: "1.4rem",
  margin: "20px 0 10px 0",
};

const recordList: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
};

const recordCard: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "12px 16px",
  borderRadius: "8px",
  marginBottom: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const recordDetail: React.CSSProperties = {
  marginTop: "4px",
  color: "#555",
};

const formRow: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginBottom: "12px",
  alignItems: "center",
};

const selectStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  minWidth: "120px",
};


const addButton: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: "24px",
  border: "none",
  backgroundColor: "#4dabf7",
  color: "#fff",
  cursor: "pointer",
};

const intervalButton: React.CSSProperties = {
  ...addButton,
  backgroundColor: "#ffa94d",
};

const trainingInfo: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "12px 16px",
  borderRadius: "8px",
  marginBottom: "12px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const linkStyle: React.CSSProperties = {
  color: "#4dabf7",
  textDecoration: "underline",
  marginTop: "4px",
  display: "inline-block",
};
const deleteButton: React.CSSProperties = {
  marginTop: "6px",
  padding: "4px 10px",
  borderRadius: "16px",
  border: "none",
  backgroundColor: "#e03131", // 赤色
  color: "#fff",
  cursor: "pointer",
  fontSize: "0.9rem",
};
