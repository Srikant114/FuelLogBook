import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routes/AppRoutes";
import MainLayout from "./layouts/MainLayouts";

export default function App() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <Routes>
          {routes.map(({ path, component: Component }, i) => (
            <Route key={i} path={path} element={<Component />} />
          ))}
        </Routes>
      </Suspense>
    </MainLayout>
  );
}
