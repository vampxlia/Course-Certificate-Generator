export interface TemplateElement {
    id: string;
    type: 'text' | 'placeholder' | 'image';
    content?: string;
    placeholder?: string;
    src?: string;
    x: number;
    y: number;
    fontSize?: number;
    fontFamily?: string;
    fontStyle?: string;
    color?: string;
    width?: number;
    height?: number;
    rotation?: number;
    borderWidth?: number;
    borderColor?: string;
}

export interface TemplateLayout {
    page: {
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    };
    elements: TemplateElement[];
}

export class Template {
    private readonly _id: number;
    private readonly _name: string;
    private readonly _layout: TemplateLayout;
    private readonly _courseId: number;

    constructor(id: number, name: string, layout: TemplateLayout, courseId: number) {
        this._id = id;
        this._name = name;
        this._layout = layout;
        this._courseId = courseId;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get layout(): TemplateLayout {
        return this._layout;
    }

    public get courseId(): number {
        return this._courseId;
    }

    // Returns the element with the given ID, or undefined if not found.
    public getElement(elementId: string): TemplateElement | undefined {
        return this._layout.elements.find(e => e.id === elementId);
    }

    // Serializes the template into a plain JSON-compatible object.
    public toJSON(): object {
        return {
            id: this._id,
            name: this._name,
            courseId: this._courseId,
            layout: this._layout,
        };
    }

    // Creates a Template instance from a parsed JSON object.
    public static fromJSON(data: any): Template {
        return new Template(
            data.id,
            data.name,
            data.layout as TemplateLayout,
            data.courseId,
        );
    }
}