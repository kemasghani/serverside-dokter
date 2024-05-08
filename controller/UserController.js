const nodemailer = require('nodemailer');
const { User } = require('../models');
const retry = require('retry');

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check password (you may need to implement your own password checking logic)
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
};


// Function to generate a random 8-digit code`
function generateRandomCode() {
    return Math.floor(10000000 + Math.random() * 90000000);
}

// Function to send email
exports.sendEmail = async (req, res) => {
    try {
        const { userEmail, name } = req.body;
        console.log(userEmail);

        // Generate a random 8-digit code
        const verificationCode = generateRandomCode();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kemasghani123@gmail.com',
                pass: 'prfg qnvb sfcs woxx'
            }
        });

        // Construct the email message
        const message = `Email Anda sudah terdaftar sebagai mitra. Silahkan login menggunakan email dan kode verifikasi dibawah ini:\n\nEmail: ${userEmail}\nKode: ${verificationCode}`;

        const mailOptions = {
            from: 'kemasghani123@gmail.com',
            to: userEmail,
            subject: 'Selamat datang mitra kami',
            text: message
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        await User.create({ username: name, email: userEmail, password: verificationCode });
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'sent successful' });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
};
