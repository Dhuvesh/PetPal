// utils/emailService.js
import nodemailer from 'nodemailer';
import moment from 'moment';

// Create email transporter
const createTransporter = () => {
  // For production, use your actual SMTP settings
  // For testing, you can use services like Mailtrap, SendGrid, etc.
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
                rejectUnauthorized: false, // Bypass self-signed certificate errors
            },
  });
};

// Format donation amount with currency symbol
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// Generate donation receipt email
const sendDonationReceipt = async (donation) => {
  try {
    const transporter = createTransporter();
    
    // Prepare donor's full name
    const donorName = `${donation.firstName} ${donation.lastName}`;
    
    // Determine fund type display name
    let fundDisplayName;
    switch (donation.fundType) {
      case 'general':
        fundDisplayName = 'Where Most Needed';
        break;
      case 'medical':
        fundDisplayName = 'Emergency Medical Fund';
        break;
      case 'shelter':
        fundDisplayName = 'Shelter Support Program';
        break;
      case 'rescue':
        fundDisplayName = 'Rescue Operations';
        break;
      case 'spay':
        fundDisplayName = 'Spay & Neuter Program';
        break;
      default:
        fundDisplayName = 'General Fund';
    }
    
    // Format amount with currency symbol
    const formattedAmount = formatCurrency(donation.amount);
    
    // Format date
    const donationDate = moment(donation.createdAt).format('MMMM D, YYYY');
    
    // Donation type
    const donationType = donation.isMonthly ? 'Monthly recurring' : 'One-time';
    
    // Generate receipt number (using donation ID and timestamp)
    const receiptNumber = `PH-${donation._id.toString().substring(0, 8)}-${Date.now().toString().substring(9, 13)}`;
    
    // Create email content
    const emailSubject = `Your Pet Haven Donation Receipt (#${receiptNumber})`;
    
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Donation Receipt</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          background-color: #f9f9f9;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 15px;
        }
        .receipt-box {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 25px;
          margin-top: 20px;
          background-color: #fff;
        }
        .receipt-header {
          border-bottom: 2px solid #eee;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .receipt-title {
          font-size: 24px;
          margin: 0;
          color: #4a5568;
        }
        .receipt-subtitle {
          color: #718096;
          margin: 5px 0 0;
          font-size: 16px;
        }
        .receipt-data {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .receipt-label {
          font-weight: bold;
          color: #4a5568;
        }
        .receipt-value {
          color: #718096;
        }
        .receipt-amount {
          font-size: 24px;
          color: #38a169;
          font-weight: bold;
        }
        .thank-you {
          text-align: center;
          margin: 30px 0;
          font-size: 18px;
          color: #4a5568;
        }
        .footer {
          text-align: center;
          padding: 20px 0;
          font-size: 12px;
          color: #718096;
          border-top: 1px solid #eee;
          margin-top: 30px;
        }
        .tax-info {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          font-size: 14px;
        }
        .cta-button {
          display: inline-block;
          background-color: #38a169;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 5px;
          font-weight: bold;
          margin-top: 15px;
        }
        .social-links {
          margin-top: 20px;
          text-align: center;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #4a5568;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Pet Haven</h1>
          <p>Making a difference for animals in need</p>
        </div>
        
        <p>Dear ${donorName},</p>
        
        <p>Thank you for your generous donation to Pet Haven! Your support helps us continue our mission to rescue, rehabilitate, and rehome animals in need.</p>
        
        <div class="receipt-box">
          <div class="receipt-header">
            <h2 class="receipt-title">Donation Receipt</h2>
            <p class="receipt-subtitle">Tax Receipt #${receiptNumber}</p>
          </div>
          
          <div class="receipt-data">
            <span class="receipt-label">Date:</span>
            <span class="receipt-value">${donationDate}</span>
          </div>
          
          <div class="receipt-data">
            <span class="receipt-label">Donor Name:</span>
            <span class="receipt-value">${donorName}</span>
          </div>
          
          <div class="receipt-data">
            <span class="receipt-label">Donation Type:</span>
            <span class="receipt-value">${donationType}</span>
          </div>
          
          <div class="receipt-data">
            <span class="receipt-label">Fund:</span>
            <span class="receipt-value">${fundDisplayName}</span>
          </div>
          
          <div class="receipt-data">
            <span class="receipt-label">Amount:</span>
            <span class="receipt-value receipt-amount">${formattedAmount}</span>
          </div>
          
          ${donation.isMonthly ? `
          <div class="receipt-data">
            <span class="receipt-label">Subscription ID:</span>
            <span class="receipt-value">${donation.subscriptionId}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="tax-info">
          <p>Pet Haven is a registered non-profit organization. Your donation may be tax-deductible to the extent allowed by law. Please save this receipt for your tax records.</p>
          <p>Tax ID: 12-3456789</p>
        </div>
        
        <div class="thank-you">
          <p>Your generosity makes a real difference!</p>
          <p>With gratitude,<br>The Pet Haven Team</p>
          
          <a href="https://pethaven.org/impact" class="cta-button">See Your Impact</a>
        </div>
        
        <div class="footer">
          <p>Pet Haven | 123 Animal Way, Mumbai, Maharashtra 400001</p>
          <p>Phone: +91 98765 43210 | Email: info@pethaven.org</p>
          
          <div class="social-links">
            <a href="https://facebook.com/pethaven">Facebook</a> | 
            <a href="https://twitter.com/pethaven">Twitter</a> | 
            <a href="https://instagram.com/pethaven">Instagram</a>
          </div>
          
          <p>If you have any questions about your donation, please contact us at donations@pethaven.org</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    // Send email
    const info = await transporter.sendMail({
      from: `"Pet Haven" <${process.env.EMAIL_FROM}>`,
      to: donation.email,
      subject: emailSubject,
      html: emailHtml
    });
    
    console.log('Donation receipt email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending donation receipt email:', error);
    throw error;
  }
};

export { sendDonationReceipt };