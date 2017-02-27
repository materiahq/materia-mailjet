class MailjetSender {
    constructor(key, secret, from, name) {
        this.from = from

        this.mailjet = require('node-mailjet').connect(key, secret);
    }

    send(params) {
        var sendEmail = this.mailjet.post('send');

        var emailData = {
            'FromEmail': this.from,
            'Subject': params.subject,
            'Text-part': params.body,
            'Recipients': [{'Email': params.to}]
        }
        if (this.name) {
            emailData['FromName'] = this.name
        }

        return sendEmail.request(emailData)
    }
}

module.exports = MailjetSender