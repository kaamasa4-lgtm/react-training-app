import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";
import PlayPage from "./pages/PlayPage.tsx";
import TrainingListPage from "./pages/TrainingListPage";
import TrainingDetailPage from "./pages/TrainingDetailPage";
import TrainingAddPage from "./pages/TrainingAddPage";
import HistoryPage from "./pages/HistoryPage";

const App = () => {
  return (
    <BrowserRouter>
      {/* メインコンテンツ */}
      {/* containerクラスはindex.cssで定義済み（max-width, padding等） */}
      <div className="container">
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/trainings" element={<TrainingListPage />} />
          <Route path="/detail" element={<TrainingDetailPage />} />
          <Route path="/trainings/:slug" element={<TrainingDetailPage />} />
          <Route path="/trainings/add" element={<TrainingAddPage />} />
          <Route path="/history/:date" element={<HistoryPage />} />
        </Routes>
      </div>

      {/* モダンな下部ナビゲーション */}
      <nav style={navStyle}>
        <NavLink to="/" style={({ isActive }) => navItemStyle(isActive)}>
          <CalendarIcon />
          <span style={labelStyle}>カレンダー</span>
        </NavLink>

        <NavLink to="/play" style={({ isActive }) => navItemStyle(isActive)}>
          <div style={playIconWrapper}>
            <PlayIcon />
          </div>
        </NavLink>

        <NavLink to="/trainings" style={({ isActive }) => navItemStyle(isActive)}>
          <ListIcon />
          <span style={labelStyle}>種目一覧</span>
        </NavLink>
      </nav>
    </BrowserRouter>
  );
};

// --- Icons (Simple Inline SVGs) ---
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const ListIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

// --- Styles with CSS Variables ---
const navStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  height: "70px",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  borderTop: "1px solid var(--border-color)",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  zIndex: 1000,
  paddingBottom: "env(safe-area-inset-bottom)", /*For iPhone X+*/
};

// アクティブ状態に応じたスタイルを返す関数
const navItemStyle = (isActive: boolean): React.CSSProperties => ({
  textDecoration: "none",
  color: isActive ? "var(--primary-color)" : "var(--text-sub)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.75rem",
  transition: "color 0.2s",
  width: "60px",
});

const labelStyle: React.CSSProperties = {
  marginTop: "4px",
  fontWeight: 500,
};

// 真ん中のPlayボタンだけ目立たせる
const playIconWrapper: React.CSSProperties = {
  width: "48px",
  height: "48px",
  background: "var(--primary-color)",
  color: "#fff",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "var(--shadow-md)",
  marginBottom: "20px", // 少し上に浮かせる
};

export default App;
