// my_code

export class Course {
    private readonly _id: number;
    private readonly _name: string;
    private readonly _startDate: string;
    private readonly _endDate: string;

    constructor(id: number, name: string, startDate: string, endDate: string) {
        this._id = id;
        this._name = name;
        this._startDate = startDate;
        this._endDate = endDate;
    }

    public get id (): number {
        return this._id;
    }

    public get name() : string {
        return this._name;
    }

    public get startDate() : string {
        return this._startDate;
    }

    public get endDate() : string {
        return this._endDate;
    }
}