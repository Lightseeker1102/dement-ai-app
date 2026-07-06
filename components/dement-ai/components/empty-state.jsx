'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function EmptyState({ title, description, icon, action }) {
    return (_jsxs("div", { className: "rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-8", children: [_jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground", children: icon }), _jsx("h3", { className: "text-xl font-semibold text-foreground", children: title }), _jsx("p", { className: "mx-auto mt-2 max-w-md text-base leading-relaxed text-muted-foreground", children: description }), action && _jsx("div", { className: "mt-6 flex justify-center", children: action })] }));
}
