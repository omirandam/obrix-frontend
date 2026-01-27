import { useEffect } from "react";
import HomeModules from "./HomeModules";

export function HomePage() {
  useEffect(() => {
    document.title = "Obrix - Home";
  }, []);
  return <HomeModules />;
}
