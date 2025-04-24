import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Signup } from "./Pages/Signup"
import { Signin } from "./Pages/Signin"
import { SendMoney } from "./Pages/SendMoney"
import { Dashboard } from "./Pages/Dashboard"
import { Toaster } from 'react-hot-toast';
import { PublicRoute } from "./auth/PublicRoute"
import { PrivateRoute } from "./auth/PrivateRoute"



function App() {
  return <div >
    <Toaster position="top-center" />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/signin" element={<PublicRoute><Signin /></PublicRoute>} />
        <Route path="/send" element={<PrivateRoute><SendMoney /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  </div >
}

export default App

