// components/QuizList.jsx
// Updated version with API integration

import React, { useState } from 'react';
import { X, AlertCircle, ImageIcon, XCircle, FileText, MessageSquare, CheckCircle } from 'lucide-react';
import Image from "next/image";

// Report Modal Component
const ReportModal = ({ isOpen, onClose, question, onSubmit }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reportReasons = [
        { id: 'incomplete', label: 'Question is incomplete', icon: AlertCircle },
        { id: 'missing_image', label: 'Image is missing', icon: ImageIcon },
        { id: 'wrong_answer', label: 'Answer is incorrect', icon: XCircle },
        { id: 'missing_option', label: 'Answer option is missing', icon: FileText },
        { id: 'custom', label: 'Custom reason', icon: MessageSquare }
    ];

    const handleSubmit = async () => {
        if (!selectedReason) {
            alert('Please select a reason');
            return;
        }

        if (selectedReason === 'custom' && !customReason.trim()) {
            alert('Please provide a custom reason');
            return;
        }

        setIsSubmitting(true);

        const reportData = {
            questionNumber: question.question_number,
            examName: question.exam_name,
            questionTopic: question.question_topic,
            questionText: question.question_text,
            options: question.options,
            correctAnswer: question.correct_answer,
            reason: selectedReason === 'custom' ? customReason : reportReasons.find(r => r.id === selectedReason)?.label,
            reasonType: selectedReason,
            customReason: selectedReason === 'custom' ? customReason : '',
            timestamp: new Date().toISOString(),
            reportedBy: 'Current User' // Replace with actual user from auth context
        };

        try {
            // Call your Next.js API
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportData)
            });

            const result = await response.json();

            if (result.success) {
                onSubmit(reportData);
                setSelectedReason('');
                setCustomReason('');
                onClose();
            } else {
                alert('Failed to submit report: ' + result.error);
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Failed to submit report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto no-scrollbar">
            <div className="bg-primary-50 dark:bg-primary-dark-100 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto no-scrollbar">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-primary-200 dark:border-primary-dark-700">
                    <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-dark">
                        Report Question #{question.question_number}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-primary-700 dark:text-primary-dark-400 "
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    <p className="text-sm text-primary-700 dark:text-primary-dark">
                        Select the issue you found with this question:
                    </p>

                    {/* Reason Options */}
                    <div className="space-y-2">
                        {reportReasons.map((reason) => {
                            const Icon = reason.icon;
                            return (
                                <label
                                    key={reason.id}
                                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${selectedReason === reason.id
                                        ? 'border-primary-500 dark:border-primary-dark'
                                        : 'border-primary-50 dark:border-primary-dark-50 dark:border-gray-700 '
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={reason.id}
                                        checked={selectedReason === reason.id}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                        className="mr-3 appearance-none"
                                    />
                                    <Icon size={18} className="mr-2 text-primary-700 dark:text-primary-dark" /> &nbsp;
                                    <span className="text-sm text-primary-700 dark:text-primary-dark">
                                        {reason.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                    {/* Custom Reason Textbox */}
                    {selectedReason === 'custom' && (
                        <div>
                            <label className="block text-sm font-medium text-primary-700 dark:text-primary-dark mb-2">
                                Describe the issue:
                            </label>
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Please provide details about the issue..."
                                className="w-full px-3 py-2   focus:border-primary-500 focus:outline focus:outline-primary-500 dark:focus:border-primary-dark-500 dark:focus:outline dark:focus:outline-primary-dark-500"
                                rows="4"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-4 border-t border-primary-200 dark:border-primary-dark-700">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-primary-700 dark:text-primary-dark bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selectedReason}
                        className="flex-1 px-4 py-2 bg-blue-600 text-primary-700 dark:text-primary-dark rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main QuizList Component
const QuizList = ({ question }) => {
    const [selected, setSelected] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSelect = (key) => {
        if (selected) return;
        setSelected(key);
    };

    const handleReportSubmit = (reportData) => {
        console.log('Report submitted:', reportData);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const renderMatchingQuestion = () => {
        if (question.question_type !== 'Match_List1_With_L2') {
            return null;
        }

        return (
            <div className="mt-4 mb-4 space-y-4">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white dark:bg-primary-dark-50 rounded-lg shadow-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
                                    {question.description.list1_title}
                                </th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
                                    {question.description.list2_title}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {question.description.list1_items.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-3 border-b border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center">
                                            <span className="font-medium mr-2 text-primary-600 dark:text-primary-dark-400">({item.id})</span>
                                            {item.text}
                                        </div>
                                    </td>
                                    <td className="p-3 border-b border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center">
                                            <span className="font-medium mr-2 text-primary-600 dark:text-primary-dark-400">
                                                ({question.description.list2_items[index]?.id || '?'})
                                            </span>
                                            {question.description.list2_items[index]?.text || ' - '}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const getOptionClasses = (key) => {
        if (!selected) {
            return 'bg-primary-50 hover:bg-primary-100 dark:bg-primary-dark-50 dark:hover:bg-primary-dark-100 dark:text-black';
        }

        if (key === question.correct_answer) {
            return 'bg-green-100 border-green-600 text-green-800';
        }

        if (key === selected && key !== question.correct_answer) {
            return 'bg-red-100 border-red-600 text-red-800';
        }

        return 'bg-gray-50 dark:bg-gray-700 opacity-70 dark:text-white';
    };

    return (
        <>
            {/* Success Toast Notification */}
            {showSuccess && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
                    <CheckCircle size={20} />
                    Report submitted successfully! We&apos;ll review it soon.
                </div>
            )}


            <article className="p-6 bg-white dark:bg-grey-light rounded-lg border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 text-gray-500">
                    <div className="flex items-center gap-2">
                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-dark-100 dark:text-primary-dark-800">
                            {question.question_topic}
                        </span>

                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-dark-100 dark:text-primary-dark-800">
                            {question.exam_name}
                        </span>
                    </div>

                    {/* 3-Dot Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowReportModal(!showReportModal)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            aria-label="More options"
                            title="Report question" // Add this line
                        >
                            <AlertCircle size={20} className="text-primary-600 dark:text-primary-dark-400" />
                        </button>

                    </div>
                </div>
                <div>
                    <h2 className="mb-4 text-gray-900 dark:text-white">
                        Q.{question.question_number}{" "}
                        <span
                            dangerouslySetInnerHTML={{ __html: question.question_text }}
                        />
                    </h2>
                </div>

                {question.image_required && question.image_url && (
                    <div className="my-4">
                        <Image
                            src={question.image_url}
                            alt={`Question ${question.question_number}`}
                            width={800}
                            height={450}
                            className="w-full max-w-xl rounded-lg border shadow-sm"
                            sizes="(max-width: 768px) 100vw, 800px"
                            priority={false}
                        />
                    </div>
                )}


                {/* Matching Questions */}
                {question.question_type === 'Match_List1_With_L2' && renderMatchingQuestion()}

                {/* Options */}
                <div className="space-y-2">
                    {Object.entries(question.options).map(([key, value]) => (
                        <button
                            key={key}
                            onClick={() => handleSelect(key)}
                            disabled={!!selected}
                            className={`${getOptionClasses(key)} w-full text-left px-4 py-2 rounded transition-all`}
                        >
                            <span className="font-semibold mr-2">{key}.</span>
                            {value}
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-5">
                    {selected && (
                        <span
                            className={`text-sm font-semibold ${selected === question.correct_answer ? 'text-green-600' : 'text-red-600'
                                }`}
                        >
                            {selected === question.correct_answer ? 'Correct Answer ✅' : 'Wrong Answer ❌'}
                        </span>
                    )}
                </div>
            </article>

            {/* Report Modal */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                question={question}
                onSubmit={handleReportSubmit}
            />
        </>
    );
};

export default QuizList;