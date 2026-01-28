// PlayPage.tsx
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { trainings } from "../data/trainings";       // 値としての配列
import type { Training } from "../data/trainings";   // 型だけ
import React from "react";

export function useMediaQuery(query: string): boolean{
  const [matches, setMatches]=useState(false);

  useEffect(() =>{
    const media=window.matchMedia(query);
    if(media.matches !=matches){
      setMatches(media.matches);
    }
    const listener =() =>setMatches(media.matches);
    media.addEventListener("change", listener);
    return() => media.removeEventListener("change",listener);    
  },[matches, query]);
  return matches;
}

import type { TrainingRecord } from "../types";
import { saveHistory } from "../utils/storage";




const NumberStepper = ({
  value,
  onChange,
  step = 1,
  min = 0,
  label,
  suffix = "",
}: {
  value: number | "";
  onChange: (val: number) => void;
  step?: number;
  min?: number;
  label: string;
  suffix?: string;
}) => {
  const current = typeof value === "number" ? value : 0;

  const update = useCallback(
    (amount: number) => {
      const next = current + amount;
      if (next < min) return;
      onChange(next);
    },
    [current, min, onChange]
  );

  const minusProps = { onClick: () => update(-step) };
  const plusProps = { onClick: () => update(step) };

  return (
    <div style={stepperContainer}>
      <label style={stepperLabel}>{label}</label>

      {/* 縦並び（重量と同じ） */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        
        {/* 上：数値入力 */}
        <div style={stepperControls}>
          <div style={inputWrapper}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={value}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "");
                onChange(v === "" ? 0 : Number(v));
              }}
              style={stepperInput}
              placeholder="0"
            />
            <span style={stepperSuffix}>{suffix}</span>
          </div>
        </div>

        {/* 下：－＋ */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={subStepBtn} {...minusProps}>－</button>
          <button style={subStepBtn} {...plusProps}>＋</button>
        </div>

      </div>
    </div>
  );
};


const WeightStepper = ({
  value,
  onChange,
  label,
}: {
  value: number | "";
  onChange: (val: number) => void;
  label: string;
}) => {
  const current = typeof value === "number" ? value : 0;

  const update = useCallback((amount: number) => {
    const nextVal = current + amount;
    if (nextVal < 0) return;
    onChange(parseFloat(nextVal.toFixed(3)));
  }, [current, onChange]);
  const isMobile=useMediaQuery("(max-width: 600px)");

  return (
    <div style={stepperContainer}>
      <label style={stepperLabel}>{label}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Integer Control */}
        <div style={stepperControls}>

          <div style={inputWrapper}>
            <input
               type="number"
               inputMode="decimal"
               pattern="[0-9]*"
               value={value}
               onChange={(e) => onChange(Number(e.target.value))}
               style={stepperInput}
               placeholder="0"

            />
            <span style={stepperSuffix}>kg</span>      
          </div>

        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", padding: "0 4px" }}>
          <button
            style={isMobile ? subStepBtnMobile :subStepBtn}
            onClick={() => update(-0.25)}
          >
            -0.25
          </button>

          <button
            style={isMobile ? subStepBtnMobile :subStepBtn}
            onClick={() => update(0.25)}
          >
            +0.25
          </button>
        </div>
      </div>
    </div>
  );
};

