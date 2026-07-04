import {CertificateDAO} from "../../dao/implementations/local/certificateDAO";
import {Certificate} from "../../model/certificate";
import {getRepositorySettings} from "../../configs/certificates/certificateDB";

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
    const maxRepositorySize = getRepositorySettings().maxSizeBites
    return Math.min((bytes / maxRepositorySize) * 100, 100);
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
    const maxUsePercentage = getRepositorySettings().maxUsePercentage;
    while (await getUsedPercentageBytes(await getUsedBytes()) > maxUsePercentage) {
        const deleted = await dao.deleteOldestCertificate();
        if (!deleted) {
            break;
        }
    }
}

export async function willOverflowStorage(estimatedNewBytes: number): Promise<boolean> {
    const currentSize = await dao.getAllCertificatesSize();
    const maxRepositorySize = getRepositorySettings().maxSizeBites
    return (currentSize + estimatedNewBytes) > maxRepositorySize;
}