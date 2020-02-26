import React from "react";
import Head from "next/head";
import style from "./Index.module.css";
import builds from "../builds.json";

const Index = () => (
  <div>
    <Head>
      <title>Jan's Thesis Builds</title>
    </Head>

    <p>
      These are the latest Pandoc builds of my master's thesis, ordered
      chronologically.
    </p>

    <ul>
      {builds.map((build, index) => (
        <li key={build.commit}>
          <a href={`/${build.filename}`}>{build.filename}</a>
          {index === 0 && <em className={style.label}>latest</em>}
        </li>
      ))}
    </ul>
  </div>
);

export default Index;
