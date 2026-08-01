export class Certificate {
    private readonly _name: string
    private readonly _path: string;
    private readonly _createdAt: Date;
    private readonly _modifiedAt: number;

    constructor(name: string, path: string, createdAt: Date, modifiedAt: number) {
        this._name = name;
        this._path = path;
        this._createdAt = createdAt;
        this._modifiedAt = modifiedAt;
    }

    public get name(){
        return this._name;
    }

    public get path(){
        return this._path;
    }

    public get createdAt(){
        return this._createdAt;
    }

    public get modifiedAt(){
        return this._modifiedAt;
    }

    public extractStudentNumber() {
        const parts = this._name.split('_');
        const lastPart = parts[parts.length - 1] ?? '';
        const numberPart = lastPart.replace(/\.[^.]+$/, '');
        return parseInt(numberPart, 10);
    }

    public extractCourseId() {
        const parts = this._name.split('_');
        // pattern: certificado_curso_{courseId}_aluno_{studentId}.pdf
        const coursePart = parts[2] ?? '';
        return parseInt(String(coursePart), 10);
    }
}