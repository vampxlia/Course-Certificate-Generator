import {Course} from "../../model/course";

export interface ICourseDAO {
    getCourseById(id: number): Promise<Course | null>;
    getCourseByName(name: string): Promise<Course | null>;
    getAllCourses(): Promise<Course[]>;
}