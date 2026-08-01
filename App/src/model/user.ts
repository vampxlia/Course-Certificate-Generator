// my_code
export enum userRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export class User {
    id: number;
    employeeName: string;
    email: String;
    role: userRole;

    constructor(id: number, email: string, employeeName: string, role: userRole) {
        this.id = id;
        this.email = email;
        this.employeeName = employeeName;
        this.role = role;
    }
}