const PlayPage = () => {
  const location = useLocation();
  const [trainingList, setTrainingList] = useState<Training[]>(trainings);
  const [part, setPart] = useState("");
  const [trainingName, setTrainingName] = useState("");
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [weight, setWeight] = useState<number | "">("");
  const [reps, setReps] = useState<number | "">("");
  const [interval, setInterval] = useState<number | "">("");
  const [records, setRecords] = useState<TrainingRecord[]>([]);

  // データロード時にIDがない場合は付与する (後方互換性)
  useEffect(() => {
    const storedRecords = localStorage.getItem("records");
    if (storedRecords) {
      const parsed = JSON.parse(storedRecords);
      // 旧データにIDがない場合の対策
      const migrated = parsed.map((r: any) => ({
        ...r,
        id: r.id || Math.random().toString(36).slice(2) + Date.now().toString(36)
      }));
      setRecords(migrated);
    }

    const storedTrainings = localStorage.getItem("trainings");
    if (storedTrainings) {
      setTrainingList(JSON.parse(storedTrainings));
    }

    // 遷移元からデータが渡されていればセット
    if (location.state) {
      const { part, trainingName } = location.state as { part: string, trainingName: string };
      if (part) setPart(part);
      if (trainingName) setTrainingName(trainingName);
    }
  }, [location.state]);

  useEffect(() => {
    const t = trainingList.find(t => t.name === trainingName) || null;
    setSelectedTraining(t);
  }, [trainingName, trainingList]);

const saveRecord = () => {
  if (!part || !trainingName) return alert("部位と種目を選んでください");
  if (weight === "" || reps === "") return alert("重量と回数を入力してください");

  const newRecord: TrainingRecord = {
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    part,
    name: trainingName,
    weight: Number(weight),
    reps: Number(reps),
  };

  setRecords(prev => {
    const updated = [...prev, newRecord];
    localStorage.setItem("records", JSON.stringify(updated));
    return updated;
  });

  setWeight("");
  setReps("");
};


  const addInterval = () => {
    if (!interval) return;
    const newRecord: TrainingRecord = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      part: "インターバル",
      name: "休憩",
      interval: Number(interval)
    };
    const updated = [...records, newRecord];
    setRecords(updated);
    localStorage.setItem("records", JSON.stringify(updated));
    setInterval("");
  };

  const deleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    localStorage.setItem("records", JSON.stringify(updated));
  };



  const parts = Array.from(new Set(trainingList.map(t => t.part)));

  // Grouping logic
  const groupKeys = Array.from(new Set(records.map(r => r.name)));

  return (
    <div>
      <h2 style={heading}>
        今日の記録（{new Date().toLocaleDateString("ja-JP")}）
      </h2>

      <div style={listWrapper}>
        {groupKeys.map((groupName) => {
          const groupRecords = records.filter(r => r.name === groupName);
          const firstRecord = groupRecords[0];

          return (
            <div key={groupName} style={groupCard}>
              <div style={groupHeader}>
                <span style={{ fontWeight: "bold", color: "var(--text-main)" }}>{firstRecord.part} / {groupName}</span>
              </div>
              <ul style={subList}>
                {groupRecords.map((r) => (
                  <li key={r.id} style={subItem}>
                    <div style={recordDetail}>
                      {r.weight !== undefined && r.reps !== undefined && (
                        <span>
                          <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--primary-color)" }}>{r.weight}</span>
                          <span style={{ fontSize: "0.9rem", color: "var(--text-sub)", margin: "0 2px" }}>kg</span>
                          <span style={{ margin: "0 4px", color: "var(--border-color)" }}>×</span>
                          <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--primary-color)" }}>{r.reps}</span>
                          <span style={{ fontSize: "0.9rem", color: "var(--text-sub)", margin: "0 2px" }}>回</span>
                        </span>
                      )}
                      {r.interval !== undefined && <span>休憩 {r.interval}秒</span>}
                    </div>
                    <button onClick={() => r.id && deleteRecord(r.id)} style={deleteButton}>✕</button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <h3 style={heading}>トレーニング入力</h3>
      <div style={card}>
        <div style={formRow}>
          <select
            value={part}
            onChange={(e) => { setPart(e.target.value); setTrainingName(""); }}
            style={selectInput}
          >
            <option value="">部位を選択</option>
            {parts.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {part && (
            <select
              value={trainingName}
              onChange={(e) => setTrainingName(e.target.value)}
              style={selectInput}
            >
              <option value="">種目を選択</option>
              {trainingList.filter(t => t.part === part).map(t => (
                <option key={t.slug} value={t.name}>{t.name}</option>
              ))}
            </select>
          )}
        </div>

        <div style={{ display: "flex", gap: "var(--spacing-md)", justifyContent: "center", margin: "var(--spacing-md) 0" }}>
          <WeightStepper
            label="重量"
            value={weight}
            onChange={setWeight}
          />

          <NumberStepper
            label="回数"
            value={reps}
            onChange={setReps}
            step={1}
            suffix="回"
          />
        </div>

        <button onClick={saveRecord} className="btn-primary">追加</button>
      </div>

      {selectedTraining && (
        <div style={infoCard}>
          <strong>説明:</strong> {selectedTraining.description}
          {selectedTraining.youtube && (
            <div style={{ marginTop: "8px" }}>
              <a href={selectedTraining.youtube} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                動画リンク
              </a>
            </div>
          )}
        </div>
      )}

      <h3 style={heading}>インターバル</h3>
      <div style={{ ...card, display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
        <select value={interval} onChange={(e) => setInterval(Number(e.target.value))} style={selectInput}>
          <option value="">選択してください</option>
          {[30, 60, 90, 120, 150, 180, 300, 600].map(sec => (
            <option key={sec} value={sec}>{sec}秒</option>
          ))}
        </select>
        <button onClick={addInterval} style={intervalButton}>休憩追加</button>
      </div>

      {/* トレーニング終了ボタン */}
      <div style={{ marginTop: "var(--spacing-xl)", textAlign: "center", marginBottom: "40px" }}>
        <button
          onClick={() => {
            if (records.length === 0) return alert("記録がありません");
            if (!window.confirm("トレーニングを終了して記録を保存しますか？")) return;

            const today = new Date();
            const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;


            saveHistory({ date, records });

            setRecords([]);
            localStorage.removeItem("records");
            alert("お疲れ様でした！記録を保存しました。");
          }}
          style={finishButton}
        >
          トレーニング終了
        </button>
      </div>
    </div>
  );
};

export default PlayPage;

/* ===== styles ===== */

const heading: React.CSSProperties = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  margin: "var(--spacing-lg) 0 var(--spacing-md) 0",
  color: "var(--text-sub)",
};

const listWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-md)",
};

const groupCard: React.CSSProperties = {
  backgroundColor: "var(--bg-card)",
  borderRadius: "var(--radius-md)",
  boxShadow: "var(--shadow-sm)",
  overflow: "hidden",
  marginBottom: "var(--spacing-md)",
};

const groupHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "var(--spacing-md)",
  borderBottom: "1px solid var(--border-color)",
  backgroundColor: "rgba(0,0,0,0.02)",
};



const subList: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const subItem: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "var(--spacing-md)",
  borderBottom: "1px solid var(--border-color)",
};

const recordDetail: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  marginTop: "4px",
};

const card: React.CSSProperties = {
  backgroundColor: "var(--bg-card)",
  padding: "var(--spacing-md)",
  borderRadius: "var(--radius-md)",
  boxShadow: "var(--shadow-sm)",
  marginBottom: "var(--spacing-md)",
};

const formRow: React.CSSProperties = {
  display: "flex",
  gap: "var(--spacing-sm)",
  marginBottom: "var(--spacing-md)",
};

const selectInput: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-color)",
  fontSize: "1rem",
  background: "var(--bg-main)",
  color: "var(--text-main)",
};

