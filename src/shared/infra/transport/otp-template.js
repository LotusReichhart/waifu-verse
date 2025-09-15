export function buildOtpTemplate({ otp, i18n }) {
    return {
        subject: i18n.otpSubject,
        html: `
        <div style="width:90%; background-color:#f0f2f3; padding:20px; border-radius:15px; font-family:Arial,sans-serif; color:#252f3d;">
            <div style="max-width:400px; margin:0 auto; background-color:#ffffff; border-radius:10px; padding:25px; box-shadow:0 4px 8px rgba(0,0,0,0.05);">
                
                <h2 style="font-size:18px; color:#333; margin-bottom:20px;">${i18n.otpSubject}</h2>

                <p style="margin-bottom:15px; font-size:14px;">${i18n.dearUser},</p>
                <p style="margin-bottom:15px; font-size:14px;">${i18n.yourOTPIsBelow}</p>

                <div style="color:#1d4ed8; font-size:17px; font-weight:bold; letter-spacing:1px; margin-bottom:20px;">
                    ${otp}
                </div>

                <p style="font-size:13px; color:#555; margin-bottom:0;">
                     ${i18n.thisIsAutomatedEmail}
                </p>

                <p style="font-size:12px; color:#555; margin-bottom:0;">
                    ${i18n.thanks},<br>
                    WaifuVerse
                </p>
            </div>
        </div>
        `,
    };
}