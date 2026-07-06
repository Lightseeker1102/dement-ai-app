import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getRiskColor, getRiskBg } from '../context';
export default function RiskBadge({ tier, size = 'md' }) {
    const color = getRiskColor(tier);
    const bg = getRiskBg(tier);
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5 rounded-full font-semibold',
        md: 'text-sm px-3 py-1 rounded-full font-semibold',
        lg: 'text-base px-4 py-1.5 rounded-full font-bold',
    };
    return (_jsxs("span", { className: `inline-flex items-center gap-1.5 shadow-sm ${sizeClasses[size]}`, style: { color, backgroundColor: bg, border: `1px solid ${color}30` }, children: [_jsx("span", { className: "rounded-full", style: {
                    width: size === 'sm' ? 6 : size === 'lg' ? 10 : 8,
                    height: size === 'sm' ? 6 : size === 'lg' ? 10 : 8,
                    backgroundColor: color,
                    display: 'inline-block',
                    flexShrink: 0,
                } }), tier] }));
}
