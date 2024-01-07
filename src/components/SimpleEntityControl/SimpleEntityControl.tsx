'use client'

import axios from "axios";
import { useState } from "react";

type SimpleEntityControlProps = {
    baseUrl: string;
    add?: boolean;
    get?: boolean;
    update?: boolean;
    remove?: boolean;
};

export const SimpleEntityControl = <T, >({baseUrl, add = true, get = true, update = true, remove = true}: SimpleEntityControlProps) => {
    const [entities, setEntities] = useState<T[]>([])
    const [deleteEntityId, setDeleteEntityId] = useState<number>(-1)
    const [updateEntityId, setUpdateEntityId] = useState<number>(-1)
    const [newEntity, setNewEntity] = useState('');
    const [updateEntity, setUpdateEntity] = useState('');

    return (
    <div>
        {add ? <div>
            <input
                value={newEntity}
                onChange={({target}) => setNewEntity(target.value)}
                placeholder="New question text"
            />
            <button
                onClick={async () => {
                    const quests = await axios.post(baseUrl, {text: newEntity});
                    setNewEntity('');
                    setEntities(quests.data as T[]);
                }}
            >
                add entity
            </button>
        </div> : null}
        {remove ? <div>
            <input
                type="number"
                value={deleteEntityId}
                onChange={({target}) => setDeleteEntityId(Number(target.value))}
                placeholder="id"
            />
            <button
                onClick={async () => {
                    const quests = await axios.delete(`${baseUrl}/?id=${deleteEntityId}`);
                    setDeleteEntityId(-1);
                    setEntities(quests.data as T[]);
                }}
            >
                Delete  entity
            </button>
        </div> : null}
        {update ? <div>
            <input
                value={updateEntity}
                onChange={({target}) => setUpdateEntity(target.value)}
                placeholder="Update question text"
            />
            <input
                type="number"
                value={updateEntityId}
                onChange={({target}) => setUpdateEntityId(Number(target.value))}
                placeholder="update question id"
            />
            <button
                onClick={async () => {
                    const quests = await axios.patch(`${baseUrl}/?id=${updateEntityId}`, {text: updateEntity});
                    setUpdateEntity("");
                    setUpdateEntityId(-1);
                    setEntities(quests.data as T[]);
                }}
            >
                update entity
            </button>
        </div> : null}
        {get ? <div>
            <button
                onClick={async () => {
                    setEntities([]);
                    const quests = await axios.get(baseUrl);
                    setEntities(quests.data as T[]);
                }}
            >
                show entities
            </button>
        </div> : null}
        <pre>{JSON.stringify(entities, null, 3)}</pre>
    </div>
    );
}
