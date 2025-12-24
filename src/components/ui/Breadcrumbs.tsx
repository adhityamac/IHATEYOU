'use client';

import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
    return (
        <div className={`flex items-center gap-2 text-sm font-medium text-white/40 ${className}`}>
            {items.map((item, index) => (
                <div key={item.href} className="flex items-center gap-2">
                    {index > 0 && <ChevronRight size={14} />}
                    <span className={index === items.length - 1 ? 'text-white' : 'hover:text-white/60 transition-colors'}>
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
}