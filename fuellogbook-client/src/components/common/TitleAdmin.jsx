import React from "react";

const TitleAdmin = ({ title, subTitle }) => {
  return (
    <div className="mb-4">
      <h1
        className="font-medium text-2xl md:text-3xl"
        style={{ color: "var(--color-text)" }}
      >
        {title}
      </h1>
      {subTitle && (
        <p
          className="text-sm md:text-base mt-2 max-w-[60rem] leading-relaxed"
          style={{ color: "var(--color-text-light)" }}
        >
          {subTitle}
        </p>
      )}
    </div>
  );
};

export default TitleAdmin;
