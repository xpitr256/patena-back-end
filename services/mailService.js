const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const contactMail = process.env.CONTACT_MAIL || 'nachoquique@gmail.com';
const fs = require('fs');

module.exports = {

    sendContactMail : function(email, name, message) {
        return new Promise((resolve, reject) => {

            const htmlContent = fs.readFileSync("./services/emailTemplates/workInProgress.html","utf-8");

            const emailBody = {
                to: contactMail,
                from: email,
                subject: 'PATENA - Nuevo Diseño de Linker',
                html: htmlContent
            };

            sgMail.send(emailBody, function(err, json) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }

};
