import React, { useState, useEffect } from 'react';
import Location from '../components/Location.jsx';
import { useParams } from "react-router";

export default function(){
    const {location} = useParams();
    return (
        <Location location={location}></Location>
    )
}