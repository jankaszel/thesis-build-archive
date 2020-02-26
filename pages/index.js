import React from "react";
import builds from '../builds.json'

const Index = ({ builds }) => (
  <div>
    <p>Hi!</p>
    <ul>
      {builds.map(build => (
        <li key={build.commit}>{build.filename}</li>
      ))}
    </ul>
  </div>
);

export default Index;
