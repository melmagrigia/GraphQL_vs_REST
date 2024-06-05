import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavCustom } from "./components/NavCustom";
import { HomePage } from "./pages/HomePage";
import { PostPage } from "./pages/PostPage";
import { SubaperitivoPage } from "./pages/SubaperitivoPage";
import { UserPage } from "./pages/UserPage";
// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <div>
        <NavCustom />
        <main>
          <Routes>
            <Route path="/subaperitivo/:id" element={<SubaperitivoPage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/user/:id" element={<UserPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
