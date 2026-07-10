// my_code
import nodemailer, { SendMailOptions } from 'nodemailer';
import { Student } from "../../model/student";
import { CertificateDAO } from "../../dao/implementations/local/certificateDAO";
import {emailConfig} from "../../configs/email";

const dao = new CertificateDAO();

/**
 * Creates a fresh nodemailer transporter from the current email settings.
 * Called per-send so any settings change takes effect immediately without restart.
 */
function createTransporter() {
    if (!emailConfig.settings.host || !emailConfig.settings.user || !emailConfig.settings.password) {
        throw new Error(
            "Email configuration Error"
        );
    }

    return nodemailer.createTransport({
        host: emailConfig.settings.host,
        port: emailConfig.settings.port,
        secure: emailConfig.settings.port === 465, // true for port 465, false for others (STARTTLS)
        auth: {
            user: emailConfig.settings.user,
            pass: emailConfig.settings.password,
        },
    });
}

export const sendUserCertificateEmail = async (student: Student, filePath?: string): Promise<void> => {
    const certificate = await dao.getCertificateByStudent(student);
    if (certificate == null) { return; }

    const transporter = createTransporter(); // throws if not configured

    const mailOptions: SendMailOptions = {
        from: emailConfig.settings.sender,
        to: student.email,
        subject: `Certificado ${student.name}!`,
        html: `
  <!DOCTYPE html>
  <html>
    <body>
      <h1>O seu certificado foi gerado com sucesso, ${student.name}!</h1>
      <p>Em anexo, encontra-se o seu certificado do curso ${student.course.name}!</p>
    </body>
  </html>`,
        attachments: [
            {
                filename: student.certificateFileName,
                path: filePath || certificate.path,
            }
        ]
    };

    // Let errors propagate – the caller is responsible for handling them.
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${student.email}!`);
};