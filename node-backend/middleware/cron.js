const User = require('../model/User');
const Resource = require('../model/Resource');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const fs = require('fs');

const sendEmails = async (emailObject, timeInterval) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const emailTemplate = fs.readFileSync('./public/views/email-template.html', 'utf-8');

    const resources = await Resource.find();

    const dataRows = resources.map(item => `
        <tr>
            <td>${item.date_created}</td>
            <td>${item.date_updated || '\t-----'}</td>
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
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Mail has been sent:', info.response);
    } catch (error) {
        console.log(error);
    }
};

const sendEmailsToUsers = async (interval) => {
    try {
        const usersData = await User.find();

        if (usersData.length > 0) {
            const emails = [];
            
            usersData.forEach(user => {
                if (user.schedule_options[interval.toLowerCase()]) emails.push(user.email);
            })

            if (emails.length) {
                sendEmails(emails, interval);
            }
        }
    } catch (error) {
        console.log(error.message);
    }
};

const schedules = [
    { interval: 'Trial', cronPattern: '*/10 * * * * *' },       // Change 'Trial' to any other interval to test
    { interval: 'Weekly', cronPattern: '0 9 * * 1' },
    { interval: 'Monthly', cronPattern: '0 9 1 * *' },
    { interval: 'Quarterly', cronPattern: '0 9 1 1,4,7,10 *' },
    { interval: 'Yearly', cronPattern: '0 9 1 1 *' }
];

const scheduleTasks = () => {
    schedules.forEach(schedule => {
        cron.schedule(schedule.cronPattern, () => {
            sendEmailsToUsers(schedule.interval);
        });
    });
};

module.exports = {
    scheduleTasks
};