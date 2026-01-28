const GetVerificationTemplate = (verificationCode) => {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background-color: #000000; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; }
        .content { padding: 40px; text-align: center; line-height: 1.6; color: #333333; }
        .code-container { margin: 30px 0; padding: 20px; background-color: #f4f4f4; border-radius: 4px; }
        .verification-code { font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #000000; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #999999; }
        .divider { height: 1px; background-color: #eeeeee; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Creatify Me</h1>
        </div>
        <div class="content">
            <h2>Verify your email</h2>
            <p>Thank you for joining us. Please use the verification code below to complete your registration. This code will expire in 10 minutes.</p>
            
            <div class="code-container">
                <span class="verification-code">${verificationCode}</span>
            </div>

            <p>If you didn't request this, you can safely ignore this email.</p>
            <div class="divider"></div>
            <p>Welcome to the community!</p>
        </div>
        <div class="footer">
            &copy; 2026 CreatifyMeWeb.com. All rights reserved.
        </div>
    </div>
</body>
</html>`
}

const GetResetPasswordTemplate = (resetCode) => {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background-color: #000000; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; }
        .content { padding: 40px; text-align: center; line-height: 1.6; color: #333333; }
        .code-container { margin: 30px 0; padding: 20px; background-color: #f4f4f4; border-radius: 4px; }
        .reset-code { font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #d9534f; } /* Reddish color for security actions */
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #999999; }
        .divider { height: 1px; background-color: #eeeeee; margin: 20px 0; }
        .warning { font-size: 13px; color: #666666; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Creatify Me</h1>
        </div>
        <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset the password for your account. Use the code below to proceed. This code is valid for <strong>10 minutes</strong>.</p>
            
            <div class="code-container">
                <span class="reset-code">${resetCode}</span>
            </div>

            <p class="warning">For your security, never share this code with anyone. Our team will never ask for this code over the phone or via chat.</p>
            
            <div class="divider"></div>
            
            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns about your account security.</p>
        </div>
        <div class="footer">
            &copy; 2026 CreatifyMeWeb.com. All rights reserved.
        </div>
    </div>
</body>
</html>`;
};

module.exports = { GetVerificationTemplate, GetResetPasswordTemplate };