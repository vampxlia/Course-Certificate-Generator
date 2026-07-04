import path from "path";
import fs from "fs/promises";
import {Student} from "../../../model/student";
import {CERTIFICATE_REPOSITORY_DIR} from "../../../configs/localRepository";
import {Certificate} from "../../../model/certificate";

export class CertificateDAO {

    // Extracted helper method to centralize file reading and object instantiation
    private async createCertificateFromFile(fileName: string): Promise<Certificate | null> {
        try {
            const filePath = path.join(CERTIFICATE_REPOSITORY_DIR, fileName);
            const stats = await fs.stat(filePath);
            return new Certificate(fileName, filePath, stats.birthtime, stats.birthtimeMs);
        } catch (error) {
            return null;
        }
    }

    private async getCertificateSize(fileName: string): Promise<number> {
        const file = path.join(CERTIFICATE_REPOSITORY_DIR, fileName);
        const stats = await fs.stat(file);
        if (stats.isFile()) {
            return stats.size;
        }
        return 0;
    }

    async getAllCertificatesSize(): Promise<number> {
        let size = 0;
        try {
            const files = await fs.readdir(CERTIFICATE_REPOSITORY_DIR);
            for (const file of files) {
                size += await this.getCertificateSize(file);
            }
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                console.warn(`Repository directory not found. Assuming size is 0 bytes.`);
                return 0;
            }
            console.error("Error calculating repository size:", error);
            throw error;
        }
        return size;
    }

    async getCertificateByStudent(student: Student): Promise<Certificate | null> {
        return this.createCertificateFromFile(student.certificateFileName);
    }

    async getCertificateByName(fileName: string): Promise<Certificate | null> {
        return this.createCertificateFromFile(fileName);
    }

    async getAllCertificates(): Promise<Certificate[]> {
        try {
            const files = await fs.readdir(CERTIFICATE_REPOSITORY_DIR);

            const certificates = await Promise.all(
                files.map(fileName => this.createCertificateFromFile(fileName))
            );

            // Filter out any nulls in case a file was deleted between readdir and stat
            return certificates.filter((cert): cert is Certificate => cert !== null);
        } catch (error) {
            console.error("Error reading output directory:", error);
            return [];
        }
    }

    async deleteCertificate(certificate: Certificate): Promise<boolean> {
        try {
            const filePath = path.join(CERTIFICATE_REPOSITORY_DIR, certificate.name);
            await fs.unlink(filePath);
            return true;
        } catch (error) {
            console.error(`Error deleting ${certificate.name}:`, error);
            return false;
        }
    }

    async getCertificatesByCourse(courseId: number): Promise<Certificate[]> {
        const files = await this.getAllCertificates();
        return files.filter(f => {
            const cid = f.extractCourseId();
            return !Number.isNaN(cid) && cid === courseId;
        });
    }

    async getCertificatesBeforeDate(cutoffDate: Date): Promise<Certificate[]> {
        const files = await this.getAllCertificates();
        return files.filter(file => file.createdAt < cutoffDate);
    }

    async getCertificatesBeforeStudentNumber(cutOff: number): Promise<Certificate[]> {
        const files = await this.getAllCertificates();
        return files.filter(file => {
            const num = file.extractStudentNumber();
            return !Number.isNaN(num) && num < cutOff;
        });
    }

    async deleteOldestCertificate(): Promise<boolean> {
        try {
            const certificates = await this.getAllCertificates();

            // If the repository is empty, there is nothing to delete
            if (certificates.length === 0) {
                return false;
            }

            // Sort certificates by ascending creation date (oldest first)
            certificates.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

            const oldestCertificate = certificates[0];
            return await this.deleteCertificate(oldestCertificate);
        } catch (error) {
            console.error("Error finding or deleting the oldest certificate:", error);
            return false;
        }
    }
}