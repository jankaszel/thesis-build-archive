#!/usr/bin/env node
const sendgrid = require("@sendgrid/mail");
const builds = require("./builds.json");

sendgrid.setApiKey(process.env.SENDGRID_TOKEN);

const url = `https://${process.env.ARCHIVE_HOST}/${builds.shift().filename}`;
const message = {
  to: process.env.MAIL_RECIPIENT,
  from: "action@github.com",
  subject: "Thesis build available",
  text: `The most recent build of your thesis is now available: ${url}`,
  html: `<p>The most recent build of your thesis is now available:</p><p><a href="${url}">${url}</a></p>`
};

sendgrid
  .send(message)
  .then(() => console.log("Mail sent successfully."))
  .catch(error => console.error(error.toString()));
