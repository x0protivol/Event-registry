import { Outlet, Link, useNavigation } from "react-router-dom";
import Header from "./Header/Header";

export default function Layout() {
  let navigation = useNavigation();

  return (
    <div>
      <div style={{ position: "fixed", top: 0, right: 0 }}>
        {navigation.state !== "idle" && <p>Navigation in progress...</p>}
      </div>

      <Header />

      <Outlet />
    </div>
  );
}
