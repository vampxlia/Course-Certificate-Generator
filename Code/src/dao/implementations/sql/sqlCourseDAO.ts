
import {Pool, RowDataPacket} from "mysql2/promise";
import {ICourseDAO} from "../../interfaces/ICourseDAO";
import {Course} from "../../../model/course";
import {getInstitutionDbPool} from "../../../configs/db";

export class sqlCourseDAO implements ICourseDAO {
    private db: Pool = getInstitutionDbPool();

    /**
     * Retrieves a course by its ID (codigo_curso).
     * Note: Interface strictly says `Course | null`, but DB operations require `Promise`.
     */
    public async getCourseById(id: number): Promise<Course | null> {
        const query = `
            SELECT codigo_curso, nome_curso, data_inicio, data_fim 
            FROM cursos 
            WHERE codigo_curso = ? 
            LIMIT 1
        `;

        const [rows] = await this.db.execute<RowDataPacket[]>(query, [id]);

        if (rows.length === 0) {
            return null;
        }

        return this.mapRowToCourse(rows[0]);
    }

    /**
     * Retrieves a course by its name.
     */
    public async getCourseByName(name: string): Promise<Course | null> {
        const query = `
            SELECT codigo_curso, nome_curso, data_inicio, data_fim 
            FROM cursos 
            WHERE nome_curso = ? 
            LIMIT 1
        `;

        const [rows] = await this.db.execute<RowDataPacket[]>(query, [name]);

        if (rows.length === 0) {
            return null;
        }

        return this.mapRowToCourse(rows[0]);
    }

    /**
     * Retrieves all courses from the database.
     */
    public async getAllCourses(): Promise<Course[]> {
        const query = `
            SELECT codigo_curso, nome_curso, data_inicio, data_fim 
            FROM cursos
        `;

        const [rows] = await this.db.execute<RowDataPacket[]>(query);

        return rows.map(row => this.mapRowToCourse(row));
    }

    /**
     * Helper method to map a SQL row to a Course object.
     * Extracts date conversion logic to keep methods clean.
     */
    private mapRowToCourse(row: RowDataPacket): Course {
        // Convert JS Date objects from the database to "YYYY-MM-DD" strings
        const startDateStr = (row.data_inicio as Date).toISOString().split('T')[0];
        const endDateStr = (row.data_fim as Date).toISOString().split('T')[0];

        return new Course(
            row.codigo_curso,
            row.nome_curso,
            startDateStr,
            endDateStr
        );
    }
}