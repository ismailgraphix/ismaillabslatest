// components/hero-demo/data.ts
// Invented records for the hero demo. Every name, number and institution here
// is made up; none belongs to a client or a real person. The frame says so
// with a visible "Demo data" label.

// ── Student portal ─────────────────────────────────────────────────────────

export interface CourseResult {
    code: string;
    title: string;
    units: number;
    score: number;
}

export interface Student {
    id: string;
    name: string;
    matric: string;
    programme: string;
    level: number;
    session: string;
    results: CourseResult[];
}

export const students: Student[] = [
    {
        id: "s1",
        name: "Amina Bello",
        matric: "DU/2022/0142",
        programme: "Computer Science",
        level: 300,
        session: "2025/2026 · First semester",
        results: [
            { code: "CSC 301", title: "Data Structures", units: 3, score: 74 },
            { code: "CSC 303", title: "Operating Systems", units: 3, score: 66 },
            { code: "CSC 305", title: "Database Design", units: 3, score: 81 },
            { code: "MTH 301", title: "Numerical Methods", units: 2, score: 58 },
            { code: "GST 301", title: "Entrepreneurship", units: 2, score: 70 },
        ],
    },
    {
        id: "s2",
        name: "Chidi Okafor",
        matric: "DU/2022/0217",
        programme: "Computer Science",
        level: 300,
        session: "2025/2026 · First semester",
        results: [
            { code: "CSC 301", title: "Data Structures", units: 3, score: 62 },
            { code: "CSC 303", title: "Operating Systems", units: 3, score: 55 },
            { code: "CSC 305", title: "Database Design", units: 3, score: 68 },
            { code: "MTH 301", title: "Numerical Methods", units: 2, score: 47 },
            { code: "GST 301", title: "Entrepreneurship", units: 2, score: 71 },
        ],
    },
    {
        id: "s3",
        name: "Fatima Yusuf",
        matric: "DU/2023/0058",
        programme: "Nursing Science",
        level: 200,
        session: "2025/2026 · First semester",
        results: [
            { code: "NSC 201", title: "Anatomy II", units: 3, score: 77 },
            { code: "NSC 203", title: "Physiology II", units: 3, score: 72 },
            { code: "NSC 205", title: "Foundations of Nursing", units: 4, score: 69 },
            { code: "BCH 201", title: "Biochemistry", units: 2, score: 61 },
            { code: "GST 201", title: "Philosophy and Logic", units: 2, score: 75 },
        ],
    },
    {
        id: "s4",
        name: "Tunde Adeyemi",
        matric: "DU/2021/0390",
        programme: "Accounting",
        level: 400,
        session: "2025/2026 · First semester",
        results: [
            { code: "ACC 401", title: "Advanced Auditing", units: 3, score: 59 },
            { code: "ACC 403", title: "Public Sector Accounting", units: 3, score: 64 },
            { code: "ACC 405", title: "Taxation II", units: 3, score: 52 },
            { code: "ACC 407", title: "Research Methods", units: 2, score: 70 },
            { code: "ACC 499", title: "Project", units: 6, score: 66 },
        ],
    },
];

/** Five-point scale used by many Nigerian universities. */
export function gradeFor(score: number): { grade: string; points: number } {
    if (score >= 70) return { grade: "A", points: 5 };
    if (score >= 60) return { grade: "B", points: 4 };
    if (score >= 50) return { grade: "C", points: 3 };
    if (score >= 45) return { grade: "D", points: 2 };
    if (score >= 40) return { grade: "E", points: 1 };
    return { grade: "F", points: 0 };
}

export function gpaFor(results: CourseResult[]): number {
    const units = results.reduce((sum, r) => sum + r.units, 0);
    const points = results.reduce((sum, r) => sum + r.units * gradeFor(r.score).points, 0);
    return units === 0 ? 0 : points / units;
}

