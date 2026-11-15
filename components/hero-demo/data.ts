// components/hero-demo/data.ts
// Invented records for the hero demo. Every name, number and company here is
// made up; none belongs to a client or a real person. The frame says so with
// a visible "Demo data" label.

// ── Customers ──────────────────────────────────────────────────────────────

export type OrderStatus = "Delivered" | "In transit" | "Processing" | "Refunded";

export interface Order {
    number: string;
    date: string;
    items: number;
    amount: number;
    status: OrderStatus;
}

export interface Customer {
    id: string;
    name: string;
    ref: string;
    account: string;
    city: string;
    since: string;
    orders: Order[];
}

export const customers: Customer[] = [
    {
        id: "c1",
        name: "Amina Bello",
        ref: "CUS-00142",
        account: "Retail",
        city: "Abuja",
        since: "2023",
        orders: [
            { number: "ORD-3381", date: "12 Nov", items: 3, amount: 42500, status: "Processing" },
            { number: "ORD-3204", date: "28 Oct", items: 1, amount: 18000, status: "Delivered" },
            { number: "ORD-2967", date: "03 Oct", items: 5, amount: 76200, status: "Delivered" },
            { number: "ORD-2710", date: "14 Sep", items: 2, amount: 23900, status: "Refunded" },
        ],
    },
    {
        id: "c2",
        name: "Chidi Okafor",
        ref: "CUS-00217",
        account: "Retail",
        city: "Enugu",
        since: "2024",
        orders: [
            { number: "ORD-3375", date: "11 Nov", items: 2, amount: 31000, status: "In transit" },
            { number: "ORD-3011", date: "09 Oct", items: 4, amount: 54800, status: "Delivered" },
            { number: "ORD-2655", date: "06 Sep", items: 1, amount: 12500, status: "Delivered" },
        ],
    },
    {
        id: "c3",
        name: "Fatima Yusuf",
        ref: "CUS-00058",
        account: "Wholesale",
        city: "Kano",
        since: "2022",
        orders: [
            { number: "ORD-3390", date: "13 Nov", items: 40, amount: 486000, status: "Processing" },
            { number: "ORD-3288", date: "04 Nov", items: 25, amount: 312500, status: "In transit" },
            { number: "ORD-3102", date: "17 Oct", items: 60, amount: 702000, status: "Delivered" },
            { number: "ORD-2894", date: "26 Sep", items: 30, amount: 351000, status: "Delivered" },
            { number: "ORD-2731", date: "15 Sep", items: 12, amount: 148800, status: "Delivered" },
        ],
    },
    {
        id: "c4",
        name: "Tunde Adeyemi",
        ref: "CUS-00390",
        account: "Business",
        city: "Lagos",
        since: "2021",
        orders: [
            { number: "ORD-3342", date: "08 Nov", items: 8, amount: 96400, status: "Delivered" },
            { number: "ORD-3150", date: "22 Oct", items: 6, amount: 71300, status: "Delivered" },
            { number: "ORD-2988", date: "05 Oct", items: 10, amount: 118000, status: "Delivered" },
        ],
    },
];

export function totalSpend(orders: Order[]): number {
    return orders.filter((o) => o.status !== "Refunded").reduce((sum, o) => sum + o.amount, 0);
}

// ── Requests ───────────────────────────────────────────────────────────────

export interface RequestEvent {
    time: string;
    event: string;
    detail: string;
}

export interface RequestTask {
    title: string;
    detail: string;
}

export interface ServiceRequest {
    id: string;
    title: string;
    ref: string;
    customer: string;
    team: string;
    priority: "High" | "Normal" | "Low";
    events: RequestEvent[];
    tasks: RequestTask[];
}

export const requests: ServiceRequest[] = [
    {
        id: "r1",
        title: "Delivery arrived damaged",
        ref: "REQ-1042",
        customer: "Grace Eze",
        team: "Customer support",
        priority: "High",
        events: [
            { time: "08:12", event: "Received", detail: "Logged from the website form, photos attached" },
            { time: "08:40", event: "Assigned", detail: "Customer support · Halima" },
            { time: "09:25", event: "Reviewed", detail: "Two of six items damaged in transit" },
            { time: "09:50", event: "Approved", detail: "Replacement at no charge" },
            { time: "10:05", event: "Customer notified", detail: "Email and SMS sent" },
        ],
        tasks: [
            { title: "Dispatch two replacement items", detail: "Warehouse · due today" },
            { title: "File a claim with the courier", detail: "Operations · due Friday" },
        ],
    },
    {
        id: "r2",
        title: "Quote for 200 units",
        ref: "REQ-1047",
        customer: "Musa Ibrahim",
        team: "Sales",
        priority: "Normal",
        events: [
            { time: "07:55", event: "Received", detail: "Sent from the wholesale portal" },
            { time: "08:20", event: "Assigned", detail: "Sales · Daniel" },
            { time: "09:10", event: "Priced", detail: "Volume discount of 8% applied" },
            { time: "09:35", event: "Quote sent", detail: "Valid for 14 days" },
            { time: "09:40", event: "Follow-up booked", detail: "Call on Thursday" },
        ],
        tasks: [
            { title: "Confirm stock for 200 units", detail: "Inventory · due tomorrow" },
            { title: "Draft the delivery schedule", detail: "Logistics · due Thursday" },
        ],
    },
    {
        id: "r3",
        title: "Accounts for new staff",
        ref: "REQ-1051",
        customer: "Ngozi Obi",
        team: "IT",
        priority: "Low",
        events: [
            { time: "10:02", event: "Received", detail: "Three new staff start on Monday" },
            { time: "10:15", event: "Assigned", detail: "IT · Samuel" },
            { time: "10:50", event: "Accounts created", detail: "Roles set to Sales, read only" },
            { time: "11:05", event: "Waiting", detail: "Manager approval for admin access" },
        ],
        tasks: [
            { title: "Send login details", detail: "IT · due Monday" },
            { title: "Book an onboarding session", detail: "Admin · due Monday" },
        ],
    },
];

// ── Payments ───────────────────────────────────────────────────────────────

export const invoice = {
    number: "INV-2026-01873",
    payer: "Amina Bello",
    reference: "CUS-00142",
    period: "November 2026",
    items: [
        { label: "Annual software licence", amount: 185000 },
        { label: "Setup and onboarding", amount: 60000 },
        { label: "Extra user seats (3)", amount: 15000 },
        { label: "Priority support", amount: 5000 },
    ],
};

export const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
