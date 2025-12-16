import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Training } from "../data/trainings";
import { trainings as initialTrainings } from "../data/trainings";



const TrainingListPage = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [openPart, setOpenPart] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const stored = localStorage.getItem("trainings");

    if (stored) {
      setTrainings(JSON.parse(stored));
    } else {
      // ⭐ 初回だけ初期データを保存
      localStorage.setItem(
        "trainings",
        JSON.stringify(initialTrainings)
      );
      setTrainings(initialTrainings);
    }
  }, []);


  /* 削除処理 */
  const deleteTraining = (slug: string) => {
    if (!window.confirm("この種目を削除しますか？")) return;

    const updated = trainings.filter(t => t.slug !== slug);
    setTrainings(updated);
    localStorage.setItem("trainings", JSON.stringify(updated));
  };

  const parts = Array.from(new Set(trainings.map(t => t.part)));

  return (
    <div style={container}>
      <h2>トレーニング一覧</h2>

      <ul style={partList}>
        {parts.map(part => (
          <li key={part}>
            <div
              style={partRow}
              onClick={() => setOpenPart(openPart === part ? null : part)}
            >
              <span>{part}</span>
              <span>{openPart === part ? "▲" : "▼"}</span>
            </div>

            {openPart === part && (
              <ul style={trainingList}>
                {trainings
                  .filter(t => t.part === part)
                  .map(t => (
                    <li key={t.slug} style={trainingRow}>
                      <Link to={`/trainings/${t.slug}`} style={trainingLink}>
                        {t.name}
                      </Link>

                      <button
                        style={deleteButton}
                        onClick={() => deleteTraining(t.slug)}
                      >
                        削除
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div style={addButtonWrapper}>
        <button
          style={addButton}
          onClick={() => navigate("/trainings/add")}
        >
          ＋ 種目を追加
        </button>
      </div>
    </div>
  );
};

export default TrainingListPage;

/* ===== styles ===== */

const container: React.CSSProperties = {
  padding: "16px 12px 80px",
};

const partList: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
};

const partRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 8px",
  borderBottom: "1px solid #eee",
  cursor: "pointer",
};

const trainingList: React.CSSProperties = {
  listStyle: "none",
  paddingLeft: "12px",
};

const trainingRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 8px",
};

const trainingLink: React.CSSProperties = {
  textDecoration: "none",
  color: "#000",
};

const deleteButton: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: "1.1rem",
  cursor: "pointer",
};

const addButtonWrapper: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginTop: "24px",
};

const addButton: React.CSSProperties = {
  padding: "12px 24px",
  borderRadius: "24px",
  border: "none",
  background: "#4dabf7",
  color: "#fff",
};
