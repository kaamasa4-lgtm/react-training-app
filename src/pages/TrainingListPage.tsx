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
    <div>
      <h2 style={{ marginBottom: "var(--spacing-md)" }}>トレーニング一覧</h2>

      <div style={listContainer}>
        {parts.map((part) => (
          <div key={part} style={card}>
            <div
              style={partHeader}
              onClick={() => setOpenPart(openPart === part ? null : part)}
            >
              <span style={partTitle}>{part}</span>
              <span style={{ transform: openPart === part ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                ▼
              </span>
            </div>

            {openPart === part && (
              <ul style={trainingList}>
                {trainings
                  .filter((t) => t.part === part)
                  .map((t) => (
                    <li key={t.slug} style={trainingRow}>
                      <Link to={`/trainings/${t.slug}`} style={trainingLink}>
                        {t.name}
                      </Link>

                      <button
                        style={deleteButton}
                        onClick={() => deleteTraining(t.slug)}
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div style={addButtonWrapper}>
        <button
          className="btn-primary" // use global class
          onClick={() => navigate("/trainings/add")}
          style={{ maxWidth: "200px" }}
        >
          ＋ 種目を追加
        </button>
      </div>
    </div >
  );
};

export default TrainingListPage;

/* ===== styles ===== */

const listContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-sm)",
};

const card: React.CSSProperties = {
  background: "var(--bg-card)",
  borderRadius: "var(--radius-md)",
  boxShadow: "var(--shadow-sm)",
  overflow: "hidden",
};

const partHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "var(--spacing-md)",
  cursor: "pointer",
  background: "var(--bg-card)",
  transition: "background 0.2s",
};

const partTitle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "1.1rem",
};

const trainingList: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  borderTop: "1px solid var(--border-color)",
};

const trainingRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px var(--spacing-md)",
  borderBottom: "1px solid var(--border-color)",
};

const trainingLink: React.CSSProperties = {
  textDecoration: "none",
  color: "var(--text-main)",
  fontSize: "1rem",
  flex: 1,
};

const deleteButton: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: "1.2rem",
  cursor: "pointer",
  padding: "4px 8px",
  opacity: 0.6,
  transition: "opacity 0.2s",
};

const addButtonWrapper: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginTop: "var(--spacing-lg)",
};
