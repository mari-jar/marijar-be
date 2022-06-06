
const nodemailer = require("nodemailer");
const { env } = require('../../../config')
const mustache = require('mustache');
const fs = require('fs');

const Mail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL,
    pass: env.EMAIL_PASSWORD,
  }
});

module.exports = {
  async sendMail (email, subject, template) {
    let { html, data } = template
    html = fs.readFileSync(`./bin/helpers/mail/mail_html/${html}`, 'utf8');

    await Mail.sendMail({
      from: 'Marijar',
      to: `mochamadaufa7@gmail.com` ||email,
      subject: subject,
      html: mustache.render(html, data)
    })
  }
}