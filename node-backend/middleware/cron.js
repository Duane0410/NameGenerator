const User = require('../model/User')
const Resource = require('../model/Resource')
const nodemailer = require('nodemailer')
const cron = require('node-cron')
const fs = require('fs')

const sendMailToAllUser = async (emailObject) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const emailTemplate = fs.readFileSync('./public/views/email-template.html', 'utf-8')

    const resources = await Resource.find()

    const dataRows = resources.map(item => `
        <tr>
            <td>${item.date_created}</td>
            <td>${item.assigned_by}</td>
            <td>${item.resource}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.location}</td>
        </tr>
    `).join('');

    const emailBody = emailTemplate.replace('<!-- Data rows will be injected here -->', dataRows);

    const mailOptions = {
        from: "Node Project",
        to: emailObject,
        subject: 'Cron Test Mail',
        html: emailBody
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Mail has been sent: ', info.response)
        }
    })
}

const sendMailAllUser = () => {
    try {
        cron.schedule('0 9 1 * *', async function () {
            var usersData = await User.find()
            if (usersData.length > 0) {
                // var emails = []
                var emails = ['duanerodrigues0410@gmail.com', 'gauravikamat77@gmail.com', 'shreyasawant@pccegoa.onmicrosoft.com', 'atharvkindalkar2002@gmail.com']
                usersData.map((user) => {
                    emails.push(user.email);
                })

                sendMailToAllUser(emails)
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    sendMailAllUser
}