export function classFor(gpa: number): string {
    if (gpa >= 4.5) return "First class";
    if (gpa >= 3.5) return "Second class upper";
    if (gpa >= 2.4) return "Second class lower";
    if (gpa >= 1.5) return "Third class";
    return "Pass";
}

// ── Hospital records ───────────────────────────────────────────────────────

export interface Visit {
    time: string;
    event: string;
    detail: string;
}

export interface Prescription {
    drug: string;
    dose: string;
    frequency: string;
    duration: string;
}

export interface Patient {
    id: string;
    name: string;
    hospitalNo: string;
    age: number;
    sex: "F" | "M";
    clinic: string;
    visits: Visit[];
    prescriptions: Prescription[];
}

export const patients: Patient[] = [
    {
        id: "p1",
        name: "Grace Eze",
        hospitalNo: "DH-004812",
        age: 34,
        sex: "F",
        clinic: "General outpatients",
        visits: [
            { time: "08:12", event: "Registered", detail: "Returning patient, card retrieved" },
            { time: "08:40", event: "Triage", detail: "Temp 38.6 °C · BP 118/76 · Pulse 96" },
            { time: "09:25", event: "Consultation", detail: "Fever and headache for three days" },
            { time: "09:50", event: "Laboratory", detail: "Malaria RDT positive" },
            { time: "10:05", event: "Prescription issued", detail: "Sent to pharmacy" },
        ],
        prescriptions: [
            { drug: "Artemether/lumefantrine 80/480 mg", dose: "1 tablet", frequency: "Twice daily", duration: "3 days" },
            { drug: "Paracetamol 500 mg", dose: "2 tablets", frequency: "Every 8 hours", duration: "3 days" },
        ],
    },
    {
        id: "p2",
        name: "Musa Ibrahim",
        hospitalNo: "DH-005177",
        age: 58,
        sex: "M",
        clinic: "Medical outpatients",
        visits: [
            { time: "07:55", event: "Registered", detail: "Scheduled review" },
            { time: "08:20", event: "Triage", detail: "BP 152/94 · Pulse 78 · Weight 84 kg" },
            { time: "09:10", event: "Consultation", detail: "Hypertension review, adherence discussed" },
            { time: "09:35", event: "Prescription issued", detail: "Dose adjusted" },
            { time: "09:40", event: "Next visit booked", detail: "Review in four weeks" },
        ],
        prescriptions: [
            { drug: "Amlodipine 10 mg", dose: "1 tablet", frequency: "Once daily", duration: "28 days" },
            { drug: "Lisinopril 10 mg", dose: "1 tablet", frequency: "Once daily", duration: "28 days" },
        ],
    },
    {
        id: "p3",
        name: "Ngozi Obi",
        hospitalNo: "DH-005403",
        age: 7,
        sex: "F",
        clinic: "Paediatrics",
        visits: [
            { time: "10:02", event: "Registered", detail: "New patient, guardian present" },
            { time: "10:15", event: "Triage", detail: "Temp 37.9 °C · Weight 22 kg" },
            { time: "10:50", event: "Consultation", detail: "Sore throat and cough" },
            { time: "11:05", event: "Prescription issued", detail: "Weight-based dosing" },
        ],
        prescriptions: [
            { drug: "Amoxicillin 250 mg/5 ml", dose: "10 ml", frequency: "Every 8 hours", duration: "5 days" },
            { drug: "Paracetamol 120 mg/5 ml", dose: "10 ml", frequency: "Every 6 hours as needed", duration: "3 days" },
        ],
    },
];

// ── Payments ───────────────────────────────────────────────────────────────

export const invoice = {
    number: "INV-2026-01873",
    payer: "Amina Bello",
    reference: "DU/2022/0142",
    session: "2025/2026 session",
    items: [
        { label: "Tuition", amount: 185000 },
        { label: "Hostel accommodation", amount: 60000 },
        { label: "Library and ICT", amount: 15000 },
        { label: "Student union dues", amount: 5000 },
    ],
};

export const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
