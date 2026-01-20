import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    const papersDir = path.join(process.cwd(), 'public/papers');
    const data = {};

    try {
        const categories = await fs.readdir(papersDir);

        for (const category of categories) {
            // Skip non-directory files like "Exam Calendar.pdf"
            const categoryPath = path.join(papersDir, category);
            const stat = await fs.stat(categoryPath);

            if (!stat.isDirectory()) {
                continue;
            }

            data[category] = {};
            const items = await fs.readdir(categoryPath);

            for (const item of items) {
                const itemPath = path.join(categoryPath, item);
                const itemStat = await fs.stat(itemPath);

                if (itemStat.isDirectory()) {
                    // It's a year folder (like "2023", "2024")
                    const files = await fs.readdir(itemPath);
                    const pdfFiles = files.filter(f => f.endsWith('.pdf'));
                    if (pdfFiles.length > 0) {
                        data[category][item] = pdfFiles;
                    }
                } else if (item.endsWith('.pdf')) {
                    // It's a direct PDF file
                    if (!data[category].direct) {
                        data[category].direct = [];
                    }
                    data[category].direct.push(item);
                }
            }
        }

        return Response.json(data);
    } catch (error) {
        console.error('Error reading papers directory:', error);
        return Response.json({ error: 'Failed to read papers' }, { status: 500 });
    }
}