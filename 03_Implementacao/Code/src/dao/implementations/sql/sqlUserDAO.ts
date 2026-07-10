import { IUserDAO } from "../../interfaces/IUserDAO";
import { User, userRole } from "../../../model/user";
import {RowDataPacket, ResultSetHeader, Pool} from "mysql2/promise";
import {getAuthDbPool} from "../../../configs/db";

interface EmployeeJoinRow extends RowDataPacket {
    EmployeeID: number;
    Email: Buffer; // Since VARBINARY comes over as a Node Buffer
    FirstName: string;
    LastName: string;
    Role: string;
    Password?: Buffer;
}

export class SqlUserDAO implements IUserDAO {
    async getUser(email: string): Promise<User | null> {
        const query = `
            SELECT
                e.EmployeeID,
                c.Email,
                e.FirstName,
                e.LastName,
                e.Role
            FROM Credentials c
                     INNER JOIN Employees e ON c.ID = e.EmployeeID
            WHERE c.Email = ?
                LIMIT 1
        `;

        try {
            const [rows] = await getAuthDbPool().execute<EmployeeJoinRow[]>(query, [email.trim()]);

            if (rows.length === 0) {
                return null;
            }

            const dbEmployee = rows[0];
            const fullName = `${dbEmployee.FirstName} ${dbEmployee.LastName}`;
            const stringEmail = dbEmployee.Email.toString('utf8');
            const validatedRole = dbEmployee.Role as keyof typeof userRole;

            return new User(dbEmployee.EmployeeID, stringEmail, fullName, userRole[validatedRole]);
        } catch (error) {
            console.error("Database error inside getUser:", error);
            throw new Error("Data retrieval transaction failed.");
        }
    }

    async getPassword(email: string): Promise<string | null> {
        const query = `
            SELECT Password
            FROM Credentials
            WHERE Email = ?
                LIMIT 1
        `;

        try {
            const [rows] = await getAuthDbPool().execute<EmployeeJoinRow[]>(query, [email.trim()]);

            if (rows.length === 0) {
                return null;
            }

            const passwordBuffer = rows[0].Password;
            return passwordBuffer ? passwordBuffer.toString('utf8') : null;
        } catch (error) {
            console.error("Database error inside getCredentialPassword:", error);
            throw new Error("Credential resolution transaction failed.");
        }
    }

    async getAllUsers(): Promise<User[]> {
        const query = `
            SELECT
                e.EmployeeID,
                c.Email,
                e.FirstName,
                e.LastName,
                e.Role
            FROM Employees e
            INNER JOIN Credentials c ON c.ID = e.EmployeeID
            ORDER BY e.EmployeeID ASC
        `;

        try {
            const [rows] = await getAuthDbPool().execute<EmployeeJoinRow[]>(query);
            return rows.map(row => {
                const fullName = `${row.FirstName} ${row.LastName}`;
                const email = Buffer.isBuffer(row.Email) ? row.Email.toString('utf8') : String(row.Email);
                const validatedRole = row.Role as keyof typeof userRole;
                return new User(row.EmployeeID, email, fullName, userRole[validatedRole]);
            });
        } catch (error) {
            console.error("Database error inside getAllUsers:", error);
            throw new Error("Data retrieval transaction failed.");
        }
    }

    async getUserById(id: number): Promise<User | null> {
        const query = `
            SELECT
                e.EmployeeID,
                c.Email,
                e.FirstName,
                e.LastName,
                e.Role
            FROM Employees e
            INNER JOIN Credentials c ON c.ID = e.EmployeeID
            WHERE e.EmployeeID = ?
            LIMIT 1
        `;

        try {
            const [rows] = await getAuthDbPool().execute<EmployeeJoinRow[]>(query, [id]);

            if (rows.length === 0) return null;

            const row = rows[0];
            const fullName = `${row.FirstName} ${row.LastName}`;
            const email = Buffer.isBuffer(row.Email) ? row.Email.toString('utf8') : String(row.Email);
            const validatedRole = row.Role as keyof typeof userRole;

            return new User(row.EmployeeID, email, fullName, userRole[validatedRole]);
        } catch (error) {
            console.error("Database error inside getUserById:", error);
            throw new Error("Data retrieval transaction failed.");
        }
    }

    async createUser(firstName: string, lastName: string, email: string, hashedPassword: string, role: userRole): Promise<void> {
        const conn = await getAuthDbPool().getConnection();
        try {
            await conn.beginTransaction();

            const [empResult] = await conn.execute<ResultSetHeader>(
                `INSERT INTO Employees (FirstName, LastName, Role) VALUES (?, ?, ?)`,
                [firstName.trim(), lastName.trim(), role]
            );

            const newId = empResult.insertId;

            await conn.execute(
                `INSERT INTO Credentials (ID, Email, Password) VALUES (?, ?, ?)`,
                [newId, email.trim(), hashedPassword]
            );

            await conn.commit();
        } catch (error) {
            await conn.rollback();
            console.error("Database error inside createUser:", error);
            throw new Error("User creation transaction failed.");
        } finally {
            conn.release();
        }
    }

    async updateUser(id: number, firstName: string, lastName: string, email: string, role: userRole, hashedPassword?: string): Promise<void> {
        const conn = await getAuthDbPool().getConnection();
        try {
            await conn.beginTransaction();

            await conn.execute(
                `UPDATE Employees SET FirstName = ?, LastName = ?, Role = ? WHERE EmployeeID = ?`,
                [firstName.trim(), lastName.trim(), role, id]
            );

            if (hashedPassword) {
                await conn.execute(
                    `UPDATE Credentials SET Email = ?, Password = ? WHERE ID = ?`,
                    [email.trim(), hashedPassword, id]
                );
            } else {
                await conn.execute(
                    `UPDATE Credentials SET Email = ? WHERE ID = ?`,
                    [email.trim(), id]
                );
            }

            await conn.commit();
        } catch (error) {
            await conn.rollback();
            console.error("Database error inside updateUser:", error);
            throw new Error("User update transaction failed.");
        } finally {
            conn.release();
        }
    }

    async deleteUser(id: number): Promise<void> {
        const conn = await getAuthDbPool().getConnection();
        try {
            await conn.beginTransaction();

            // Delete credentials first (FK constraint)
            await conn.execute(`DELETE FROM Credentials WHERE ID = ?`, [id]);
            await conn.execute(`DELETE FROM Employees WHERE EmployeeID = ?`, [id]);

            await conn.commit();
        } catch (error) {
            await conn.rollback();
            console.error("Database error inside deleteUser:", error);
            throw new Error("User deletion transaction failed.");
        } finally {
            conn.release();
        }
    }
}