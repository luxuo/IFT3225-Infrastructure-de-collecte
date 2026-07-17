import React, { useState, useEffect } from 'react';
import AccountForm from '../components/AccountForm'
import useLogin from '../hooks/useLogin';
import LoadError from '../components/loading/LoadError';
import Loading from '../components/loading/Loading';

export default function(){
    const { setUsername, setPassword, handleClick, loading, error } = useLogin(true);

    if (loading){
        return (
            <Loading loadMessage={"Création de compte..."} />
        );
    }

    return (
        <div>
            <AccountForm statement={'Créer un compte'} handleClick={handleClick} setUsername={setUsername} setPassword={setPassword}/>
            {error? <LoadError errorMessage={error}/>:<div></div>}
        </div>
    );
}