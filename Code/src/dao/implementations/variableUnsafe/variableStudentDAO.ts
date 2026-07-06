import {IStudentDAO} from "../../interfaces/IStudentDAO";
import {Student} from "../../../model/student";
import {sampleCourse1, sampleCourse2} from "./variableCourseDAO";

//TODO: Incluir a data de inicio e conclusão de curso (temos de ver melhor como isso estaria numa BD)
// Create 16 students and split them evenly between the two sample courses
const TOTAL = 16;
const sampleStudents = Array.from({ length: TOTAL }, (_, index) => {
    const course = index < TOTAL / 2 ? sampleCourse1 : sampleCourse2;
    return new Student(9001 + index, `Aluno de Teste ${index + 1}`, `teste${index + 1}@example.com`, course, 14);
});


export class VariableStudentDAO implements IStudentDAO {
    getEligibleStudents(filters: { courseId?: number; year?: number }): Promise<Student[]> {
        //TODO: filtrar por data
        return Promise.resolve(sampleStudents.filter(student => {
            return !(filters.courseId && student.course.id != filters.courseId);

        }));
    }

    getStudentsByIds(studentIds: number[]): Promise<Student[]> {
        return Promise.resolve(sampleStudents.filter(student => studentIds.includes(student.id)));
    }
}