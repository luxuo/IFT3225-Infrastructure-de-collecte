import React from 'react';

export default function({location_measurements}){

    return (
        <div className='text-center mt-5'>{location_measurements.measurements[0].ambiance}</div>
    )
}