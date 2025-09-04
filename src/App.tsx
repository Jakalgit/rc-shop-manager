import React from "react";
import {AuthProvider, useAuth} from "./components/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import {PathEnum, routes} from "./consts/routes.tsx";
import MenuLayout from "./components/MenuLayout.tsx";

const PrivateRouteWrapper: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to={PathEnum.LOGIN} replace />;
  }

  return <>{element}</>;
}

function App() {


  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path={PathEnum.LOGIN} element={<Login />} />
          <Route path="*" element={<Navigate to={PathEnum.STATISTICS} replace />} />
          <Route element={<MenuLayout />}>
            {routes
              .filter((r) => r.path !== PathEnum.LOGIN)
              .map(({ path, component, isPublic }) =>
                !isPublic ? (
                  <Route key={path} path={path} element={<PrivateRouteWrapper element={component} />} />
                ) : (
                  <Route key={path} path={path} element={component} />
                )
              )}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App