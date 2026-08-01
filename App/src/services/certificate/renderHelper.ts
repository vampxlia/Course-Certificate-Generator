import Handlebars from 'handlebars';
import { TemplateLayout } from '../../model/template';

export function prepareElementsForRender(layout: TemplateLayout, data: any) {
    return layout.elements.map(element => {
        const isCentered = element.x >= 650 && element.x <= 750;
        const style: string[] = [];

        if (element.type === 'image') {
            style.push(`left: ${element.x}px`);
            style.push(`top: ${element.y}px`);
            style.push(`width: ${element.width || 150}px`);
            style.push(`height: ${element.height || 150}px`);
            style.push(`position: absolute`);
        } else {
            if (!isCentered) {
                style.push(`left: ${element.x}px`);
            }
            style.push(`top: ${element.y}px`);
            if (element.fontSize) style.push(`font-size: ${element.fontSize}px`);
            if (element.fontFamily) style.push(`font-family: '${element.fontFamily}', sans-serif`);
            if (element.color) style.push(`color: ${element.color}`);
            if (element.fontStyle) style.push(`font-style: ${element.fontStyle}`);
        }

        let content = '';
        if (element.type === 'placeholder') {
            if (element.placeholder === 'name') {
                content = data.name || '';
            } else {
                content = data[element.placeholder || ''] || element.placeholder || '';
            }
        } else if (element.type === 'image') {
            content = element.src || '';
        } else {
            try {
                content = Handlebars.compile(element.content || '')(data);
            } catch (e) {
                content = element.content || '';
            }
        }

        return {
            ...element,
            isCentered,
            style: style.join('; '),
            content,
            isImage: element.type === 'image',
            isSignature: element.id === 'signature'
        };
    });
}
