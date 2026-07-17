import React, { useState, useEffect } from 'react';
import AccountForm from '../components/AccountForm'
import useLogin from '../hooks/useLogin';
import LoadError from '../components/loading/LoadError';
import Loading from '../components/loading/Loading';

export default function(){
    const { setUsername, setPassword, handleClick, loading, error } = useLogin();

    if (loading){
        return (
            <Loading loadMessage={"Connexion en cours..."} />
        );
    }

    return (
        <div>
            <AccountForm statement={'Se Connecter'} handleClick={handleClick} setUsername={setUsername} setPassword={setPassword}/>
            {error? <LoadError errorMessage={error}/>:<></>}
        </div>
    );
}