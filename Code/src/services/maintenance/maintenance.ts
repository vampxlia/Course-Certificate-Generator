import {CertificateDAO} from "../../dao/implementations/local/certificateDAO";
import {Certificate} from "../../model/certificate";
import {MAX_REPOSITORY_SIZE_BYTES, REPOSITORY_MAX_USE_PERCENTAGE} from "../../configs/certificates/certificateDB";

const dao = new CertificateDAO();

export type DateSortOrder = 'oldest' | 'newest';
export type NumberSortOrder = 'increasing' | 'decreasing';

export async function getMaintenanceData(sortParam: string, courseId?: number) {
    let files = await dao.getAllCertificates();
    let sortOrder: DateSortOrder | NumberSortOrder = 'newest';

    // 1. Filter first (efficient)
    if (courseId !== undefined && !Number.isNaN(courseId)) {
        files = files.filter(f => f.extractCourseId() === courseId);
    }

    // 2. Sort second
    if (sortParam === 'oldest' || sortParam === 'newest') {
        sortOrder = sortParam as DateSortOrder;
        files = sortCertificates(files, sortOrder);
    } else if (sortParam === 'increasing' || sortParam === 'decreasing') {
        sortOrder = sortParam as NumberSortOrder;
        files = sortCertificatesByNumber(files, sortOrder);
    } else {
        files = sortCertificates(files, 'newest');
    }

    return { files, sortOrder };
}

export async function getUsedBytes(){
    return await dao.getAllCertificatesSize();
}

export async function getUsedPercentageBytes(bytes: number){
    return Math.min((bytes / MAX_REPOSITORY_SIZE_BYTES) * 100, 100);
}

export async function getCertificateByName(name: string): Promise<Certificate[]> {
    const certificate = await dao.getCertificateByName(name);
    return certificate ? [certificate] : [];
}
function sortCertificates(certificates: Certificate[], sortOrder: DateSortOrder): Certificate[] {
    return [...certificates].sort((a, b) => {
        return sortOrder === 'oldest'
            ? a.modifiedAt - b.modifiedAt
            : b.modifiedAt - a.modifiedAt;
    });
}

export async function deleteCertificates(certificates: Certificate[]): Promise<boolean> {
    let allSuccessful = true;
    for (const file of certificates) {
        const isDeleted = await dao.deleteCertificate(file);
        if (isDeleted) {
            console.log(`Deleted file: ${file.name}`);
        } else {
            allSuccessful = false;
        }
    }
    return allSuccessful;
}
function sortCertificatesByNumber(certificates: Certificate[], sortOrder: NumberSortOrder): Certificate[] {
    return [...certificates].sort((a, b) => {
        const numA = a.extractStudentNumber();
        const numB = b.extractStudentNumber();

        if (Number.isNaN(numA) || Number.isNaN(numB)) return 0;

        return sortOrder === 'increasing' ? numA - numB : numB - numA;
    });
}

export async function getCertificatesBeforeStudentNumber(studentNumber: string): Promise<Certificate[]> {
    const cutoff = parseInt(studentNumber, 10);
    if (Number.isNaN(cutoff)) return [];
    return dao.getCertificatesBeforeStudentNumber(cutoff);
}

export async function getCertificatesByCourse(courseId: number | string): Promise<Certificate[]> {
    const parsedId = parseInt(String(courseId), 10);
    if (Number.isNaN(parsedId)) return [];
    return dao.getCertificatesByCourse(parsedId);
}

export async function getCertificatesBeforeDate(date: string | Date): Promise<Certificate[]> {
    const cutoff = new Date(date);
    if (isNaN(cutoff.getTime())) return [];
    return dao.getCertificatesBeforeDate(cutoff);
}

export async function deleteCertificatesUntilThreshold() {
    while (await getUsedPercentageBytes(await getUsedBytes()) > REPOSITORY_MAX_USE_PERCENTAGE) {
        const deleted = await dao.deleteOldestCertificate();
        if (!deleted) {
            break;
        }
    }
}

export function initStorageMaintenanceTask() {
    const THIRTY_MINUTES = 30 * 60 * 1000;

    setInterval(async () => {
        try {
            await deleteCertificatesUntilThreshold();
        } catch (error) {
            console.error('Periodic storage cleanup failed:', error);
        }
    }, THIRTY_MINUTES);
}