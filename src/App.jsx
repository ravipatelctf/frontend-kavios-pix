// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { Header } from "./components/header/Header";
import AlbumDetails from "./pages/AlbumDetails";
import ImageDetails from "./pages/ImageDetails";
import { FavoriteImages } from "./pages/FavoriteImages";
import { ImageManagement } from "./pages/ImageManagement";
import Albums from "./pages/Albums";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <div>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/albums/:albumId" element={<AlbumDetails />} />
        <Route path="/images/:imageId" element={<ImageDetails />}/>
        <Route path="/images" element={<ImageManagement />} />
        <Route path="/images/favorites" element={<FavoriteImages />} />
      </Routes>
    </Router>
    <ToastContainer autoClose={2000} position="top-center" />
    </div>
  );
}