const intervalButton: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: "var(--radius-full)",
  border: "none",
  background: "var(--accent-color)",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "0.9rem",
  whiteSpace: "nowrap",
  boxShadow: "var(--shadow-sm)",
};

const infoCard: React.CSSProperties = {
  backgroundColor: "var(--primary-light)",
  padding: "var(--spacing-md)",
  borderRadius: "var(--radius-md)",
  marginBottom: "var(--spacing-md)",
  fontSize: "0.9rem",
  color: "var(--primary-color)",
};

const linkStyle: React.CSSProperties = {
  color: "var(--primary-color)",
  textDecoration: "underline",
  fontWeight: "bold",
};

const deleteButton: React.CSSProperties = {
  background: "#ffe3e3",
  color: "#fa5252",
  border: "none",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "1rem",
};

const finishButton: React.CSSProperties = {
  padding: "16px 48px",
  borderRadius: "var(--radius-full)",
  border: "none",
  background: "#fa5252", // 赤
  color: "#fff",
  fontSize: "1.2rem",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "var(--shadow-lg)",
  transform: "translateY(0)",
  transition: "all 0.2s",
};

// Stepper Styles (Use internal styles for consistency)
const stepperContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "var(--bg-card)",
  border: "1px solid var(--border-color)",
  borderRadius: "var(--radius-md)",
  padding: "var(--spacing-sm)",
  minWidth: "120px",
  flex: 1,
};

const stepperLabel: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "var(--text-sub)",
  marginBottom: "8px",
  letterSpacing: "0.05em",
};

const stepperControls: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  gap: "8px",
};



const inputWrapper: React.CSSProperties = {
  position: "relative",
  flex: 1,
};

const stepperInput: React.CSSProperties = {
  width: "100%",
  textAlign: "center",
  fontSize: "1.4rem",
  fontWeight: "800",
  border: "none",
  background: "transparent",
  outline: "none",
  paddingRight: "16px",
  color: "var(--text-main)",
  fontFamily: "var(--font-sans)",
};

const stepperSuffix: React.CSSProperties = {
  position: "absolute",
  right: "0",
  bottom: "4px",
  fontSize: "0.75rem",
  color: "var(--text-sub)",
  fontWeight: "normal",
  pointerEvents: "none",
};

const subStepBtn: React.CSSProperties = {
  flex: 1,
  height: "32px",
  borderRadius: "16px",
  border: "1px solid var(--border-color)",
  background: "var(--bg-main)",
  fontSize: "0.75rem",
  color: "var(--text-main)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const subStepBtnMobile: React.CSSProperties ={
  ...subStepBtn,
  width: "30px",
  height: "35px",
  fontSize: "12px",
};
