// app/api/reports/route.js (App Router)
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Use /tmp in production (writable), public/reports in development
const reportsFilePath = isProduction
    ? '/tmp/question_reports.json'
    : path.join(process.cwd(), 'public', 'reports', 'question_reports.json');

// Ensure the reports directory and file exist
function ensureReportsFile() {
    const dir = path.dirname(reportsFilePath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Create file with empty array if it doesn't exist
    if (!fs.existsSync(reportsFilePath)) {
        fs.writeFileSync(reportsFilePath, JSON.stringify([], null, 2));
    }
}

// Helper function to read reports (with fallback for production)
function readReports() {
    ensureReportsFile();
    const fileContent = fs.readFileSync(reportsFilePath, 'utf-8');
    return JSON.parse(fileContent);
}

// Helper function to write reports
function writeReports(reports) {
    fs.writeFileSync(reportsFilePath, JSON.stringify(reports, null, 2));
}

// GET - Fetch all reports
export async function GET(request) {
    try {
        const reports = readReports();

        // Get query params for filtering
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status'); // pending, resolved, all

        let filteredReports = reports;

        if (status && status !== 'all') {
            filteredReports = reports.filter(report => report.status === status);
        }

        return NextResponse.json({
            success: true,
            reports: filteredReports,
            total: filteredReports.length,
            environment: isProduction ? 'production' : 'development',
            storage: isProduction ? 'temporary (/tmp)' : 'persistent (local files)'
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch reports' },
            { status: 500 }
        );
    }
}

// POST - Submit new report
export async function POST(request) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['questionNumber', 'examName', 'questionText', 'options', 'reason'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Read existing reports
        const reports = readReports();

        // Create new report
        const newReport = {
            id: `R_${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'pending',
            ...body
        };

        // Add to reports array
        reports.push(newReport);

        // Write back to file
        writeReports(reports);

        return NextResponse.json({
            success: true,
            message: 'Report submitted successfully',
            report: newReport,
            warning: isProduction ? 'Data stored in /tmp - will be cleared periodically' : null
        });
    } catch (error) {
        console.error('Error submitting report:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to submit report' },
            { status: 500 }
        );
    }
}

// PUT - Edit/Update entire report
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, ...updatedData } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Missing report id' },
                { status: 400 }
            );
        }

        // Read existing reports
        const reports = readReports();

        // Find report index
        const reportIndex = reports.findIndex(r => r.id === id);

        if (reportIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Report not found' },
                { status: 404 }
            );
        }

        // Update the report while preserving id and timestamp
        reports[reportIndex] = {
            ...reports[reportIndex],
            ...updatedData,
            id: reports[reportIndex].id, // Preserve original ID
            timestamp: reports[reportIndex].timestamp, // Preserve original timestamp
            updatedAt: new Date().toISOString()
        };

        // Write back to file
        writeReports(reports);

        return NextResponse.json({
            success: true,
            message: 'Report updated successfully',
            report: reports[reportIndex]
        });
    } catch (error) {
        console.error('Error updating report:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update report' },
            { status: 500 }
        );
    }
}

// PATCH - Update report status or specific fields
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, status, ...otherUpdates } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Missing report id' },
                { status: 400 }
            );
        }

        // Read existing reports
        const reports = readReports();

        // Find and update report
        const reportIndex = reports.findIndex(r => r.id === id);

        if (reportIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Report not found' },
                { status: 404 }
            );
        }

        // Update status if provided
        if (status) {
            reports[reportIndex].status = status;
        }

        // Update other fields if provided
        Object.keys(otherUpdates).forEach(key => {
            reports[reportIndex][key] = otherUpdates[key];
        });

        reports[reportIndex].updatedAt = new Date().toISOString();

        // Write back to file
        writeReports(reports);

        return NextResponse.json({
            success: true,
            message: 'Report updated successfully',
            report: reports[reportIndex]
        });
    } catch (error) {
        console.error('Error updating report:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update report' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a report
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Missing report id' },
                { status: 400 }
            );
        }

        // Read existing reports
        const reports = readReports();

        // Filter out the report to delete
        const filteredReports = reports.filter(r => r.id !== id);

        if (filteredReports.length === reports.length) {
            return NextResponse.json(
                { success: false, error: 'Report not found' },
                { status: 404 }
            );
        }

        // Write back to file
        writeReports(filteredReports);

        return NextResponse.json({
            success: true,
            message: 'Report deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting report:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete report' },
            { status: 500 }
        );
    }
}