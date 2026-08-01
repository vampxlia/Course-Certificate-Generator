import path from "path";
import fs from "fs/promises";
import {Template} from '../../../model/template';
import {ITemplateDAO} from '../../interfaces/ITemplateDAO';
import {TEMPLATE_REPOSITORY_DIR} from '../../../configs/localRepository';

export class TemplateDAO implements ITemplateDAO {

    private initialized = false;


     // Ensures the templates directory exists on disk.
     
    private async ensureDir(): Promise<void> {
        if (!this.initialized) {
            await fs.mkdir(TEMPLATE_REPOSITORY_DIR, {recursive: true});
            this.initialized = true;
        }
    }


     // Returns the file path for a template with the given ID.
     
    private filePath(id: number): string {
        return path.join(TEMPLATE_REPOSITORY_DIR, `${id}.json`);
    }

    async getTemplateById(id: number): Promise<Template | null> {
        await this.ensureDir();
        try {
            const raw = await fs.readFile(this.filePath(id), 'utf-8');
            return Template.fromJSON(JSON.parse(raw));
        } catch {
            return null;
        }
    }

    async getAllTemplates(): Promise<Template[]> {
        await this.ensureDir();
        try {
            const files = await fs.readdir(TEMPLATE_REPOSITORY_DIR);
            const jsonFiles = files.filter(f => f.endsWith('.json'));

            const templates = await Promise.all(
                jsonFiles.map(async (fileName) => {
                    try {
                        const raw = await fs.readFile(
                            path.join(TEMPLATE_REPOSITORY_DIR, fileName),
                            'utf-8'
                        );
                        return Template.fromJSON(JSON.parse(raw));
                    } catch {
                        return null;
                    }
                })
            );

            return templates.filter((t): t is Template => t !== null);
        } catch {
            return [];
        }
    }

    async saveTemplate(template: Template): Promise<void> {
        await this.ensureDir();
        const json = JSON.stringify(template.toJSON(), null, 2);
        await fs.writeFile(this.filePath(template.id), json, 'utf-8');
    }

    async updateTemplate(template: Template): Promise<void> {
        await this.ensureDir();
        // Only update if the file already exists
        try {
            await fs.access(this.filePath(template.id));
            const json = JSON.stringify(template.toJSON(), null, 2);
            await fs.writeFile(this.filePath(template.id), json, 'utf-8');
        } catch {
            // Template doesn't exist — nothing to update
        }
    }

    async deleteTemplate(id: number): Promise<void> {
        await this.ensureDir();
        try {
            await fs.unlink(this.filePath(id));
        } catch {
            // File doesn't exist — nothing to delete
        }
    }
}