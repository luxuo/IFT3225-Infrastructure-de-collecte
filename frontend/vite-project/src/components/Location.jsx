import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

function ambianceToValue(ambiance) {
    const value = (ambiance || '').toLowerCase();

    if (value === 'calme') return 0;
    if (value === 'social' || value === 'neutre') return 1;
    if (value === 'bruyant' || value === 'chaotique') return 2;

    return 1;
}

function ambianceToLabel(value) {
    if (value === 0) return 'calme';
    if (value === 1) return 'modéré';
    if (value === 2) return 'animé';

    return value;
}

export default function({ location_measurements }) {
    const measurements = location_measurements?.measurements ?? [];

    const chartData = measurements
        .slice()
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map((measurement, index) => ({
            x: `M${index + 1}`,
            y: ambianceToValue(measurement.ambiance),
        }));

    if (chartData.length === 0) {
        return (
            <div className='text-center mt-5'>
                <p>Aucune mesure disponible pour tracer le graphe.</p>
            </div>
        );
    }

    return (
        <div className='text-center mt-5' style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis
                        domain={[0, 2]}
                        ticks={[0, 1, 2]}
                        tickFormatter={ambianceToLabel}
                    />
                    <Tooltip
                        formatter={(value) => ambianceToLabel(value)}
                        labelFormatter={(label) => `Mesure ${label}`}
                    />
                    <Line type="monotone" dataKey="y" stroke="#0d6efd" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}