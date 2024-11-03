"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { setCookie, hasCookie, getCookie } from "cookies-next";
import usePopContainer from "@/components/PopContainer/PopContainer";

export default function useThemeMode() {
  const { theme, setTheme } = useTheme();
  const [isCookiesAccepted, setisCookiesAccepted] = useState<boolean>(false);
  
  //Ask permision
  usePopContainer(isCookiesAccepted, {
    title: "Cookies Permission",
    description:
      "For your information, we use cookies to trigger dark and light mode.",
    btnTitle: "Understood",
    action: () => {
      setCookie("is_CookieThemeAgree", "yes", { maxAge: 60 * 6 * 720 });
      setisCookiesAccepted(false);
    },
  });

  // Set Base Theme
  useEffect(() => {
    if (!hasCookie("themeColorScheme")) {
      setCookie("themeColorScheme", "dark", { maxAge: 60 * 6 * 720 });
      setTheme("dark");
    }

    // cookies permision
    const cookie = getCookie("is_CookieThemeAgree")
    switch (hasCookie("is_CookieThemeAgree")&& cookie === "yes") {
      case true:
        setisCookiesAccepted(false);
        break;

      default:
        setisCookiesAccepted(true);
        break;
    }
  }, [theme, isCookiesAccepted]);

  return { theme, setTheme };
}
