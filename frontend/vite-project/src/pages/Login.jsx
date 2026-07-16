import React, { useState, useEffect } from 'react';
import AccountForm from '../components/AccountForm'
import useLogin from '../hooks/useLogin';

export default function(){
    const { login, loading, error } = useLogin();

    const handleClick = async (event) => {
        event.preventDefault();
    };

    return (
        <div>
            <AccountForm statement={'Se Connecter'} handleClick={handleClick}/>
        </div>
    )
}