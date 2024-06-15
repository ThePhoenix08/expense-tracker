import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import TransactionPage from "./pages/TransactionPage";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";
import Header from "./components/Header";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";
import { Toaster } from "react-hot-toast";

function App() {
  const { data, loading } = useQuery(GET_AUTHENTICATED_USER);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route
          path="/"
          element={data?.authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!data?.authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/transaction/:id"
          element={
            data?.authUser ? <TransactionPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={!data?.authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

