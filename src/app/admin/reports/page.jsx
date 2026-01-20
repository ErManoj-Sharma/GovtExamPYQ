"use client";
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Download, Trash2, Eye, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [storageWarning, setStorageWarning] = useState(null);

    useEffect(() => {
        loadReports();
    }, []);

    useEffect(() => {
        filterReports();
    }, [reports, statusFilter]);

    const loadReports = async () => {
        setLoading(true);
        try {
            console.log('Fetching reports from /api/reports...');
            const response = await fetch('/api/reports');
            const result = await response.json();

            console.log('API Response:', result);

            if (result.success) {
                console.log('Reports loaded:', result.reports.length, 'reports');
                setReports(result.reports);

                // Check for storage warnings (production /tmp usage)
                if (result.storage && result.storage.includes('temporary')) {
                    setStorageWarning({
                        type: 'warning',
                        message: `⚠️ Running in production with temporary storage (${result.storage}). Data may be lost on function restarts. Consider implementing a database for persistent storage.`
                    });
                }

                // Check if warning message exists in response
                if (result.warning) {
                    setStorageWarning({
                        type: 'warning',
                        message: `⚠️ ${result.warning}`
                    });
                }
            } else {
                console.error('Failed to load reports:', result.error);
                setStorageWarning({
                    type: 'error',
                    message: `❌ Error loading reports: ${result.error}`
                });
            }
        } catch (error) {
            console.error('Error loading reports:', error);
            setStorageWarning({
                type: 'error',
                message: `❌ Failed to connect to API: ${error.message}`
            });
        } finally {
            setLoading(false);
        }
    };

    const filterReports = () => {
        if (statusFilter === 'all') {
            setFilteredReports(reports);
        } else {
            setFilteredReports(reports.filter(r => r.status === statusFilter));
        }
    };

    const updateReportStatus = async (id, newStatus) => {
        try {
            const response = await fetch('/api/reports', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, status: newStatus })
            });

            const result = await response.json();

            if (result.success) {
                // Show success message briefly
                const successMsg = document.createElement('div');
                successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                successMsg.textContent = '✓ Report updated successfully';
                document.body.appendChild(successMsg);
                setTimeout(() => successMsg.remove(), 3000);

                loadReports();
            } else {
                alert('Failed to update report: ' + result.error);
            }
        } catch (error) {
            console.error('Error updating report:', error);
            alert('Failed to update report: ' + error.message);
        }
    };

    const deleteReport = async (id) => {
        if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            try {
                const response = await fetch(`/api/reports?id=${id}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    // Show success message briefly
                    const successMsg = document.createElement('div');
                    successMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                    successMsg.textContent = '✓ Report deleted successfully';
                    document.body.appendChild(successMsg);
                    setTimeout(() => successMsg.remove(), 3000);

                    setSelectedReport(null);
                    loadReports();
                } else {
                    alert('Failed to delete report: ' + result.error);
                }
            } catch (error) {
                console.error('Error deleting report:', error);
                alert('Failed to delete report: ' + error.message);
            }
        }
    };

    const exportReports = () => {
        if (filteredReports.length === 0) {
            alert('No reports to export');
            return;
        }

        const reportText = filteredReports.map(report => {
            return `
==================== REPORT ====================
Report ID: ${report.id}
Date: ${new Date(report.timestamp).toLocaleString()}
Reported By: ${report.reportedBy || 'Anonymous'}
Status: ${report.status.toUpperCase()}

Question Number: ${report.questionNumber}
Exam Name: ${report.examName}
Topic: ${report.questionTopic}

Question: ${report.questionText}

Options:
${Object.entries(report.options).map(([key, value]) => `  ${key}) ${value}`).join('\n')}

Correct Answer: ${report.correctAnswer}

Issue Reported: ${report.reason}
${report.customReason ? `Additional Details: ${report.customReason}` : ''}

================================================
      `.trim();
        }).join('\n\n');

        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `question_reports_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            resolved: 'bg-green-100 text-green-800 border-green-300',
            dismissed: 'bg-gray-100 text-gray-800 border-gray-300'
        };

        const icons = {
            pending: <Clock size={14} />,
            resolved: <CheckCircle size={14} />,
            dismissed: <XCircle size={14} />
        };

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
                {icons[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const stats = {
        total: reports.length,
        pending: reports.filter(r => r.status === 'pending').length,
        resolved: reports.filter(r => r.status === 'resolved').length,
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        📊 Question Reports Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage and review reported questions from users
                    </p>
                </div>

                {/* Storage Warning Banner */}
                {storageWarning && (
                    <div className={`mb-6 p-4 rounded-lg border ${storageWarning.type === 'warning'
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                        }`}>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className={`flex-shrink-0 ${storageWarning.type === 'warning' ? 'text-yellow-600' : 'text-red-600'
                                }`} size={20} />
                            <div className="flex-1">
                                <p className={`text-sm ${storageWarning.type === 'warning'
                                    ? 'text-yellow-800 dark:text-yellow-200'
                                    : 'text-red-800 dark:text-red-200'
                                    }`}>
                                    {storageWarning.message}
                                </p>
                            </div>
                            <button
                                onClick={() => setStorageWarning(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Reports</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                        <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Resolved</div>
                        <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Filter by Status:
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All ({reports.length})</option>
                                <option value="pending">Pending ({stats.pending})</option>
                                <option value="resolved">Resolved ({stats.resolved})</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={loadReports}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? '⏳' : '🔄'} Refresh
                            </button>
                            <button
                                onClick={exportReports}
                                disabled={filteredReports.length === 0}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={18} />
                                Export Reports
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reports List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Loading reports...</p>
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                            <div className="text-4xl mb-2">📭</div>
                            <p>No reports found</p>
                            {statusFilter !== 'all' && (
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className="mt-2 text-blue-600 hover:underline"
                                >
                                    View all reports
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredReports.map((report) => (
                                <div key={report.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                                                    {report.id}
                                                </span>
                                                {getStatusBadge(report.status)}
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(report.timestamp).toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="mb-2">
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    Question #{report.questionNumber}
                                                </span>
                                                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                                    {report.examName} • {report.questionTopic}
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                                <strong>Issue:</strong> {report.reason}
                                            </div>

                                            {report.reportedBy && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Reported by: {report.reportedBy}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedReport(report)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            {report.status === 'pending' && (
                                                <button
                                                    onClick={() => updateReportStatus(report.id, 'resolved')}
                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                    title="Mark as Resolved"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => deleteReport(report.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete Report"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Report Detail Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedReport(null)}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Report Details - {selectedReport.id}
                            </h3>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</div>
                                {getStatusBadge(selectedReport.status)}
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Question</div>
                                <div className="text-gray-900 dark:text-white">
                                    <strong>Q.{selectedReport.questionNumber}:</strong> {selectedReport.questionText}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Exam & Topic</div>
                                <div className="text-gray-900 dark:text-white">
                                    {selectedReport.examName} • {selectedReport.questionTopic}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Options</div>
                                <div className="space-y-1">
                                    {Object.entries(selectedReport.options).map(([key, value]) => (
                                        <div key={key} className="text-gray-900 dark:text-white">
                                            <strong>{key})</strong> {value} {key === selectedReport.correctAnswer && '✅'}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Issue Reported</div>
                                <div className="text-gray-900 dark:text-white bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                                    {selectedReport.reason}
                                </div>
                            </div>

                            {selectedReport.customReason && (
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Additional Details</div>
                                    <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        {selectedReport.customReason}
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Reported</div>
                                <div className="text-gray-900 dark:text-white">
                                    {new Date(selectedReport.timestamp).toLocaleString()} by {selectedReport.reportedBy || 'Anonymous'}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
                            {selectedReport.status === 'pending' && (
                                <button
                                    onClick={() => {
                                        updateReportStatus(selectedReport.id, 'resolved');
                                        setSelectedReport(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={18} />
                                    Mark as Resolved
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;