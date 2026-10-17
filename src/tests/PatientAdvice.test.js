import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import PatientAdvice from "../components/patients/PatientAdvice";
import { attachmentUrl, validateContent } from "../utils/patientContent";

const note = (id, category, title) => ({
  id,
  status: "published",
  category,
  updatedAt: "2026-10-17",
  tr: {
    title,
    summary: `${title} açıklaması`,
    body: [
      { type: "paragraph", text: "Paylaşılabilir hasta notu." },
      { type: "list", items: ["Birinci madde", "İkinci madde"] },
    ],
  },
  attachments: [],
});
const fixture = () => ({
  version: 1,
  categories: [
    { id: "thyroid", title: { tr: "Tiroid", en: "Thyroid" } },
    { id: "general", title: { tr: "Genel", en: "General" } },
  ],
  articles: [
    note("ilk-not", "thyroid", "Tiroid kontrolü"),
    note("diger-not", "general", "Genel bilgiler"),
    { ...note("taslak-not", "general", "Taslak içerik"), status: "draft" },
  ],
});
const respond = (data) => ({ ok: true, json: async () => data });
beforeEach(() => {
  window.history.replaceState(null, "", "/?lang=tr");
  global.fetch = jest.fn().mockResolvedValue(respond(fixture()));
});
afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

test("loads JSON at runtime, excludes drafts, filters by topic, and searches with Turkish characters", async () => {
  render(<PatientAdvice language="tr" />);
  expect(screen.getByRole("status")).toHaveTextContent("yükleniyor");
  await screen.findByRole("link", { name: "Tiroid kontrolü" });
  expect(fetch).toHaveBeenCalledWith(
    "/content/patient-tips.json",
    expect.objectContaining({ cache: "no-store", signal: expect.anything() }),
  );
  expect(screen.queryByText("Taslak içerik")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Tiroid" }));
  expect(
    screen.queryByRole("link", { name: "Genel bilgiler" }),
  ).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox", { name: "Önerilerde ara" }), {
    target: { value: "TIROID" },
  });
  expect(
    screen.getByRole("link", { name: "Tiroid kontrolü" }),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox", { name: "Önerilerde ara" }), {
    target: { value: "bulunmayan" },
  });
  expect(
    screen.getByRole("heading", { name: "Bu konuda henüz not bulunmuyor." }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Tüm notları göster" }));
  expect(
    screen.getByRole("link", { name: "Genel bilgiler" }),
  ).toBeInTheDocument();
});

test("opens a direct link, falls back to Turkish, and copies the article URL with its language", async () => {
  window.history.replaceState(null, "", "/?lang=en#patient-advice/ilk-not");
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: jest.fn().mockResolvedValue() },
  });
  render(<PatientAdvice language="en" />);
  await screen.findByRole("heading", { name: "Tiroid kontrolü" });
  expect(
    screen.getByText("This note is available in Turkish."),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Paylaşılabilir hasta notu.").closest("[lang]"),
  ).toHaveAttribute("lang", "tr");
  fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
  await screen.findByText("Link copied");
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
    expect.stringContaining("?lang=en#patient-advice/ilk-not"),
  );
  fireEvent.click(screen.getByRole("button", { name: "All recommendations" }));
  expect(window.location.hash).toBe("#patient-advice");
  expect(
    screen.getByRole("link", { name: "Tiroid kontrolü" }),
  ).toBeInTheDocument();
});

test("shows a recoverable error for invalid content, then loads a replaced JSON file on retry", async () => {
  fetch
    .mockResolvedValueOnce(respond({ invalid: true }))
    .mockResolvedValueOnce(respond(fixture()));
  render(<PatientAdvice language="tr" />);
  await screen.findByRole("alert");
  fireEvent.click(screen.getByRole("button", { name: "Tekrar dene" }));
  await screen.findByRole("link", { name: "Tiroid kontrolü" });
  expect(fetch).toHaveBeenCalledTimes(2);
});

