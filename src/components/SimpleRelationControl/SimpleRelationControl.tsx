'use client'

import axios from "axios";
import { useState } from "react";

type SimpleRelationControlProps = {
    baseUrl: string;
    add?: boolean;
    get?: boolean;
    update?: boolean;
    remove?: boolean;
};

export const SimpleRelationControl = <T, >({baseUrl, add = true, get = true, update = true, remove = true}: SimpleRelationControlProps) => {
    const [entities, setEntities] = useState<T[]>([])

    const [newEntityIdOne, setNewEntityIdOne] = useState<number>(-1)
    const [newEntityIdTwo, setNewEntityIdTwo] = useState<number>(-1)

    const [updateEntityId, setUpdateEntityId] = useState<number>(-1)
    const [updateEntityIdOne, setUpdateEntityIdOne] = useState<number>(-1)
    const [updateEntityIdTwo, setUpdateEntityIdTwo] = useState<number>(-1)


    const [deleteEntityId, setDeleteEntityId] = useState<number>(-1)
    // const [newEntity, setNewEntity] = useState('');
    // const [updateEntity, setUpdateEntity] = useState('');

    return (
    <div>
        {add ? <div>
            <input
                type="number"
                value={newEntityIdOne}
                onChange={({target}) => setNewEntityIdOne(Number(target.value))}
                placeholder="id"
            />
            <input
                type="number"
                value={newEntityIdTwo}
                onChange={({target}) => setNewEntityIdTwo(Number(target.value))}
                placeholder="id"
            />
            <button
                onClick={async () => {
                    const quests = await axios.post(baseUrl, {id1: newEntityIdOne, id2: newEntityIdTwo});
                    setNewEntityIdOne(-1);
                    setNewEntityIdTwo(-1);
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
                type="number"
                value={updateEntityId}
                onChange={({target}) => setUpdateEntityId(Number(target.value))}
                placeholder="update question id"
            />
            <input
                type="number"
                value={updateEntityIdOne}
                onChange={({target}) => setUpdateEntityIdOne(Number(target.value))}
                placeholder="id"
            />
            <input
                type="number"
                value={updateEntityIdTwo}
                onChange={({target}) => setUpdateEntityIdTwo(Number(target.value))}
                placeholder="id"
            />
            <button
                onClick={async () => {
                    const quests = await axios.patch(`${baseUrl}/?id=${updateEntityId}`, {id1: updateEntityIdOne, id: updateEntityIdTwo});
                    setUpdateEntityId(-1);
                    setUpdateEntityIdOne(-1);
                    setUpdateEntityIdTwo(-1);
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
