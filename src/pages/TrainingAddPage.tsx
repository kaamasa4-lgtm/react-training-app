import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Training } from "../data/trainings";

const TrainingAddPage = () => {
  const navigate = useNavigate();

  const [part, setPart] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [youtube, setYoutube] = useState("");

  const save = () => {
    if (!part || !name) {
      alert("部位と種目名は必須です");
      return;
    }

    const stored: Training[] = JSON.parse(
      localStorage.getItem("trainings") || "[]"
    );

    let slug = name.toLowerCase().replace(/\s+/g, "-");

    let counter = 1;
    const originalSlug = slug;
    while (stored.some(t => t.slug === slug)) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    const newTraining: Training = {
      slug,
      part,
      name,
      description,
      youtube: youtube || undefined,
    };

    stored.push(newTraining);
    localStorage.setItem("trainings", JSON.stringify(stored));

    navigate("/trainings");
  };

  return (
    <div style={container}>
      <h2 style={title}>種目追加</h2>

      <div style={form}>
        <label style={label}>部位</label>
        <select
          name="training-part"
          value={part}
          onChange={(e) => setPart(e.target.value)}
          style={input}
        >
          <option value="">選択してください</option>
          <option value="胸">胸</option>
          <option value="背中">背中</option>
          <option value="脚">脚</option>
          <option value="肩">肩</option>
          <option value="腕">腕</option>
        </select>

        <label style={label}>種目名</label>
        <input
          name="training-name"
          placeholder="例：ベンチプレス"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
          autoComplete="off"
        />

        <label style={label}>説明</label>
        <textarea
          name="training-desc"
          placeholder="フォームやポイント"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={textarea}
          autoComplete="off"
        />

        <label style={label}>YouTube（任意）</label>
        <input
          name="training-youtube-url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
          style={input}
          autoComplete="off"
          list="autocompleteOff" // Hack to further discourage Chrome autofill
        />

        {/* ボタンは YouTube のすぐ下 */}
        <button style={saveButton} onClick={save}>
          保存する
        </button>
      </div>
    </div>
  );
};

export default TrainingAddPage;

/* ===== styles ===== */

const container: React.CSSProperties = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "16px 12px",
};

const title: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "16px",
};

const form: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const label: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#555",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const textarea: React.CSSProperties = {
  width: "100%",
  minHeight: "100px",
  padding: "12px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  resize: "vertical",
};

const saveButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  fontSize: "1.1rem",
  borderRadius: "999px",
  border: "none",
  background: "#4dabf7",
  color: "#fff",
  marginTop: "16px",
};
