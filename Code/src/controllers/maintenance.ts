// my_code
import { Request, Response } from 'express';
import {
    deleteCertificates,
    getCertificatesBeforeDate,
    getCertificatesBeforeStudentNumber,
    getCertificatesByCourse,
    getCertificateByName, getMaintenanceData, getUsedBytes, getUsedPercentageBytes
} from "../services/maintenance/maintenance";
import { getFiltersData } from '../services/certificate/certificates';
import {Certificate} from "../model/certificate";
import path from "path";
import {CERTIFICATE_REPOSITORY_DIR} from "../configs/localRepository";
import {getRepositorySettings} from "../configs/certificates/certificateDB";


export const getMaintenancePage = async (req: Request, res: Response) => {
    const sortParam = String(req.query.sort || 'newest');
    const courseIdQuery = req.query.courseId as string | undefined;
    const courseId = courseIdQuery ? parseInt(courseIdQuery, 10) : undefined;

    // Delegate business rules entirely to the service layer
    const { files, sortOrder } = await getMaintenanceData(sortParam, courseId);
    const { courses } = await getFiltersData();

    const currentSizeBytes = await getUsedBytes();
    const maxSizeBytes = getRepositorySettings().maxSizeBites;
    const usagePercentage = await getUsedPercentageBytes(currentSizeBytes);

    res.render('maintenance', {
        files,
        sortOrder,
        sortParam,
        courses,
        selectedCourseId: courseIdQuery,
        maxSizeBytes,
        currentSizeBytes,
        usagePercentage,
    });
};

export const previewCertificate = async (req: Request, res: Response) => {
    const { fileName } = req.params;

    // Construct the absolute path to the file
    if (typeof fileName === "string") {
        const filePath = path.resolve(CERTIFICATE_REPOSITORY_DIR, fileName);
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(`Error serving PDF preview for ${fileName}:`, err);
                res.status(404).send("Certificate file not found or has been deleted.");
            }
        });
    }
};

const createDeletionController = (
    paramName: string,
    getCertificatesFn: (param: string) => Promise<Certificate[]>) => {
    return async (req: Request, res: Response) => {
        const paramValue = req.body[paramName];

        if (!paramValue) {
            return res.status(400).send(`${paramName} is required`);
        }

        const certificates = await getCertificatesFn(paramValue);
        const success = await deleteCertificates(certificates);
        if (success) {
            res.redirect('/admin/maintenance');
        } else {
            res.status(500).send("Failed to delete file(s)");
        }
    };
};

export const deleteNow = createDeletionController(
    'fileName',
    getCertificateByName
);

export const deleteBeforeDate = createDeletionController(
    'deleteBeforeDate',
    getCertificatesBeforeDate
);

export const deleteBeforeStudentNumber = createDeletionController(
    'studentNumber',
    getCertificatesBeforeStudentNumber
);

export const deleteByCourse = createDeletionController(
    'courseId',
    getCertificatesByCourse
);
