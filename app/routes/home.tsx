import type { Route } from "./+types/home";
import { Navbar } from "../../components/Navbar";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roomify - AI App" },
    { name: "description", content: "Roomify Is AI App" },
  ];
}

export default function Home() {
  return (
      <div>
        <Navbar />
      </div>
  )
}
