/// <reference types="react-scripts" />

import React, {useEffect, useState} from 'react';
import dice from "./dice.svg";
import pattern from "./pattern-divider-desktop.svg";
import patternMobile from "./pattern-divider-mobile.svg";
import './App.css';
import {QueryClient, QueryClientProvider, useQuery} from "react-query";


function Card({title, text, onRefresh}: {
    title: string, text: string, onRefresh: () => void
}) {

    const [width, setWidth] = useState<number>(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 800;


    return <div className="quote-card">
        <h3 className="quote-title">Advice #{title}</h3>
        <div className="quote">"{text}"</div>
        {isMobile ?
            <img src={patternMobile} className="divider" alt="pattern divider"/> :
        <img src={pattern} className="divider" alt="pattern divider"/>
        }
        <div className="dice-container">
            <img src={dice} className="dice" alt="logo" onClick={onRefresh}/>
        </div>

    </div>
}

function CardController() {

    const {
        isLoading: adviceIsLoading,
        isFetching: adviceIsFetching,
        isError,
        data: advice,
        refetch
    } = useQuery("get.advice", async () => {
            const response = await fetch("https://api.adviceslip.com/advice");
            return response.json();
        },
        {
            refetchOnWindowFocus: false,
        })

    if (adviceIsLoading || adviceIsFetching) {
        return <div></div>
    }

    if (isError)
        return <div>Error loading advice...</div>

    async function onRefresh() {
        await refetch();
    }

    return <Card title={advice.slip.id}
                 text={advice.slip.advice}
                 onRefresh={onRefresh}
    />

}

const client = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={client}>
            <div className="app">
                <CardController/>
            </div>
        </QueryClientProvider>
    );
}

export default App;
