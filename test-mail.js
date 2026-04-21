require('dotenv').config({ path: './.env.local' });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

async function run() {
    try {
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: 'Test Webhook Email',
            text: 'If you see this, Nodemailer is securely connected.',
        });
        console.log('SUCCESS:', info.messageId);
    } catch (err) {
        console.error('ERROR:', err);
    }
}
run();
