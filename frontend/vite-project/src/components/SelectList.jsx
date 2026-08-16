import React from 'react';

export default function ({ options, handleChange, name, jsonName }) {
    return (
        <select name={jsonName} className="form-select" onChange={handleChange}>
            <option defaultValue={{}}>{name}</option>
            {options.map((item, index) => (
                <option key={index} value={item.value}>{item.item}</option>
            ))}
        </select>
    );
}