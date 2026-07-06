import {Course} from "./course";

export class Student {
    private readonly _id: number;
    private readonly _name: string;
    private readonly _email: string;
    private readonly _course: Course;
    private readonly _grade: number;

    constructor(id: number, name: string, email: string, course: Course, grade: number) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._course = course;
        this._grade = grade;
    }

    public get id (): number {
        return this._id;
    }

    public get name (): string {
        return this._name;
    }

    public get email (): string {
        return this._email;
    }

    public get course(): Course {
        return this._course;
    }

    public get grade (): number {
        return this._grade;
    }

    public get certificateFileName(): string {
        return `certificado_curso_${this.course.id}_aluno_${this.id}.pdf`;
    }

}