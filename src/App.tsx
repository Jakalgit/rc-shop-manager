import React from "react";
import {AuthProvider, useAuth} from "./components/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {routes} from "./consts/routes.tsx";

const PrivateRouteWrapper: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { auth } = useAuth();
  return auth ? <>{element}</> : <Login />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {routes.map(({ path, component, isPrivate }) =>
            isPrivate ? (
              <Route key={path} path={path} element={<PrivateRouteWrapper element={component} />} />
            ) : (
              <Route key={path} path={path} element={component} />
            )
          )}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App