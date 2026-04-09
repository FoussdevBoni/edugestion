import { useEffect } from "react";
import { useLocation } from "react-router-dom"; // si tu es en React Router
// import { usePathname } from "next/navigation"; // si tu es en Next.js 13+

type Props = {
  children: React.ReactNode;
};

export default function ScrollToTop({ children }: Props) {
  // 👉 Version React Router
  const { pathname } = useLocation();

  // 👉 Version Next.js 13+, remplace la ligne au-dessus par :
  // const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]); // se déclenche à chaque changement de route

  return <>{children}</>;
}