const sgMail = require('@sendgrid/mail');
const config =require('../config/config');
sgMail.setApiKey(config.SENDGRID_API_KEY);
const fs = require('fs');
const mustache   = require('mustache');
const translationService = require('./translationService');

/***
 * TEMPORARY
 */
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getCommonMailInformation(translations) {
    return {
        mr: translations.mailService.mr,
        thanksMessage: translations.mailService.thanksMessage,
        laboratory: translations.mailService.firm.laboratory,
        department: translations.mailService.firm.department,
        school: translations.mailService.firm.school,
        university: translations.mailService.firm.university
    };
}

function getWorkInProgressMailData(language, workType, workId) {

    const translations = translationService.getTranslationsIn(language);
    let mailData = getCommonMailInformation(translations);

    mailData.subject = workType === 'design' ? translations.mailService.workInProgress.subject.design : translations.mailService.workInProgress.subject.analysis;
    mailData.title = workType === 'design' ? translations.mailService.workInProgress.title.design : translations.mailService.workInProgress.title.analysis;
    mailData.description = translations.mailService.workInProgress.description;
    mailData.orderNumber = workId;
    mailData.availableMessage = translations.mailService.workInProgress.availableMessage;

    return mailData;
}

function getWorkSuccessMailData(language, workType, workId) {

    const translations = translationService.getTranslationsIn(language);
    let mailData = getCommonMailInformation(translations);

    mailData.subject = workType === 'design' ? translations.mailService.workSuccess.subject.design : translations.mailService.workSuccess.subject.analysis;
    mailData.title = workType === 'design' ? translations.mailService.workSuccess.title.design : translations.mailService.workSuccess.title.analysis;
    mailData.description = translations.mailService.workSuccess.description;
    mailData.seeResults = translations.mailService.workSuccess.seeResults;
    const resultsLink = config.FRONT_END_BASE_URL + '/results?orderNumber=' + workId;
    mailData.resultsUrl = resultsLink;
    mailData.linkMessage = translations.mailService.workSuccess.linkMessage + '<a href="' + resultsLink + '" target="_blank">' + resultsLink + '</a>';

    return mailData;
}

function getWorkErrorMailData(language, workType, workId) {
    const translations = translationService.getTranslationsIn(language);
    let mailData = getCommonMailInformation(translations);

    mailData.subject = workType === 'design' ? translations.mailService.workError.subject.design : translations.mailService.workError.subject.analysis;
    mailData.title = workType === 'design' ? translations.mailService.workError.title.design : translations.mailService.workError.title.analysis;
    mailData.description = translations.mailService.workError.description;
    mailData.orderNumber = workId;
    const contactUsLink = config.FRONT_END_BASE_URL + '/contact';
    mailData.tryAgain = translations.mailService.workError.tryAgain + ' <a href="' + contactUsLink + '" target="_blank">' + translations.mailService.workError.contactUs + '</a>';

    return mailData;
}

function geContactMailData(language, name, message) {
    const translations = translationService.getTranslationsIn(language);
    let mailData = getCommonMailInformation(translations);
    mailData.subject = translations.mailService.contact.subject;
    mailData.title = translations.mailService.contact.title;
    mailData.from = name;
    mailData.question = message;

    return mailData;
}

module.exports = {

    sendContactMail : async function(email, name, message) {

        return new Promise((resolve, reject) => {

            const htmlTemplate = fs.readFileSync("./services/emailTemplates/contactMessage.html","utf-8");
            const data = geContactMailData("en", name, message);
            const htmlContent = mustache.render(htmlTemplate, data);

            const emailBody = {
                to: config.CONTACT_MAIL,
                from: email,
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
    },

    sendWorkSuccessMail : function(email, language, workType, workId) {
        return new Promise((resolve, reject) => {

            const htmlTemplate = fs.readFileSync("./services/emailTemplates/workSuccess.html","utf-8");
            const data = getWorkSuccessMailData(language, workType, workId);
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
    },

    sendWorkErrorMail : function(email, language, workType, workId) {
        return new Promise((resolve, reject) => {

            const htmlTemplate = fs.readFileSync("./services/emailTemplates/workError.html","utf-8");
            const data = getWorkErrorMailData(language, workType, workId);
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
