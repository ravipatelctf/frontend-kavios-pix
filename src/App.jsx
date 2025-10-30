// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Albums";
import AlbumDetails from "./pages/AlbumDetails";

import { ToastContainer } from "react-toastify";
import ImageDetails from "./pages/ImageDetails";
import { FavoriteImages } from "./pages/FavoriteImages";
import { ImageManagement } from "./pages/ImageManagement";
import Albums from "./pages/Albums";

export default function App() {
  return (
    <div>
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <div className="container text-center">
              <h1>KaviosPix</h1>
              <p>Welcome to KaviosPix.</p>
            </div>
          }
        />
        <Route path="/albums" element={<Albums />} />
        <Route path="/albums/:albumId" element={<AlbumDetails />} />
        <Route path="/albums/:albumId/images/:imageId" element={<ImageDetails />}/>
        <Route path="/images" element={<ImageManagement />} />
        <Route path="/images/favorites" element={<FavoriteImages />} />
      </Routes>
    </Router>
    <ToastContainer autoClose={2000} position="top-center" />
    </div>
  );
}
