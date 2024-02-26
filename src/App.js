import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const baseUrl = 'http://servicios.usig.buenosaires.gob.ar/normalizar/';

    const [address, setAddress] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(false);

    const fetch = async (url) => {
        try {
            const { data } = await axios.get(url);

            setResults(data.direccionesNormalizadas);

            if (data.errorMessage) {
                setError(data.errorMessage);
            } else {
                setError(false);
            }

            return data;
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const address = params.get('direccion');

        setAddress(address);

        const fetchAddress = async () => {
            await fetch(`${baseUrl}?direccion=${address}`);
        };

        if (address && address.trim() !== '') fetchAddress();
    }, []);

    const onChange = (e) => {
        setAddress(e.target.value);
        console.log(address);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!address || address.trim() === '') return;

        const params = new URLSearchParams(window.location.search);

        params.set('direccion', address.trim());

        window.history.replaceState(
            {},
            '',
            `${window.location.pathname}${address.trim() !== '' ? `?${params.toString()}` : ''}`
        );

        const results = await fetch(`${baseUrl}?direccion=${address}`);
        setResults(results.direccionesNormalizadas);
    };

    return (
        <div className="App">
            <h1>Buscador de direciones:</h1>
            <form onSubmit={onSubmit}>
                <input value={address} onChange={onChange} />
                <button type="submit">Buscar</button>
            </form>
            <ul>
                {results?.map(({ direccion }) => {
                    return (
                        <a href={`https://www.google.com/maps/search/${encodeURIComponent(direccion)}`} target="_blank">
                            <li>
                                <span>{direccion}</span>
                            </li>
                        </a>
                    );
                })}
                {error}
            </ul>
        </div>
    );
}

export default App;
