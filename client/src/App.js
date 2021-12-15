import "./App.css";
import { Route, Routes } from "react-router-dom";
import Auth from "./hoc/Auth";

import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import NavBar from "./components/views/NavBar/NavBar";
import Footer from "./components/views/Footer/Footer";
import { Suspense } from "react";
import VideoUploadPage from "./components/views/VideoUploadPage/VideoUploadPage";
import VideoDetailPage from "./components/views/VideoDetailPage/VideoDetailPage";

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NavBar />
            <div
                style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}
            >
                <Routes>
                    <Route path="/" element={Auth(LandingPage, null)} />
                    <Route path="/login" element={Auth(LoginPage, false)} />
                    <Route
                        path="/register"
                        element={Auth(RegisterPage, false)}
                    />
                    <Route
                        path="/video/upload"
                        element={Auth(VideoUploadPage, true)}
                    />
                    <Route
                        path="/video/:videoId"
                        element={Auth(VideoDetailPage, null)}
                    />
                </Routes>
            </div>
            <Footer />
        </Suspense>
    );
}

export default App;
