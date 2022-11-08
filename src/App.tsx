/// <reference types="react-scripts" />

import React from 'react';
import dice from "./dice.svg";
import './App.css';
import {QueryClient, QueryClientProvider, useQuery} from "react-query";


function Card({title, text, onRefresh}: {
    title: string, text: string, onRefresh: () => void
}) {
    return <div className="Quote-card">
        <h3>{title}</h3>
        <div className="quote">{text}</div>
        <img src={dice} className="dice" alt="logo" onClick={onRefresh}/>
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
        return response.json()
    })

    if (adviceIsLoading || adviceIsFetching) {
        return <div>loading some advice...</div>
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
            <div className="App">
                <CardController/>
            </div>
        </QueryClientProvider>
    );
}

export default App;
