const User = require('../model/User')
const Resource = require('../model/Resource')
const nodemailer = require('nodemailer')
const cron = require('node-cron')
const fs = require('fs')

const sendMailToAllUser = async (emailObject, timeInterval) => {
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
            <td>
                ${item?.date_updated
                    ? item.date_updated
                    : '-----'
                }
            </td>
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
        subject: `${timeInterval} Update Report`,
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
        cron.schedule('*/10 * * * * *', async function () {
            var usersData = await User.find()
            if (usersData.length > 0) {
                var emails = ['duanerodrigues0410@gmail.com']
                // var emails = ['duanerodrigues0410@gmail.com', 'gauravikamat77@gmail.com', 'shreyasawant@pccegoa.onmicrosoft.com', 'atharvkindalkar2002@gmail.com']
                usersData.map((user) => {
                    emails.push(user.email);
                })

                sendMailToAllUser(emails, 'Trial')
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

const sendWeeklyMail = () => {
    try {
        // Every Monday at 9:00 AM
        cron.schedule('0 9 * * 1', async function () {
            var usersData = await User.find()
            if (usersData.length > 0) {
                var emails = []
                usersData.map((user) => {
                    if (user.weekly) emails.push(user.email);
                })

                sendMailToAllUser(emails, 'Weekly')
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

const sendMonthlyMail = () => {
    try {
        // First day of every month at 9:00 AM
        cron.schedule('0 9 1 * *', async function () {
            var usersData = await User.find()
            if (usersData.length > 0) {
                var emails = []
                usersData.map((user) => {
                    if (user.monthly) emails.push(user.email);
                })

                sendMailToAllUser(emails, 'Monthly')
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

const sendQuarterlyMail = () => {
    try {
        // First day of every quarter(January, April, July, and October) at 9:00 AM
        cron.schedule('0 9 1 1,4,7,10 *', async function () {
            var usersData = await User.find()
            if (usersData.length > 0) {
                var emails = []
                usersData.map((user) => {
                    if (user.quaterly) emails.push(user.email);
                })

                sendMailToAllUser(emails, 'Quaterly')
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

const sendYearlyMail = () => {
    try {
        // January 1st of every year at 9:00 AM
        cron.schedule('0 9 1 1 *', async function () {
            var usersData = await User.find()
            if (usersData.length > 0) {
                var emails = []
                usersData.map((user) => {
                    if (user.yearly) emails.push(user.email);
                })

                sendMailToAllUser(emails, 'Yearly')
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    sendMailAllUser,
    sendWeeklyMail,
    sendMonthlyMail,
    sendQuarterlyMail,
    sendYearlyMail
}