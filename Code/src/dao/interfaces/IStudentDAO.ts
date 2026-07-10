// my_code
import {Student} from "../../model/student";

export interface IStudentDAO {
    getStudentsByIds(studentIds: number[]): Promise<Student[]>;
    // Fetches students who have completed their course, optionally filtered
    getEligibleStudents(filters: { courseId?: number; year?: number }): Promise<Student[]>;
}