import { ITemplateDAO } from "../../dao/interfaces/ITemplateDAO";
import { TemplateDAO } from "../../dao/implementations/local/templateDAO";
import { Template, TemplateElement, TemplateLayout } from "../../model/template";

const dao: ITemplateDAO = new TemplateDAO();

export function buildLayoutFromForm(body: Record<string, any>): TemplateLayout {
    const page = {
        backgroundColor: body.backgroundColor || '#dbf2ff',
        borderColor: body.borderColor || '#2655b5',
        borderWidth: body.borderWidth !== '' ? parseInt(body.borderWidth, 10) : 20,
    };

    const parseNum = (val: any, fallback: number) => val !== undefined && val !== '' && !isNaN(parseInt(val, 10)) ? parseInt(val, 10) : fallback;
    const parseOptNum = (val: any) => val !== undefined && val !== '' && !isNaN(parseInt(val, 10)) ? parseInt(val, 10) : undefined;
    const parseOptStr = (val: any) => val !== undefined && val !== '' ? val : undefined;

    const elements: TemplateElement[] = [
        {
            id: 'title',
            type: 'text',
            content: body.titleText || 'Certificado',
            x: parseNum(body.titleX, 700),
            y: parseNum(body.titleY, 100),
            fontSize: parseOptNum(body.titleFontSize),
            fontFamily: parseOptStr(body.titleFontFamily),
            color: parseOptStr(body.titleColor),
        },
        {
            id: 'intro',
            type: 'text',
            content: body.introText || 'Certifica-se que',
            x: parseNum(body.introX, 700),
            y: parseNum(body.introY, 250),
            fontSize: parseOptNum(body.introFontSize),
            fontFamily: parseOptStr(body.introFontFamily),
            color: parseOptStr(body.introColor),
        },
        {
            id: 'studentName',
            type: 'placeholder',
            placeholder: 'name',
            x: parseNum(body.studentNameX, 700),
            y: parseNum(body.studentNameY, 330),
            fontSize: parseOptNum(body.studentNameFontSize),
            fontFamily: parseOptStr(body.studentNameFontFamily),
            color: parseOptStr(body.studentNameColor),
        },
        {
            id: 'mainText',
            type: 'text',
            content: body.mainText || 'aluno com o número: {{id}} terminou o curso {{curso}}. O curso teve início em {{data_inicio}} e terminou em {{data_fim}}.',
            x: parseNum(body.mainTextX, 700),
            y: parseNum(body.mainTextY, 450),
            fontSize: parseOptNum(body.mainTextFontSize),
            fontFamily: parseOptStr(body.mainTextFontFamily),
            color: parseOptStr(body.mainTextColor),
        },
        {
            id: 'congratulations',
            type: 'text',
            content: body.congratulationsText || 'Muitos parabéns!',
            x: parseNum(body.congratulationsX, 700),
            y: parseNum(body.congratulationsY, 650),
            fontSize: parseOptNum(body.congratulationsFontSize),
            fontFamily: parseOptStr(body.congratulationsFontFamily),
            fontStyle: 'italic',
            color: parseOptStr(body.congratulationsColor),
        },
        {
            id: 'signature',
            type: 'text',
            content: body.signatureText || 'Assinatura do Responsável',
            x: parseNum(body.signatureX, 1200),
            y: parseNum(body.signatureY, 900),
            fontSize: parseOptNum(body.signatureFontSize),
            fontFamily: parseOptStr(body.signatureFontFamily),
            color: parseOptStr(body.signatureColor),
            borderWidth: parseOptNum(body.signatureBorderWidth) || 5,
            borderColor: parseOptStr(body.signatureBorderColor) || '#2655b5',
        },
    ];

    if (body.imagesJson && body.imagesJson.trim() !== '') {
        try {
            const images = JSON.parse(body.imagesJson);
            if (Array.isArray(images)) {
                for (const img of images) {
                    if (img && img.type === 'image') {
                        elements.push({
                            id: img.id || `image_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                            type: 'image',
                            src: img.src || '',
                            x: parseNum(img.x, 100),
                            y: parseNum(img.y, 100),
                            width: parseNum(img.width, 150),
                            height: parseNum(img.height, 150)
                        });
                    }
                }
            }
        } catch (e) {
            console.error("Failed to parse imagesJson:", e);
        }
    }

    return { page, elements };
}

export async function getAllTemplates() {
    return await dao.getAllTemplates();
}

export async function getTemplateByID(id: number) {
    return await dao.getTemplateById(id);
}

export async function createTemplate(name: string, layout: TemplateLayout, courseId: number) {
    const newTemplate = new Template(Date.now(), name, layout, courseId);
    await dao.saveTemplate(newTemplate);
}

export async function updateTemplate(id: number, name: string, layout: TemplateLayout, courseId: number) {
    const updatedTemplate = new Template(id, name, layout, courseId);
    await dao.updateTemplate(updatedTemplate);
}

export async function deleteTemplate(id: number) {
    await dao.deleteTemplate(id);
}

export function findElement(layout: TemplateLayout, elementId: string): TemplateElement {
    return layout.elements.find(e => e.id === elementId) || {
        id: elementId, type: 'text', x: 0, y: 0
    };
}