import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { en } from "../data/i18n/en";
import { ptBR } from "../data/i18n/pt-BR";

export type Language = "en" | "pt-BR";
type TranslationKey = keyof typeof en;
const dictionaries = { en, "pt-BR": ptBR };
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: (
    key: TranslationKey | string,
    values?: Record<string, string | number>,
  ) => string;
}>({ language: "en", setLanguage: () => undefined, t: (key) => key });

/** Fornece idioma, troca de idioma e função de tradução para a árvore da aplicação. */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem("dnd-toolkit-language") as Language) || "en",
  );
  const setLanguage = (next: Language) => {
    setLanguageState(next);
    localStorage.setItem("dnd-toolkit-language", next);
  };
  const t = useMemo(
    () =>
      (
        key: TranslationKey | string,
        values?: Record<string, string | number>,
      ) => {
        let text =
          (dictionaries[language] as Record<string, string>)[key] ||
          en[key as TranslationKey] ||
          key;
        return Object.entries(values || {}).reduce(
          (result, [name, value]) =>
            result.replaceAll(`{{${name}}}`, String(value)),
          text,
        );
      },
    [language],
  );
  useEffect(() => {
    document.documentElement.lang = language === "pt-BR" ? "pt-BR" : "en";
  }, [language]);
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
/** Retorna o contexto de internacionalização disponível no componente atual. */
export function useTranslation() {
  return useContext(LanguageContext);
}
