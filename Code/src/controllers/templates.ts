// my_code
import {Request, Response} from 'express';
import {TemplateLayout} from '../model/template';
import {prepareElementsForRender} from '../services/certificate/renderHelper';
import {
    buildLayoutFromForm,
    createTemplate, deleteTemplate, findElement,
    getAllTemplates,
    getTemplateByID, updateTemplate
} from "../services/certificate/template";
import { getFiltersData } from '../services/certificate/certificates';

export const getTemplatePage = async (req: Request, res: Response) => {
    let templates = await getAllTemplates();
    const searchQuery = (req.query.search as string) || '';

    if (searchQuery.trim()) {
        const lowerQuery = searchQuery.trim().toLowerCase();
        templates = templates.filter(t => 
            t.name.toLowerCase().includes(lowerQuery) || 
            String(t.id) === lowerQuery
        );
    }

    const { courses } = await getFiltersData();
    res.render('templates/index', { templates, courses, searchQuery });
};

export const getCreateTemplatePage = async (req: Request, res: Response) => {
    const { courses } = await getFiltersData();
    res.render('templates/create', { courses });
};

export const getEditTemplatePage = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send("Invalid template id");
    }

    const template = await getTemplateByID(id);
    if (!template) {
        return res.status(404).send("Template not found");
    }

    const { courses } = await getFiltersData();

    // Pre-extract elements for the view so it doesn't have to search
    const layout = template.layout;
    const elements = {
        title:          findElement(layout, 'title'),
        intro:          findElement(layout, 'intro'),
        studentName:    findElement(layout, 'studentName'),
        mainText:       findElement(layout, 'mainText'),
        congratulations:findElement(layout, 'congratulations'),
        signature:      findElement(layout, 'signature'),
    };
    const images = layout.elements.filter((e: { type: string; }) => e.type === 'image');

    res.render("templates/edit", { template, elements, images, courses });
};



export const templateCreate = async (req: Request, res: Response) => {
    const { name, courseId } = req.body;
    const numericCourseId = parseInt(courseId, 10);
    if (!name || isNaN(numericCourseId)) {
        const { courses } = await getFiltersData();
        return res.render('templates/create', {
            courses,
            errorMessage: 'Name and course are required.'
        });
    }
    const layout = buildLayoutFromForm(req.body);
    await createTemplate(name, layout, numericCourseId);
    res.redirect('/templates');
};

export const templateUpdate = async (req: Request, res: Response) => {
    const { id, name, courseId } = req.body;
    const numericId = parseInt(id, 10);
    const numericCourseId = parseInt(courseId, 10);
    const layout = buildLayoutFromForm(req.body);
    await updateTemplate(numericId, name, layout, numericCourseId);
    res.redirect(`/templates/edit/${numericId}`);
};

export const templateDelete = async (req: Request, res: Response) => {
    const { id } = req.body;
    await deleteTemplate(parseInt(id, 10));
    res.redirect('/templates');
};



export const previewTemplate = async (req: Request, res: Response) => {
    let layout: TemplateLayout;

    if (req.body && req.body.titleText) {
        // Build layout from form fields (for unsaved / in-progress templates)
        layout = buildLayoutFromForm(req.body);
    } else if (req.query.id) {
        // Load an existing template by ID
        const id = Number(req.query.id);
        const template = await getTemplateByID(id);
        if (!template) {
            return res.status(404).send("Template not found");
        }
        layout = template.layout;
    } else {
        return res.status(400).send("No template data provided");
    }

    // Provide sample placeholder data for preview
    const placeholderData: Record<string, string> = {
        name: 'João Silva',
        id: '12345',
        curso: 'Engenharia Informática',
        data_inicio: '01/09/2024',
        data_fim: '30/06/2025',
    };

    const elements = prepareElementsForRender(layout, placeholderData);

    res.render('templates/preview', { layout, elements });
};
