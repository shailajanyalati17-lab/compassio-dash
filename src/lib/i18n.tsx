import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en-US" | "en-GB" | "es" | "de";

export const LANG_LABELS: Record<Lang, string> = {
  "en-US": "English (US)",
  "en-GB": "English (UK)",
  es: "Español",
  de: "Deutsch",
};

// Curated dictionary — sidebar, common labels, greetings.
const DICT: Record<Lang, Record<string, string>> = {
  "en-US": {},
  "en-GB": {
    Dashboard: "Dashboard",
    Analytics: "Analytics",
    Forecasting: "Forecasting",
    "AI Assistant": "AI Assistant",
    Sales: "Sales",
    Customers: "Customers",
    Products: "Products",
    Inventory: "Inventory",
    Orders: "Orders",
    Finance: "Finance",
    Marketing: "Marketing",
    Employees: "Employees",
    Reports: "Reports",
    Notifications: "Notifications",
    Alerts: "Alerts",
    Calendar: "Calendar",
    Tasks: "Tasks",
    Settings: "Settings",
    Profile: "Profile",
    Overview: "Overview",
    Commerce: "Commerce",
    Operate: "Operate",
    Workspace: "Workspace",
    Export: "Export",
    "New product": "New product",
    "Ask AI": "Ask AI",
    "Good morning": "Good morning",
    "Good afternoon": "Good afternoon",
    "Good evening": "Good evening",
  },
  es: {
    Dashboard: "Panel",
    Analytics: "Analítica",
    Forecasting: "Pronóstico",
    "AI Assistant": "Asistente IA",
    Sales: "Ventas",
    Customers: "Clientes",
    Products: "Productos",
    Inventory: "Inventario",
    Orders: "Pedidos",
    Finance: "Finanzas",
    Marketing: "Marketing",
    Employees: "Empleados",
    Reports: "Informes",
    Notifications: "Notificaciones",
    Alerts: "Alertas",
    Calendar: "Calendario",
    Tasks: "Tareas",
    Settings: "Ajustes",
    Profile: "Perfil",
    Overview: "Resumen",
    Commerce: "Comercio",
    Operate: "Operaciones",
    Workspace: "Espacio",
    Export: "Exportar",
    "New product": "Nuevo producto",
    "Ask AI": "Preguntar IA",
    "Good morning": "Buenos días",
    "Good afternoon": "Buenas tardes",
    "Good evening": "Buenas noches",
  },
  de: {
    Dashboard: "Übersicht",
    Analytics: "Analytik",
    Forecasting: "Prognose",
    "AI Assistant": "KI-Assistent",
    Sales: "Verkauf",
    Customers: "Kunden",
    Products: "Produkte",
    Inventory: "Bestand",
    Orders: "Bestellungen",
    Finance: "Finanzen",
    Marketing: "Marketing",
    Employees: "Mitarbeiter",
    Reports: "Berichte",
    Notifications: "Benachrichtigungen",
    Alerts: "Warnungen",
    Calendar: "Kalender",
    Tasks: "Aufgaben",
    Settings: "Einstellungen",
    Profile: "Profil",
    Overview: "Überblick",
    Commerce: "Handel",
    Operate: "Betrieb",
    Workspace: "Arbeitsbereich",
    Export: "Exportieren",
    "New product": "Neues Produkt",
    "Ask AI": "KI fragen",
    "Good morning": "Guten Morgen",
    "Good afternoon": "Guten Tag",
    "Good evening": "Guten Abend",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en-US");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("bp-lang")) as Lang | null;
    if (saved && DICT[saved]) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("bp-lang", l);
      document.documentElement.lang = l;
    } catch {}
  };

  const t = (key: string) => DICT[lang]?.[key] ?? key;

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) return { lang: "en-US" as Lang, setLang: () => {}, t: (k: string) => k };
  return ctx;
}
