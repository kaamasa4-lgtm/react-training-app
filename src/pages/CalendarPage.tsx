import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CalendarPage = () => {
  // ===== state =====
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 仮：筋トレした日
  const [trainedDates] = useState<string[]>([
    "2025-12-01",
    "2025-12-05",
    "2025-12-10",
  ]);

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
    <div style={container}>
      {/* ヘッダー */}
      <div style={header}>
        <button
          style={navBtn}
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
        >
          ←
        </button>

        <div style={selectBox}>
          <select value={year} onChange={(e) => changeYear(Number(e.target.value))}>
            {Array.from({ length: 30 }).map((_, i) => {
              const y = 2010 + i;
              return (
                <option key={y} value={y}>
                  {y}年
                </option>
              );
            })}
          </select>

          <select value={month} onChange={(e) => changeMonth(Number(e.target.value))}>
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
                navigate("/detail", { state: { date: dateStr } });
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

const container: React.CSSProperties = {
  width: "100%",
  padding: "16px 12px 80px",
};

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "4px",
};

const selectBox: React.CSSProperties = {
  display: "flex",
  gap: "6px",
};

const navBtn: React.CSSProperties = {
  fontSize: "1.2rem",
  padding: "6px 8px",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  gap: "6px",
  marginTop: "12px",
};

const week: React.CSSProperties = {
  textAlign: "center",
  fontSize: "0.75rem",
};

const dayCell: React.CSSProperties = {
  width: "100%",
  minHeight: "44px",
  borderRadius: "10px",
  border: "none",
  fontSize: "0.9rem",
  padding: 0,
};

const dot: React.CSSProperties = {
  position: "absolute",
  bottom: "6px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: "#ff6b6b",
};
