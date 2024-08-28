import logo from "./logo.svg";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import AppLayout from "./pages/AppLayout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MyFollowingPost from "./pages/MyFollowingPost";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import CompleteProfile from "./components/GoogleLogin/CompleteProfile";


function RoutesComponent() {
  const { isAuthenticated } = useAuth()
  console.log(isAuthenticated);
  return (
    <BrowserRouter>

      <div className="App">
        <Routes>

          <Route path="/" element={isAuthenticated ? <AppLayout /> : <Navigate to="/signin" />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile/:username" element={<Profile />}></Route>
            <Route path="/following" element={<MyFollowingPost />}></Route>
          </Route>
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignUp />}></Route>
          <Route path="/signin" element={isAuthenticated ? <Navigate to="/" /> : <SignIn />}></Route>
          <Route path="/complete-profile" element={<CompleteProfile />}></Route>
        </Routes>

      </div>
    </BrowserRouter>
  )
}


function App() {
  console.log("I am app");
  const clientId = '123816639198-8rf1i31a7sb4l2fq428eee24gg1b378u.apps.googleusercontent.com';

  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <RoutesComponent></RoutesComponent>
      </GoogleOAuthProvider>
    </AuthProvider>


  );
}

export default App;










