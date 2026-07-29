import React from "react";
import {AuthProvider, useAuth} from "./components/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import {PathEnum, routes, routesTg} from "./consts/routes.tsx";
import MenuLayout from "./components/MenuLayout.tsx";
import {useTelegram} from "./shared/hooks/useTelegram.ts";

const PrivateRouteWrapper: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to={PathEnum.LOGIN} replace />;
  }

  return <>{element}</>;
}

function App() {

  const tg = useTelegram();

  if (tg === null) {
    return <div>Загрузка...</div>; // или спиннер / splash-screen
  }

  const isTelegram = Boolean(tg?.initData);

  if (isTelegram) {
    return (
      <Router>
        <Routes>
          <Route>
            {routesTg
              .map(({ path, component }) =>
                <Route key={path} path={path} element={component}/>
              )}
          </Route>
        </Routes>
      </Router>
    )
  }

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