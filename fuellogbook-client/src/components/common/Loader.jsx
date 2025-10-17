import React from "react";
import { useThemeContext } from "../../context/ThemeContext";
import loaderGif from "../../assets/ridelogzLoader.gif";
import loaderGifDark from "../../assets/ridelogzLoaderDark.gif";

const Loader = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <img
        src={isDark ? loaderGifDark : loaderGif}
        alt="Loading..."
        className="w-16 h-16 md:w-50 md:h-50"
      />
    </div>
  );
};

export default Loader;
