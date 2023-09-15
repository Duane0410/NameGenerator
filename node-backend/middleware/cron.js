const User = require('../model/User')
const Resource = require('../model/Resource')
const nodemailer = require('nodemailer')
const cron = require('node-cron')
const fs = require('fs')

const sendAllResourcesToUsers = async (emailObject, timeInterval) => {
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
                    : '\t-----'
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

const sendUpdatedResourcesToUsers = async (emailObject, timeInterval) => {
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

    const currentDate = new Date()
    const resources = await Resource.find()
    const resourcesUpdated = []

    switch (timeInterval) {
        case 'Weekly':
            console.log('\nWeekly resources - ', currentDate)

            resources.forEach(item => {
                const isInWeek = (givenDate) => {
                    const dayOfWeek = currentDate.getDay()
                    
                    const daysToMonday = (dayOfWeek + 6) % 7
                    const previousMonday = new Date(currentDate)
                    previousMonday.setDate(currentDate.getDate() - daysToMonday)
                    
                    return givenDate >= previousMonday && givenDate <= currentDate
                }

                const givenDateCreated = new Date(item.date_created)
                const givenDateUpdated = new Date(item.date_updated)

                if(isInWeek(givenDateCreated) || (item.date_updated && isInWeek(givenDateUpdated))) {
                    console.log('True')
                    resourcesUpdated.push(item)
                }
            })
            break;
        case 'Monthly':
            console.log('\nMonthly resources - ', currentDate)
            
            resources.forEach(item => {
                isInMonth = (givenDate) => {
                    const currentYear = currentDate.getFullYear()
                    const currentMonth = currentDate.getMonth()
                    
                    const firstDayOfCurrentMonth = new Date(currentYear, currentMonth, 1)
                    const firstDayOfPreviousMonth = new Date(currentYear, currentMonth - 1, 1)
                  
                    return givenDate >= firstDayOfPreviousMonth && givenDate <= firstDayOfCurrentMonth
                }

                const givenDateCreated = new Date(item.date_created)
                const givenDateUpdated = new Date(item.date_updated)

                if(isInMonth(givenDateCreated) || (item.date_updated && isInMonth(givenDateUpdated))) {
                    console.log('True')
                    resourcesUpdated.push(item)
                }
            })
            break;
        case 'Quaterly':
            console.log('\nQuaterly resources - ', currentDate)

            resources.forEach(item => {
                const isInQuater = (givenDate) => {
                    const currentYear = currentDate.getFullYear()
                    const currentMonth = currentDate.getMonth()
                    
                    let previousMonth
                    if (currentMonth === 0 || currentMonth === 3 || currentMonth === 6 || currentMonth === 9) {
                        previousMonth = currentMonth
                    } else {
                        previousMonth = (Math.floor(currentMonth / 3) * 3)
                    }
                  
                    const firstDayOfPreviousMonth = new Date(currentYear, previousMonth - 1, 1)
                  
                    return givenDate >= firstDayOfPreviousMonth && givenDate <= currentDate
                }

                const givenDateCreated = new Date(item.date_created)
                const givenDateUpdated = new Date(item.date_updated)

                if(isInQuater(givenDateCreated) || (item.date_updated && isInQuater(givenDateUpdated))) {
                    console.log('True')
                    resourcesUpdated.push(item)
                }
            })
            break;
        case 'Yearly':
            console.log('\nYearly resources - ', currentDate)

            resources.forEach(item => {
                const isInYear = (givenDate) => {
                    const currentYear = currentDate.getFullYear()
                    const currentMonth = currentDate.getMonth()
                    const currentDay = currentDate.getDate()
                  
                    let previousYear
                    if (currentMonth === 0 && currentDay === 1) {
                        previousYear = currentYear - 1
                    } else {
                        previousYear = currentYear
                    }
                    const firstDayOfCurrentYear = new Date(previousYear, 0, 1)
                    const firstDayOfPreviousYear = new Date(previousYear - 1, 0, 1)
                  
                    return givenDate >= firstDayOfPreviousYear && givenDate < firstDayOfCurrentYear
                }

                const givenDateCreated = new Date(item.date_created)
                // console.log('TrueCreate - ',  givenDateCreated)
                const givenDateUpdated = new Date(item.date_updated)
                // console.log('TrueUpdate - ',  givenDateUpdated)
                // console.log('Current - ',  currentDate.getFullYear())
                // console.log('PrevTrue - ',  new Date((currentDate.getFullYear())-1, 0, 1))
                // console.log('CurrTrue - ',  new Date((currentDate.getFullYear()), 0, 1))
                // console.log('TrueCreate - ',  isInYear(givenDateCreated))

                if(isInYear(givenDateCreated) || (item.date_updated && isInYear(givenDateUpdated))) {
                    console.log('True')
                    resourcesUpdated.push(item)
                }
            })
            break;
        default:
            console.log('\nTrial resources - ', currentDate)
            break;
    }

    if (resourcesUpdated.length === 0) {
        return
    }
    const emailTemplate = fs.readFileSync('./public/views/email-template.html', 'utf-8')

    const dataRows = resourcesUpdated.map(item => `
        <tr>
            <td>${item.date_created}</td>
            <td>
                ${item?.date_updated
                    ? item.date_updated
                    : '\t-----'
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
                var updateOnlyEmails = ['duanerodrigues0410@gmail.com']
                // var emails = ['duanerodrigues0410@gmail.com', 'gauravikamat77@gmail.com', 'shreyasawant@pccegoa.onmicrosoft.com', 'atharvkindalkar2002@gmail.com']
                usersData.map((user) => {
                    // emails.push(user.email);
                    updateOnlyEmails.push(user.email);
                })

                // if (emails) sendAllResourcesToUsers(emails, 'Trial')
                if (updateOnlyEmails) sendUpdatedResourcesToUsers(emails, 'Yearly')
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
                var updateOnlyEmails = []
                usersData.map((user) => {
                    if (user.weekly) {
                        if (user.updated_only) updateOnlyEmails.push(user.email)
                        else emails.push(user.email)
                    }
                })

                if (emails) sendAllResourcesToUsers(emails, 'Weekly')
                if (updateOnlyEmails) sendUpdatedResourcesToUsers(emails, 'Weekly')
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
                var updateOnlyEmails = []
                usersData.map((user) => {
                    if (user.monthly) {
                        if (user.updated_only) updateOnlyEmails.push(user.email)
                        else emails.push(user.email)
                    }
                })

                if (emails) sendAllResourcesToUsers(emails, 'Monthly')
                if (updateOnlyEmails) sendUpdatedResourcesToUsers(emails, 'Monthly')
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
                var updateOnlyEmails = []
                usersData.map((user) => {
                    if (user.quaterly) {
                        if (user.updated_only) updateOnlyEmails.push(user.email)
                        else emails.push(user.email)
                    }
                })

                if (emails) sendAllResourcesToUsers(emails, 'Quaterly')
                if (updateOnlyEmails) sendUpdatedResourcesToUsers(emails, 'Quaterly')
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
                var updateOnlyEmails = []
                usersData.map((user) => {
                    if (user.yearly) {
                        if (user.updated_only) updateOnlyEmails.push(user.email)
                        else emails.push(user.email)
                    }
                })

                if (emails) sendAllResourcesToUsers(emails, 'Yearly')
                if (updateOnlyEmails) sendUpdatedResourcesToUsers(emails, 'Yearly')
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