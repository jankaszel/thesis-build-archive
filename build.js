#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const minimatch = require("minimatch");
const { Repository } = require("nodegit");

const repositoryPath = __dirname;
const buildsPath = path.join(repositoryPath, "public");
const dbPath = path.join(repositoryPath, "builds.json");
const archiveSize = process.env.ARCHIVE_SIZE || 10;

function getMetadata(filename) {
  if (!fs.existsSync(filename)) return [];

  try {
    return JSON.parse(fs.readFileSync(filename, "utf8")).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  } catch (err) {
    return [];
  }
}

async function main() {
  const builds = fs
    .readdirSync(buildsPath)
    .filter(filename => minimatch(filename, "*.pdf"));

  if (builds.length === 0) {
    console.error("Error: No builds present in builds directory.");
    process.exit(1);
  }

  const db = getMetadata(dbPath);
  const repo = await Repository.open(repositoryPath);
  if ((await repo.getStatus()).length > 0) {
    console.error("Error: Repository has uncommitted changes.");
    process.exit(1);
  }

  const lastCommit = await repo.getReferenceCommit("master");

  if (db.length === 0) {
    if (builds.length > archiveSize) {
      console.error(
        `Error: Too many unarchived builds present in builds directory. Will only archive ${archiveSize} recent builds.`
      );
      process.exit(1);
    }

    for (const filename of builds) {
      db.push({
        filename,
        commit: lastCommit.sha().substr(0, 8),
        timestamp: new Date().toISOString()
      });
    }
  } else {
    const newBuilds = builds.filter(
      filename => !db.find(build => build.filename === filename)
    );
    if (newBuilds.length < 1) {
      console.log(`No new builds present.`);
      process.exit(0);
    } else if (newBuilds.length > 1) {
      console.error(
        "Error: More than 1 new build present in public directory."
      );
      process.exit(1);
    }

    db.unshift({
      filename: path.basename(newBuilds[0]),
      commit: lastCommit.sha().substr(0, 8),
      timestamp: new Date().toISOString()
    });

    while (db.length > archiveSize) {
      const oldBuild = db.pop();
      fs.unlinkSync(path.join(buildsPath, oldBuild.filename));
    }
  }

  fs.writeFileSync(dbPath, JSON.stringify(db), "utf8");
}

main();
