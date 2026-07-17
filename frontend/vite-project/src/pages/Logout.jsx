import React from 'react';
import { Navigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';

export default function(){
    useLogout();
    return (
        <Navigate to='/' />
    );
}