import {IUserDAO} from "../../interfaces/IUserDAO";
import {User} from "../../../model/user";
import {userRole} from "../../../model/user";

//this class is just for tests, this method of saving users is too unsafe

const testAdmin = {
    id: 12345,
    firstName: 'John',
    lastName: 'Doe',
    role: 'ADMIN',
}

const testUser = {
    id: 12346,
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'USER',
}

const testAdminCredential = {
    id: testAdmin.id,
    email: 'admin@example.com',
    password: '$2b$10$YSqNH5POiVP8/Zh24e20AuV7sAQ1KtC0o/kevrewWhVsxgVgoFxEK' //admin123
}

const testUserCredential = {
    id: testUser.id,
    email: 'user@example.com',
    password: '$2b$10$YSqNH5POiVP8/Zh24e20AuV7sAQ1KtC0o/kevrewWhVsxgVgoFxEK' //admin123
}

const testUsers = [testAdmin, testUser]
const testCredentials = [testAdminCredential, testUserCredential]


export class VariableUserDAO implements IUserDAO {
    async getUser(email: string): Promise<User | null> {
        for (const credential in testCredentials) {
            if (testCredentials[credential].email === email) {
                const id = testCredentials[credential].id;
                for (const user in testUsers) {
                    if (testUsers[user].id === id) {
                        const name = testUsers[user].firstName + " " + testUsers[user].lastName;
                        const role = testUsers[user].role as keyof typeof userRole;
                        return new User(id, email, name, <userRole>role);
                    }
                }
            }
        }
        return null;
    }

    async getPassword(email: string): Promise<string | null> {
        for (const credential in testCredentials) {
            if (testCredentials[credential].email === email) {
                return testCredentials[credential].password;
            }
        }
        return null;
    }

    async getAllUsers(): Promise<User[]> {
        const users: User[] = [];
        for (const cred of testCredentials) {
            const user = testUsers.find(u => u.id === cred.id);
            if (user) {
                const name = user.firstName + " " + user.lastName;
                users.push(new User(user.id, cred.email, name, user.role as userRole));
            }
        }
        return users;
    }

    async getUserById(id: number): Promise<User | null> {
        const user = testUsers.find(u => u.id === id);
        const cred = testCredentials.find(c => c.id === id);
        if (user && cred) {
            const name = user.firstName + " " + user.lastName;
            return new User(user.id, cred.email, name, user.role as userRole);
        }
        return null;
    }

    async createUser(firstName: string, lastName: string, email: string, hashedPassword: string, role: userRole): Promise<void> {
        const id = Date.now();
        testUsers.push({ id, firstName, lastName, role });
        testCredentials.push({ id, email, password: hashedPassword });
    }

    async updateUser(id: number, firstName: string, lastName: string, email: string, role: userRole, hashedPassword?: string): Promise<void> {
        const userIdx = testUsers.findIndex(u => u.id === id);
        if (userIdx !== -1) {
            testUsers[userIdx] = { id, firstName, lastName, role };
        }
        const credIdx = testCredentials.findIndex(c => c.id === id);
        if (credIdx !== -1) {
            testCredentials[credIdx].email = email;
            if (hashedPassword) {
                testCredentials[credIdx].password = hashedPassword;
            }
        }
    }

    async deleteUser(id: number): Promise<void> {
        const userIdx = testUsers.findIndex(u => u.id === id);
        if (userIdx !== -1) {
            testUsers.splice(userIdx, 1);
        }
        const credIdx = testCredentials.findIndex(c => c.id === id);
        if (credIdx !== -1) {
            testCredentials.splice(credIdx, 1);
        }
    }
}