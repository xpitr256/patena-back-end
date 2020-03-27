const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const contactMail = process.env.CONTACT_MAIL || 'nachoquique@gmail.com';
const fs = require('fs');
const mustache   = require('mustache');

/***
 * TEMPORARY
 */
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getWorkInProgressMailData(language, workType, workId) {
    const translations = JSON.parse(fs.readFileSync('./lang/'+language+'.json', 'utf-8'));
    return {
        subject: workType === 'design' ? translations.mailService.workInProgress.subject.design : translations.mailService.workInProgress.subject.analysis,
        title: workType === 'design' ? translations.mailService.workInProgress.title.design : translations.mailService.workInProgress.title.analysis,
        mr: translations.mailService.workInProgress.mr,
        description: translations.mailService.workInProgress.description,
        orderNumber: workId,
        availableMessage: translations.mailService.workInProgress.availableMessage,
        thanksMessage: translations.mailService.workInProgress.thanksMessage,
        laboratory: translations.mailService.firm.laboratory,
        department: translations.mailService.firm.department,
        school: translations.mailService.firm.school,
        university: translations.mailService.firm.university
    };
}

module.exports = {

    sendContactMail : function(email, name, message) {
        return module.exports.sendWorkInProgressMail(email,"en","design", uuidv4())
    },

    sendWorkInProgressMail : function(email, language, workType, workId) {
        return new Promise((resolve, reject) => {

            const htmlTemplate = fs.readFileSync("./services/emailTemplates/workInProgress.html","utf-8");
            const data = getWorkInProgressMailData(language, workType, workId);
            const htmlContent = mustache.render(htmlTemplate, data);

            const emailBody = {
                to: email,
                from: "no-reply@patena.herokuapp.com",
                subject: data.subject,
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
