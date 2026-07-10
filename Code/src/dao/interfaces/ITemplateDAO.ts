// my_code
import {Template} from "../../model/template";

export interface ITemplateDAO {
    getTemplateById(id: number): Promise<Template | null>;
    getAllTemplates(): Promise<Template[]>;
    saveTemplate(template: Template): Promise<void>;
    updateTemplate(template: Template): Promise<void>;
    deleteTemplate(id: number): Promise<void>;
}
