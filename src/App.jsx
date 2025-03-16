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
    location.pathname.startsWith("/4");

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
