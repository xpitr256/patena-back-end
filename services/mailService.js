const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {

    sendContactMail : function(email, name, message) {
        return new Promise((resolve, reject) => {
            const emailBody = {
                to: 'ncoco@fi.uba.ar',
                from: email,
                subject: 'Message from Patena, enviado por ' + name.toString(),
                text: 'Email Contact from Patena',
                html: '<strong>' + message + '</strong>',
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
