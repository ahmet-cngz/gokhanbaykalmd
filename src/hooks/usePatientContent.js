import { useEffect, useState } from "react";
import { contentRoot, validateContent } from "../utils/patientContent";

export default function usePatientContent() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let current = true;
    setStatus("loading");

    async function loadContent() {
      try {
        const response = await fetch(`${contentRoot}patient-tips.json`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Content unavailable");
        const content = validateContent(await response.json());
        if (current) {
          setData(content);
          setStatus("ready");
        }
      } catch (error) {
        if (current && error.name !== "AbortError") setStatus("error");
      }
    }

    loadContent();
    return () => {
      current = false;
      controller.abort();
    };
  }, [attempt]);

  return { data, status, retry: () => setAttempt((value) => value + 1) };
}
