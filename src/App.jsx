import { useLocation } from "react-router-dom";
import Layout from "./layouts/Layout";
import AppRoutes from "./router/AppRoutes";
import { Blank } from "./layouts/Blank";

function App() {
  const location = useLocation();

  const isAuthPath =
    location.pathname === "/" ||
    location.pathname.includes("login") ||
    location.pathname.includes("auth");

  const isLayoutPath =
    location.pathname.startsWith("/1") ||
    location.pathname.startsWith("/2") ||
    location.pathname.startsWith("/3") ||
    location.pathname.startsWith("/4") ||
    location.pathname.startsWith("/5") ||
    location.pathname.startsWith("/6") ||
    location.pathname.startsWith("/7") ||
    location.pathname.startsWith("/8") ||
    location.pathname.startsWith("/9") ||
    location.pathname.startsWith("/10") ||
    location.pathname.startsWith("/11") ||
    location.pathname.startsWith("/12") ||
    location.pathname.startsWith("/13") ||
    location.pathname.startsWith("/14");

  return (
    <>
      {isAuthPath || !isLayoutPath ? (
        <Blank>
          <AppRoutes />
        </Blank>
      ) : (
        <Layout>
          <AppRoutes />
        </Layout>
      )}
    </>
  );
}

export default App;
