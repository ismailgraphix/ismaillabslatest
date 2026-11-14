"use client";
// components/AbujaClock.tsx
// "It is 14:05 in Abuja", kept current, and, once working hours are set in
// lib/site.ts, how the studio's working day lines up with the visitor's.
// The time is filled in after mount, since the server cannot know when the
// page will be read.
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

// Abuja keeps West Africa Time (UTC+1) all year. The IANA zone for it is Lagos.
const ABUJA_TZ = "Africa/Lagos";
const ABUJA_OFFSET_MIN = 60;
// The visitor's working day, for the overlap: 09:00 to 17:00 their time.
const VISITOR_DAY = { start: 9, end: 17 };

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
const hhmm = (hours: number) => {
    const h = ((hours % 24) + 24) % 24;
    return `${pad(h)}:${pad((h % 1) * 60)}`;
};

function overlapLine(): string | null {
    const hours = site.workingHours;
    if (!hours) return null;
    const visitorOffsetMin = -new Date().getTimezoneOffset();
    const shift = (visitorOffsetMin - ABUJA_OFFSET_MIN) / 60; // hours to add to Abuja time
    if (shift === 0) return `Same time zone as you. We work ${hhmm(hours.start)} to ${hhmm(hours.end)}.`;

    const start = hours.start + shift;
    const end = hours.end + shift;
    const from = Math.max(start, VISITOR_DAY.start);
    const to = Math.min(end, VISITOR_DAY.end);
    const ours = `We work ${hhmm(start)} to ${hhmm(end)} your time`;
    return to > from
        ? `${ours}, overlapping your day from ${hhmm(from)} to ${hhmm(to)}.`
        : `${ours}. We reply by email outside the overlap.`;
}

export default function AbujaClock() {
    const [time, setTime] = useState<string | null>(null);
    const [overlap, setOverlap] = useState<string | null>(null);

    useEffect(() => {
        const format = new Intl.DateTimeFormat("en-GB", { timeZone: ABUJA_TZ, hour: "2-digit", minute: "2-digit", hour12: false });
        const update = () => setTime(format.format(new Date()));
        update();
        setOverlap(overlapLine());
        const id = window.setInterval(update, 15_000);
        return () => window.clearInterval(id);
    }, []);

    return (
        <div className="font-body text-sm text-[var(--muted)]">
            <p>
                {time ? (
                    <>
                        It is <time className="font-mono text-[var(--text)] tabular-nums">{time}</time> in Abuja.
                    </>
                ) : (
                    <>{site.location} · {site.timeZone}</>
                )}
            </p>
            {overlap && <p className="mt-1">{overlap}</p>}
        </div>
    );
}
