// Email Service - Supports multiple providers
// Choose one: Gmail (SMTP), SendGrid, Resend, or Mailgun

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'resend' // Options: 'gmail', 'sendgrid', 'resend', 'mailgun'

// Gmail SMTP (using Nodemailer)
let gmailTransporter = null
if (EMAIL_PROVIDER === 'gmail') {
  const nodemailer = require('nodemailer')
  gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'sirishop783@gmail.com',
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  gmailTransporter.verify((error) => {
    if (error) {
      console.error('Gmail SMTP error:', error)
      console.log('⚠️  Gmail not configured. Please set EMAIL_PASSWORD in .env')
    } else {
      console.log('✅ Gmail SMTP ready')
    }
  })
}

// SendGrid
let sendGridReady = false
if (EMAIL_PROVIDER === 'sendgrid') {
  try {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    sendGridReady = true
    console.log('✅ SendGrid ready')
  } catch (error) {
    console.error('SendGrid error:', error)
  }
}

// Resend (Recommended - Modern & Easy)
let resendClient = null
if (EMAIL_PROVIDER === 'resend') {
  try {
    const { Resend } = require('resend')
    resendClient = new Resend(process.env.RESEND_API_KEY)
    console.log('✅ Resend ready')
  } catch (error) {
    console.error('Resend error:', error)
  }
}

// Mailgun
let mailgunClient = null
if (EMAIL_PROVIDER === 'mailgun') {
  try {
    const formData = require('form-data')
    const Mailgun = require('mailgun.js')
    const mailgun = new Mailgun(formData)
    mailgunClient = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY,
    })
    console.log('✅ Mailgun ready')
  } catch (error) {
    console.error('Mailgun error:', error)
  }
}

const sendEmail = async ({ to, subject, html, text }) => {
  const fromEmail = process.env.EMAIL_FROM || 'noreply@matcha.app'
  const fromName = process.env.EMAIL_FROM_NAME || 'Matcha'

  try {
    switch (EMAIL_PROVIDER) {
      case 'gmail': {
        if (!gmailTransporter) {
          throw new Error('Gmail transporter not configured')
        }
        const mailOptions = {
          from: `"${fromName}" <${process.env.EMAIL_USER || 'sirishop783@gmail.com'}>`,
          to,
          subject,
          html,
          text: text || html.replace(/<[^>]*>/g, ''),
        }
        const info = await gmailTransporter.sendMail(mailOptions)
        console.log('Email sent via Gmail:', info.messageId)
        return info
      }

      case 'sendgrid': {
        if (!sendGridReady) {
          throw new Error('SendGrid not configured')
        }
        const sgMail = require('@sendgrid/mail')
        const msg = {
          to,
          from: fromEmail,
          subject,
          html,
          text: text || html.replace(/<[^>]*>/g, ''),
        }
        const response = await sgMail.send(msg)
        console.log('Email sent via SendGrid:', response[0].statusCode)
        return response
      }

      case 'resend': {
        if (!resendClient) {
          throw new Error('Resend not configured')
        }
        const { data, error } = await resendClient.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to,
          subject,
          html,
        })
        if (error) {
          throw error
        }
        console.log('Email sent via Resend:', data.id)
        return data
      }

      case 'mailgun': {
        if (!mailgunClient) {
          throw new Error('Mailgun not configured')
        }
        const domain = process.env.MAILGUN_DOMAIN
        if (!domain) {
          throw new Error('MAILGUN_DOMAIN not set')
        }
        const messageData = {
          from: `${fromName} <${fromEmail}>`,
          to,
          subject,
          html,
          text: text || html.replace(/<[^>]*>/g, ''),
        }
        const response = await mailgunClient.messages.create(domain, messageData)
        console.log('Email sent via Mailgun:', response.id)
        return response
      }

      default:
        throw new Error(`Unknown email provider: ${EMAIL_PROVIDER}`)
    }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

module.exports = { sendEmail }
