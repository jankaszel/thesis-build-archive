import React, { useEffect } from "react";
import { useRouter } from "next/router";
import builds from "../builds.json";

const Latest = () => {
  const router = useRouter();
  useEffect(() => {
    router.push(`/${builds.shift().filename}`);
  }, []);

  return null;
};

export default Latest;
