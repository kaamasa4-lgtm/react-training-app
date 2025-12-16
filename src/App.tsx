import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";
import PlayPage from "./pages/PlayPage.tsx";
import TrainingListPage from "./pages/TrainingListPage";
import TrainingDetailPage from "./pages/TrainingDetailPage";
import TrainingAddPage from "./pages/TrainingAddPage";

const App = () => {
  return (
    <BrowserRouter>
      <div style={{ paddingBottom: "60px" }}>
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/trainings" element={<TrainingListPage />} />
          <Route path="/detail" element={<TrainingDetailPage />} />
          <Route path="/trainings/:slug" element={<TrainingDetailPage />} />
          <Route path="/trainings/add" element={<TrainingAddPage />} />

        </Routes>
      </div>

      {/* 下部ナビ */}
      <nav style={navStyle}>
        <NavLink to="/" style={linkStyle}>📅</NavLink>
        <NavLink to="/play" style={linkStyle}>▶</NavLink>
        <NavLink to="/trainings" style={linkStyle}>📚</NavLink>
      </nav>
    </BrowserRouter>
  );
};

const navStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  height: "60px",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  borderTop: "1px solid #ccc",
  background: "#fff",
};

const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  fontSize: "24px",
};

export default App;
