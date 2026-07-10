
import { Pool, RowDataPacket } from "mysql2/promise";
import {IStudentDAO} from "../../interfaces/IStudentDAO";
import {Student} from "../../../model/student";
import {Course} from "../../../model/course";
import {getInstitutionDbPool} from "../../../configs/db";

export class sqlStudentDAO implements IStudentDAO {

    /**
     * Reusable base query to fetch a Student, their associated Course,
     * and their highest grade (nota) for that specific course edition.
     */
    private get baseQuery(): string {
        return `
            SELECT 
                a.codigo_aluno, a.nome AS nome_aluno, a.email,
                c.codigo_curso, c.nome_curso, c.data_inicio, c.data_fim,
                COALESCE(MAX(av.nota), 0) AS nota_final
            FROM alunos a
            INNER JOIN cursos c 
                ON a.codigo_curso = c.codigo_curso AND a.edicao_curso = c.edicao_curso
            LEFT JOIN avaliacoes av 
                ON a.codigo_aluno = av.codigo_aluno 
                AND a.codigo_curso = av.codigo_curso 
                AND a.edicao_curso = av.edicao_curso
        `;
    }

    public async getStudentsByIds(studentIds: number[]): Promise<Student[]> {
        if (studentIds.length === 0) return [];

        // Create placeholders (?, ?, ?) based on array length to prevent SQL injection
        const placeholders = studentIds.map(() => '?').join(',');

        const query = `
            ${this.baseQuery}
            WHERE a.codigo_aluno IN (${placeholders})
            GROUP BY a.codigo_aluno, a.nome, a.email, c.codigo_curso, c.nome_curso, c.data_inicio, c.data_fim
        `;

        const [rows] = await getInstitutionDbPool().execute<RowDataPacket[]>(query, studentIds);
        return rows.map(row => this.mapRowToStudent(row));
    }

    public async getEligibleStudents(filters: { courseId?: number; year?: number }): Promise<Student[]> {
        let query = this.baseQuery;
        const params: any[] = [];
        const conditions: string[] = [];

        // Apply dynamic filters
        if (filters.courseId) {
            conditions.push("a.codigo_curso = ?");
            params.push(filters.courseId);
        }

        // Year maps to edicao_curso in the database
        if (filters.year) {
            conditions.push("a.edicao_curso = ?");
            params.push(filters.year);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        // Group the results and filter by the grade requirement (>= 10)
        query += `
            GROUP BY a.codigo_aluno, a.nome, a.email, c.codigo_curso, c.nome_curso, c.data_inicio, c.data_fim
            HAVING nota_final >= 10
        `;

        const [rows] = await getInstitutionDbPool().execute<RowDataPacket[]>(query, params);
        return rows.map(row => this.mapRowToStudent(row));
    }

    /**
     * Helper method to map a SQL row to a Student object (and its nested Course).
     */
    private mapRowToStudent(row: RowDataPacket): Student {
        // Convert JS Date objects to "YYYY-MM-DD"
        const startDateStr = (row.data_inicio as Date).toISOString().split('T')[0];
        const endDateStr = (row.data_fim as Date).toISOString().split('T')[0];

        // Construct the nested Course object first
        const course = new Course(
            row.codigo_curso,
            row.nome_curso,
            startDateStr,
            endDateStr
        );

        // Construct and return the full Student object
        return new Student(
            row.codigo_aluno,
            row.nome_aluno,
            row.email,
            course,
            Number(row.nota_final)
        );
    }
}