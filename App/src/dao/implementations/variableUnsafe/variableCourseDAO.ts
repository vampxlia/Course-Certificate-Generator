import {ICourseDAO} from "../../interfaces/ICourseDAO";
import {Course} from "../../../model/course";

export const sampleCourse1 = new Course(101, 'Curso de Teste 1', '2025-01-01', '2025-06-30');
export const sampleCourse2 = new Course(102, 'Curso de Teste 2', '2025-01-01', '2025-06-30');

export class VariableCourseDAO implements ICourseDAO {
    getAllCourses(): Promise<Course[]> {
        return Promise.resolve([sampleCourse1, sampleCourse2]);
    }

    // @ts-ignore
    getCourseById(id: number): Course | null{
        if (id === sampleCourse1.id) return sampleCourse1;
        if (id === sampleCourse2.id) return sampleCourse2;
        return null;
    }

    // @ts-ignore
    getCourseByName(name: string): Course | null{
        if (name === sampleCourse1.name) return sampleCourse1;
        if (name === sampleCourse2.name) return sampleCourse2;
        return null;
    }

}