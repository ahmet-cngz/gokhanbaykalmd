import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  localStorage.clear();
  global.fetch = jest.fn(() => new Promise(() => {}));
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }));
});
afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

test("switches the full profile while preserving filters and original academic references", () => {
  render(<App />);
  fireEvent.change(
    screen.getByRole("textbox", { name: "Search publications" }),
    { target: { value: "aldosterone" } },
  );
  fireEvent.change(screen.getByRole("combobox", { name: "Publication year" }), {
    target: { value: "2026" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Türkçe" }));
  expect(document.documentElement.lang).toBe("tr");
  expect(document.title).toContain("Akademik Profil");
  expect(
    screen.getByRole("heading", { name: "Deneyim ve eğitim" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Üyelikler ve diller" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: "Yayınlarda ara" })).toHaveValue(
    "aldosterone",
  );
  expect(screen.getByRole("combobox", { name: "Yayın yılı" })).toHaveValue(
    "2026",
  );
  expect(
    screen.getByText("1 yayından 1 kayıt gösteriliyor"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", {
      name: /Evaluating 24-h Urine Aldosterone Levels/,
    }),
  ).toHaveAttribute("href", "https://doi.org/10.3390/jcm15124503");
  expect(localStorage.getItem("cv-language")).toBe("tr");
  expect(window.location.search).toBe("?lang=tr");
  fireEvent.click(screen.getByRole("button", { name: "English" }));
  expect(document.documentElement.lang).toBe("en");
  expect(
    screen.getByRole("textbox", { name: "Search publications" }),
  ).toHaveValue("aldosterone");
  expect(screen.getByText("Showing 1 of 1 publications")).toBeInTheDocument();
});

test("restores the saved preference and lets an explicit shared language override it", () => {
  localStorage.setItem("cv-language", "tr");
  const { unmount } = render(<App />);
  expect(screen.getByRole("button", { name: "Türkçe" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  unmount();
  window.history.replaceState(null, "", "/?lang=en#publications");
  render(<App />);
  expect(screen.getByRole("button", { name: "English" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(window.location.hash).toBe("#publications");
  expect(document.documentElement.lang).toBe("en");
});

test("Turkish publication type filters and empty-state reset use stable filter values", () => {
  window.history.replaceState(null, "", "/?lang=tr");
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("Storage disabled");
  });
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /Kongre özetleri/ }));
  expect(
    screen.getByText("5 yayından 5 kayıt gösteriliyor"),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox", { name: "Yayınlarda ara" }), {
    target: { value: "no-such-publication" },
  });
  expect(
    screen.getByRole("heading", { name: "Yayın bulunamadı" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Filtreleri temizle" }));
  expect(
    screen.getByText("15 yayından 5 kayıt gösteriliyor"),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "15 yayının tümünü göster" }),
  );
  expect(
    screen.getByText("15 yayından 15 kayıt gösteriliyor"),
  ).toBeInTheDocument();
});

test("profile sharing uses the selected language after switching and drops the section hash", async () => {
  window.history.replaceState(null, "", "/?lang=en#publications");
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: jest.fn().mockResolvedValue() },
  });
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Türkçe" }));
  fireEvent.click(screen.getByRole("button", { name: "Profili paylaş" }));
  await screen.findByText("Profil bağlantısı panoya kopyalandı");
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
    `${window.location.origin}/?lang=tr`,
  );
});
