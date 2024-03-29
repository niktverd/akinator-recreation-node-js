'use client'

import axios from "axios";
import { useState } from "react";
import Question from "@/models/Question";
import Link from "next/link";

export const Navigation = () => {
    const [items] = useState([
        {text: 'main', url: '/'},
        {text: 'answers', url: '/answers'},
        {text: 'questions', url: '/questions'},
        {text: 'game', url: '/game'},
        {text: 'games', url: '/games'},
        {text: 'game-details', url: '/game-details'},
        {text: 'games-history', url: '/games-history'},
    ]);

    return (
    <div
        style={{
            display: 'flex'
        }}
    >
        {items.map((item) => {
            return <div key={item.url}>
                <Link style={{margin: 10}} href={item.url}>{item.text}</Link>
            </div>;
        })}
    </div>
    );
}
