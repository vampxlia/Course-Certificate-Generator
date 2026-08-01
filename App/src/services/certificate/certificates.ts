// my_code
import { generatePdfCertificates } from './generator';
import { sendUserCertificateEmail } from './sendEmail';
import {ICourseDAO} from "../../dao/interfaces/ICourseDAO";
import {IStudentDAO} from "../../dao/interfaces/IStudentDAO";
import {TemplateDAO} from "../../dao/implementations/local/templateDAO";
import {CertificateDAO} from "../../dao/implementations/local/certificateDAO";
import {Student} from "../../model/student";
import {sqlCourseDAO} from "../../dao/implementations/sql/sqlCourseDAO";
import {sqlStudentDAO} from "../../dao/implementations/sql/sqlStudentDAO";

const studentDao: IStudentDAO = new sqlStudentDAO();
const courseDao: ICourseDAO = new sqlCourseDAO();
const templateDao = new TemplateDAO();
const certificateDao = new CertificateDAO();

export async function getFiltersData() {
    const courses = await courseDao.getAllCourses();
    return { courses };
}

/**
 * Returns students annotated with a `hasPdf` flag indicating whether their
 * certificate PDF already exists on disk.
 */
export async function getStudentsWithPdfStatus(courseId?: number, year?: number): Promise<(Student & { hasPdf: boolean })[]> {
    const students = await studentDao.getEligibleStudents({ courseId, year });
    const existingCerts = await certificateDao.getAllCertificates();
    const existingFileNames = new Set(existingCerts.map(c => c.name));

    return students.map(student => {
        // Create a proxy object that extends Student with hasPdf
        return Object.assign(Object.create(Object.getPrototypeOf(student)), student, {
            hasPdf: existingFileNames.has(student.certificateFileName)
        });
    });
}

export async function processCertificates(studentIds: number[], templateId: number) {
    if (!studentIds || studentIds.length === 0) {
        throw new Error("No students selected for generation.");
    }

    // 1. Fetch the template
    const template = await templateDao.getTemplateById(templateId);
    if (!template) {
        throw new Error(`Template not found with ID ${templateId}`);
    }

    // 2. Fetch the full Student objects from the database using their IDs
    const students = await studentDao.getStudentsByIds(studentIds);

    // 3. Pass the validated objects and layout into PDF generator
    await generatePdfCertificates(students, template.layout);

    return students;
}

/**
 * Sends certificate emails to selected students.
 * Only sends to students whose PDF has already been generated.
 * Returns a summary of which students received emails and which were skipped.
 */
export async function sendCertificateEmails(studentIds: number[]): Promise<{ sent: Student[]; skipped: Student[]; errors: { student: Student; message: string }[] }> {
    if (!studentIds || studentIds.length === 0) {
        throw new Error("No students selected for emailing.");
    }

    const students = await studentDao.getStudentsByIds(studentIds);
    const sent: Student[] = [];
    const skipped: Student[] = [];
    const errors: { student: Student; message: string }[] = [];

    for (const student of students) {
        const certificate = await certificateDao.getCertificateByStudent(student);
        if (!certificate) {
            skipped.push(student);
            continue;
        }
        try {
            await sendUserCertificateEmail(student, certificate.path);
            sent.push(student);
        } catch (error: any) {
            console.error(`Error sending email to ${student.email}: ${error}`);
            errors.push({ student, message: error?.message || String(error) });
        }
    }

    return { sent, skipped, errors };
}