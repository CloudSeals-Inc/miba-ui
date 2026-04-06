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

export function isMobileDevice() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

const STATUS_MAP = { OPEN: 'pending', ASSIGNED: 'assigned', CLOSED: 'cleaned' };

export async function getReports(phone, role) {
    const params = new URLSearchParams();
    if (phone) params.append('phone', phone);
    if (role) params.append('role', role);
    const response = await fetch(`${API_BASE_URL}/reports?${params.toString()}`);
    if (!response.ok) return [];
    const data = await response.json();
    return (Array.isArray(data) ? data : []).map(wo => ({
        id: wo.work_order_id || wo.id,
        workOrderId: wo.work_order_id || wo.id,
        status: STATUS_MAP[wo.status] || wo.status?.toLowerCase() || 'pending',
        location: wo.location?.lat != null
            ? `Lat: ${wo.location.lat.toFixed(4)}, Lng: ${wo.location.lng.toFixed(4)}`
            : (wo.location || 'Unknown'),
        description: (wo.classification?.ai_narrative || wo.description || '').replace(/^#+\s*/gm, '').split('\n')[0] || 'No description',
        imageUrl: (() => {
            const raw = wo.image_data || wo.imageUrl || '';
            if (!raw) return '';
            if (raw.startsWith('data:image')) return raw;
            return `data:image/jpeg;base64,${raw}`;
        })(),
        afterImageUrl: wo.afterImageUrl || null,
        aiCategory: wo.classification?.dominant_category_name || wo.aiCategory || 'General Waste',
        aiCategoryCode: wo.classification?.dominant_category || '',
        totalWeightKg: wo.classification?.total_weight_kg_estimate || 0,
        totalCo2eKg: wo.classification?.total_co2e_avoided_kg || 0,
        grandTotalInr: wo.classification?.grand_total_value_inr || 0,
        scrapInrMin: wo.classification?.total_scrap_value_inr_min || 0,
        scrapInrMax: wo.classification?.total_scrap_value_inr_max || 0,
        tokenInr: wo.classification?.total_token_value_inr || 0,
        carbonInr: wo.classification?.total_carbon_credit_inr || 0,
        severityLabel: wo.classification?.severity || '',
        date: wo.created_at || wo.date,
        reporterPhone: wo.reporter_id || wo.reporterPhone,
        rating: wo.rating || null,
    }));
}

export async function saveReport(report) {
    const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
    });
    if (!response.ok) throw new Error(`Report submission failed: ${response.status}`);
    return response.json();
}

export function calculateUserStats(phone, reports) {
    const userReports = (reports || []).filter(r => r.reporterPhone === phone);
    return {
        reportsCompiled: userReports.length,
        credits: userReports.length * 50 // Simple 50 credits per report
    };
}
