import React from 'react';

export default function ({ options, setOption, name }) {
    return (
        <select className="form-select" onChange={(e) => {setOption(e.target.value)}}>
            <option defaultValue={{}}>{name}</option>
            {options.map((item, index) => (
                <option key={index} value={item.value}>{item.item}</option>
            ))}
        </select>
    );
}