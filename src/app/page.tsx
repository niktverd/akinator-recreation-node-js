'use client'

import styles from './page.module.css'
import GameLogic from '@/logic'
import Db from '@/logic/db';
import { TestAnswers } from '@/components/TestAnswers/TestAnswers';

const gl = new GameLogic();
const db = new Db();

export default function Home() {
    return (
        <main className={styles.main}>
            <TestAnswers db={db} />
        </main>
    )
}
