import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Authentication, Home } from "./pages";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/auth" element={<Authentication />} />
      </Routes>
    </Suspense>
  );
}

export default App;
