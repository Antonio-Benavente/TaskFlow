import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import { Header } from "./components/Header/Header.jsx"
import { BoardsPage } from "./pages/BoardsPage/BoardsPage.jsx"
import { BoardPage } from "./pages/BoardPage/BoardPage.jsx"
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage.jsx"

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/boards" />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:boardId" element={<BoardPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  )
}
