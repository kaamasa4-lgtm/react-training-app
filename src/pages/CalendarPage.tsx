import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainedDates } from "../utils/storage";

const CalendarPage = () => {
  // ===== state =====
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [trainedDates, setTrainedDates] = useState<string[]>([]);

  useEffect(() => {
    setTrainedDates(getTrainedDates());
  }, []);

  const navigate = useNavigate();

  // ===== 日付計算 =====
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // ===== 年月変更 =====
  const changeYear = (y: number) => {
    setCurrentDate(new Date(y, month, 1));
  };

  const changeMonth = (m: number) => {
    setCurrentDate(new Date(year, m, 1));
  };

  // ===== JSX =====
  return (
    <div>
      {/* ヘッダー */}
      <div style={header}>
        <button
          style={navBtn}
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
        >
          ←
        </button>

        <div style={selectBox}>
          <select value={year} onChange={(e) => changeYear(Number(e.target.value))} style={selectStyle}>
            {Array.from({ length: 30 }).map((_, i) => {
              const y = 2010 + i;
              return (
                <option key={y} value={y}>
                  {y}年
                </option>
              );
            })}
          </select>

          <select value={month} onChange={(e) => changeMonth(Number(e.target.value))} style={selectStyle}>
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i}>
                {i + 1}月
              </option>
            ))}
          </select>
        </div>

        <button
          style={navBtn}
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
        >
          →
        </button>
      </div>

      {/* カレンダー */}
      <div style={grid}>
        {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
          <div key={d} style={week}>
            {d}
          </div>
        ))}

        {/* 空白 */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={i} />
        ))}

        {/* 日付 */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          const isSelected = selectedDate === dateStr;
          const isTrained = trainedDates.includes(dateStr);

          return (
            <button
              key={day}
              onClick={() => {
                setSelectedDate(dateStr);
                // 記録がある日なら履歴詳細へ
                if (isTrained) {
                  navigate(`/history/${dateStr}`);
                }
              }}
              style={{
                ...dayCell,
                background: isSelected
                  ? "#51cf66"
                  : isToday
                    ? "#4dabf7"
                    : "#f1f3f5",
                color: isSelected || isToday ? "#fff" : "#000",
                position: "relative",
              }}
            >
              {day}

              {/* トレーニング済みマーク */}
              {isTrained && <span style={dot} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPage;

/* ===== styles ===== */

/* ===== styles ===== */

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "var(--spacing-md)",
  padding: "var(--spacing-sm)",
  background: "var(--bg-card)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-sm)",
};

const selectBox: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
};

const selectStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  fontSize: "1.1rem",
  fontWeight: "bold",
  color: "var(--text-main)",
  cursor: "pointer",
  fontFamily: "inherit",
};

const navBtn: React.CSSProperties = {
  fontSize: "1.2rem",
  padding: "8px",
  background: "transparent",
  border: "none",
  color: "var(--primary-color)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "8px",
  marginTop: "var(--spacing-md)",
};

const week: React.CSSProperties = {
  textAlign: "center",
  fontSize: "0.8rem",
  fontWeight: "bold",
  marginBottom: "8px",
  color: "var(--text-sub)",
};

const dayCell: React.CSSProperties = {
  width: "100%",
  aspectRatio: "1/1",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  fontSize: "1rem",
  padding: 0,
  position: "relative",
  transition: "all 0.2s",
  cursor: "pointer",
  border: "none", // ensure default border is gone
};

const dot: React.CSSProperties = {
  position: "absolute",
  bottom: "4px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "5px",
  height: "5px",
  borderRadius: "50%",
  background: "var(--accent-color)",
};
