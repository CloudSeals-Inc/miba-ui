export const API_BASE_URL = (window.MIBA_CONFIG && window.MIBA_CONFIG.VITE_API_URL) || import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export function saveUserSession(user) {
    localStorage.setItem('miba_user', JSON.stringify(user));
}

export function getUserSession() {
    const session = localStorage.getItem('miba_user');
    return session ? JSON.parse(session) : null;
}

export function logoutUser() {
    localStorage.removeItem('miba_user');
}

export async function getReports() {
    const raw = localStorage.getItem('miba_reports') || '[]';
    return JSON.parse(raw);
}

export async function saveReport(report) {
    const reports = await getReports();
    reports.push(report);
    localStorage.setItem('miba_reports', JSON.stringify(reports));
}

export function calculateUserStats(phone, reports) {
    const userReports = reports.filter(r => r.phone === phone);
    return {
        reportsCompiled: userReports.length,
        credits: userReports.length * 50 // Simple 50 credits per report
    };
}
