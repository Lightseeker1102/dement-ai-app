'use client';
import { useEffect } from 'react';
import { useApp } from '../../context';

export default function DoctorReports() {
    const { navigate } = useApp();
    useEffect(() => {
        navigate('doctor-dashboard');
    }, [navigate]);

    return null;
}
