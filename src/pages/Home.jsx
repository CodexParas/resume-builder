import React, { Suspense } from "react";
import { Header, HomeContainer, MainSpinner } from "../components";
import { Route, Routes } from "react-router-dom";
import {
  CreateResume,
  CreateTemplate,
  TemplateDesign,
  UserProfile,
} from "../pages";

const Home = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Header */}
      <Header />
      <main className="w-full">
        <Suspense fallback={<MainSpinner />}>
          <Routes>
            <Route path="/" element={<HomeContainer />} />
            <Route path="/template/create" element={<CreateTemplate />} />
            <Route path="/profile/:uid" element={<UserProfile />} />
            <Route path="/resume/*" element={<CreateResume />} />
            <Route
              path="/resume-detail/:templateID"
              element={<TemplateDesign />}
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default Home;
