// 사용할 컴포넌트

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "locales/i18n";

export default function Header() {
  const { t } = useTranslation();
  const languageRef = useRef<null | HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isLanguageMenuOpen, setLanguageMenuOpen] = useState<boolean>(false);

  // 외부 클릭 시 닫기
  const handleUserClose = useCallback((e: any) => {
    if (isLanguageMenuOpen && languageRef.current !== null && !languageRef.current.contains(e.target)) setLanguageMenuOpen(false);
  }, [isUserMenuOpen, isLanguageMenuOpen]);

  useEffect(() => {
    document.addEventListener("click", handleUserClose);
    return () => document.removeEventListener("click", handleUserClose)
  }, [handleUserClose]);

  // 언어 변경하기
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-gnb">
        <div className="header-inner">
          <nav className="header-gnb-nav">
            <div className="header-gnb-nav-link" onClick={() => navigate("/user/signin")}>{t(`header.login`)}</div>
            <div className="header-gnb-nav-link" onClick={() => navigate("/user/register")}>{t(`header.register`)}</div>
            <div ref={languageRef} className="header-gnb-nav-link lang-en" onClick={() => setLanguageMenuOpen(prev => !prev)}>
              {t(`header.language`)}
              {isLanguageMenuOpen && (
                <ul className="header-gnb-nav-link-dropDown">
                  <li className="header-gnb-nav-link-dropDown-item" onClick={() => changeLanguage("ko")}>한국어</li>
                  <li className="header-gnb-nav-link-dropDown-item" onClick={() => changeLanguage("en")}>English</li>
                </ul>
              )}
            </div>
            <div className="header-gnb-nav-link">{t(`header.help`)}</div>
          </nav>
        </div>
      </div>
      {isLoggingIn && (
        <div className="header-snb" onMouseEnter={() => setSubMenuOpen(true)} onMouseLeave={() => setSubMenuOpen(false)}>
          <div className="header-inner">
            <nav className="header-snb-nav">
              <div className="header-snb-nav-link">{t(`nav.dashboard`)}</div>
              <div className="header-snb-nav-link">{t(`nav.shopping-mall`)}</div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}