test("handles a removed or unpublished direct link without revealing the draft", async () => {
  window.history.replaceState(null, "", "/#patient-advice/taslak-not");
  render(<PatientAdvice language="tr" />);
  await screen.findByRole("heading", { name: "Bu not bulunamadı." });
  expect(screen.queryByText("Taslak içerik")).not.toBeInTheDocument();
});

test("attachments stay inside the public content files directory and invalid data fails validation", () => {
  expect(attachmentUrl("files/bilgi.pdf")).toMatch(
    /\/content\/files\/bilgi\.pdf$/,
  );
  expect(attachmentUrl("files/../../private.txt")).toBeNull();
  expect(attachmentUrl("https://example.com/file.pdf")).toBeNull();
  const invalid = fixture();
  invalid.articles[0].updatedAt = "2026-02-31";
  expect(() => validateContent(invalid)).toThrow("Invalid article date");
});

test("navigating browser history updates the reader without a fresh content fetch", async () => {
  render(<PatientAdvice language="tr" />);
  fireEvent.click(await screen.findByRole("link", { name: "Tiroid kontrolü" }));
  expect(window.location.hash).toBe("#patient-advice/ilk-not");
  window.history.replaceState(null, "", "/#patient-advice/diger-not");
  fireEvent(window, new PopStateEvent("popstate"));
  await waitFor(() =>
    expect(
      screen.getByRole("heading", { name: "Genel bilgiler" }),
    ).toBeInTheDocument(),
  );
  expect(fetch).toHaveBeenCalledTimes(1);
});

test("all imported handouts validate in both languages and preserve measurement targets", () => {
  const imported = require("../../public/content/patient-tips.json");
  const checked = validateContent(imported);
  const expected = [
    "tiroid-nodulu",
    "hashimoto-tiroiditi",
    "graves-hastaligi",
    "gestasyonel-diyabet",
    "osteoporoz",
    "primer-hiperparatiroidi",
    "obezite",
    "pmos",
  ];
  for (const id of expected) {
    const article = checked.articles.find((item) => item.id === id);
    expect(article).toBeDefined();
    expect(article.en.body.length).toBe(article.tr.body.length);
    expect(article.sourceDocument).toMatch(/\.docx$/);
    // Timings, doses, and follow-up intervals must not change in translation.
    const numbers = (body) =>
      body.map((block) =>
        (JSON.stringify(block).match(/\d+(?:[.,]\d+)*/g) || [])
          .map((value) => value.replace(/[.,]/g, ""))
          .sort(),
      );
    expect(numbers(article.en.body)).toEqual(numbers(article.tr.body));
  }
  const pregnancy = checked.articles.find(
    (item) => item.id === "gestasyonel-diyabet",
  );
  expect(
    pregnancy.en.body.find((block) => block.type === "table").rows,
  ).toEqual([
    ["Fasting", "Below 95 mg/dL"],
    ["1 hour after a meal", "Below 140 mg/dL"],
    ["2 hours after a meal", "Below 120 mg/dL"],
  ]);
  const graves = checked.articles.find(
    (item) => item.id === "graves-hastaligi",
  );
  expect(JSON.stringify(graves.tr)).not.toContain("bir anda kesmeyin");
  expect(JSON.stringify(graves.en)).toContain("seek support to stop smoking");
});

test("renders the gestational diabetes targets as an accessible table", async () => {
  const imported = require("../../public/content/patient-tips.json");
  fetch.mockResolvedValue(respond(imported));
  window.history.replaceState(
    null,
    "",
    "/?lang=en#patient-advice/gestasyonel-diyabet",
  );
  render(<PatientAdvice language="en" />);
  expect(await screen.findByRole("table")).toBeInTheDocument();
  expect(
    screen.getByRole("columnheader", { name: "General target" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("cell", { name: "Below 95 mg/dL" }),
  ).toBeInTheDocument();
});
