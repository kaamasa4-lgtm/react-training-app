import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { trainings } from "../data/trainings";
import type { Training } from "../data/trainings";

// YouTube URL から videoId を取り出す
const getYouTubeId = (url: string) => {
  const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
};

const TrainingDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [training, setTraining] = useState<Training | null>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    // ローカルストレージから取得（なければ初期データから）
    const stored = localStorage.getItem("trainings");
    const allTrainings: Training[] = stored ? JSON.parse(stored) : trainings;

    const found = allTrainings.find(t => t.slug === slug);
    setTraining(found || null);
  }, [slug]);

  if (!training) {
    return <p style={{ padding: "16px" }}>トレーニングが見つかりません</p>;
  }

  const videoId = training.youtube
    ? getYouTubeId(training.youtube)
    : null;

  return (
    <div style={{ padding: "16px 12px 80px" }}>
      <h2>{training.name}</h2>

      <p>
        <strong>部位：</strong>
        {training.part}
      </p>

      <p>{training.description}</p>

      {/* Debug Info (Troubleshooting) */}
      <div style={{ fontSize: "0.8rem", color: "#999", margin: "10px 0", background: "#f1f1f1", padding: "8px" }}>
        <strong>Debug:</strong><br />
        Raw URL: {training.youtube || "(none)"}<br />
        ID: {videoId || "(none)"}<br />
        Slug: {training.slug}
      </div>

      {/* YouTube（小さめ表示） */}
      {videoId && (
        <div
          style={{
            maxWidth: "320px",
            margin: "20px auto 24px",
          }}
        >
          {!play ? (
            <div
              onClick={() => setPlay(true)}
              style={{
                position: "relative",
                cursor: "pointer",
              }}
            >
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt="YouTube thumbnail"
                style={{
                  width: "100%",
                  borderRadius: "12px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: "50%",
                  width: "56px",
                  height: "56px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: "24px",
                    marginLeft: "3px",
                  }}
                >
                  ▶
                </span>
              </div>
            </div>
          ) : (
            <iframe
              width="100%"
              height="180"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                borderRadius: "12px",
                border: "none",
              }}
            />
          )}
        </div>
      )}

      {/* トレーニング開始ボタン */}
      <button
        style={{
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
            state: {
              trainingName: training.name,
              part: training.part,
            },
          })
        }
      >
        この種目でトレーニング開始
      </button>
    </div>
  );
};

export default TrainingDetailPage;
