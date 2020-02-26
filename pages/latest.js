import React from "react";
import { useRouter } from "next/router";
import builds from "../builds.json";

const Latest = () => {
  if (typeof window !== "undefined") {
    const router = useRouter();
    router.push(`/${builds.shift().filename}`);
  }

  return null;
};

Latest.getInitialProps = ({ res }) => {
  if (typeof window === "undefined") {
    res.writeHead(301, {
      Location: `/${builds.shift().filename}`
    });
    res.end();
    res.finished = true;
  }

  return {};
};

export default Latest;
