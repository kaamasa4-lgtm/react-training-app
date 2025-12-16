import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Training } from "../data/trainings";

const TrainingDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState<Training | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("trainings");
    if (!stored) return;

    const list: Training[] = JSON.parse(stored);
    const found = list.find(t => t.slug === slug);
    setTraining(found || null);
  }, [slug]);

  if (!training) {
    return <p style={{ padding: "16px" }}>トレーニングが見つかりません</p>;
  }

  return (
    <div style={{ padding: "16px 12px 80px" }}>
      <h2>{training.name}</h2>

      <p><strong>部位：</strong>{training.part}</p>
      <p>{training.description}</p>

      {training.youtube && (
        <iframe
          width="100%"
          height="200"
          src={training.youtube.replace("watch?v=", "embed/")}
          allowFullScreen
          style={{ borderRadius: "12px", marginTop: "12px" }}
        />
      )}

      <button
        style={{
          marginTop: "24px",
          width: "100%",
          padding: "14px",
          borderRadius: "999px",
          border: "none",
          background: "#4dabf7",
          color: "#fff",
          fontSize: "1rem",
        }}
        onClick={() =>
          navigate("/play", {
            state: { training: training.name, part: training.part },
          })
        }
      >
        この種目でトレーニング開始
      </button>
    </div>
  );
};

export default TrainingDetailPage;
