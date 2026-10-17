import { useEffect, useState } from "react";
import { sections } from "../data/navigation";

export default function useSectionNavigation() {
  const [active, setActive] = useState("overview");
  useEffect(() => {
    // React mounts after the browser's first anchor lookup on a shared link.
    const scrollToSection = () => {
      const id = window.location.hash.slice(1);
      if (id && !id.includes("/"))
        document
          .getElementById(id)
          ?.scrollIntoView?.({ behavior: "instant", block: "start" });
    };
    scrollToSection();
    window.addEventListener("hashchange", scrollToSection);
    return () => window.removeEventListener("hashchange", scrollToSection);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      {
        rootMargin: "-12% 0px -65% 0px",
      },
    );
    sections.forEach(([id]) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  return { active, setActive };
}
