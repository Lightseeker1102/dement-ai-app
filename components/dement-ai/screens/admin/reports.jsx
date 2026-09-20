'use client';
import { useEffect } from 'react';
import { useApp } from '../../context';

export default function AdminReports() {
    const { navigate } = useApp();
    useEffect(() => {
        navigate('admin-dashboard');
    }, [navigate]);

    return null;
}
