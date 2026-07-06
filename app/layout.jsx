import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Analytics } from '@vercel/analytics/next';
import { Geist, Geist_Mono, Gloock } from 'next/font/google';
import './globals.css';
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});
const gloock = Gloock({ variable: '--font-gloock', subsets: ['latin'], weight: '400' });
export const metadata = {
    title: 'Dement(AI)',
    description: 'Cognitive Health Monitoring — early-stage dementia risk screening',
    generator: 'v0.app',
    icons: {
        icon: [
            {
                url: '/icon.svg',
                type: 'image/svg+xml',
            },
        ],
    },
};
export const viewport = {
    colorScheme: 'light',
    themeColor: '#2c7a7b',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", className: `${geistSans.variable} ${geistMono.variable} ${gloock.variable} bg-background`, children: _jsxs("body", { className: "font-sans antialiased bg-background text-foreground min-h-screen", children: [children, process.env.NODE_ENV === 'production' && _jsx(Analytics, {})] }) }));
}
