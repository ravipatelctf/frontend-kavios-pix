// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import AlbumDetails from "./pages/AlbumDetails";

import { ToastContainer } from "react-toastify";
import ImageDetails from "./pages/ImageDetails";

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/albums/:albumId" element={<AlbumDetails />} />
        <Route path="/albums/:albumId/images/:imageId" element={<ImageDetails />}/>
      </Routes>
    </Router>
    <ToastContainer autoClose={3000} position="top-center" />
    </div>
  );
}
