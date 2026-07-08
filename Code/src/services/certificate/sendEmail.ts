import nodemailer, { SendMailOptions } from 'nodemailer';
import { Student } from "../../model/student";
import { CertificateDAO } from "../../dao/implementations/local/certificateDAO";
import settings from "../../configs/email"

const dao = new CertificateDAO();

/**
 * Creates a fresh nodemailer transporter from the current email settings.
 * Called per-send so any settings change takes effect immediately without restart.
 */
function createTransporter() {
    if (!settings.EMAIL_HOST || !settings.EMAIL_USER || !settings.EMAIL_PASSWORD) {
        throw new Error(
            "Email não configurado."
        );
    }

    return nodemailer.createTransport({
        host: settings.EMAIL_HOST,
        port: settings.EMAIL_PORT,
        secure: settings.EMAIL_PORT === 465, // true for port 465, false for others (STARTTLS)
        auth: {
            user: settings.EMAIL_USER,
            pass: settings.EMAIL_PASSWORD,
        },
    });
}

export const sendUserCertificateEmail = async (student: Student, filePath?: string): Promise<void> => {
    const certificate = await dao.getCertificateByStudent(student);
    if (certificate == null) { return; }

    const transporter = createTransporter(); // throws if not configured

    const mailOptions: SendMailOptions = {
        from: settings.EMAIL_SENDER,
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