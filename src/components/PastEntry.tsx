import React, { FC } from "react";
import { Entry } from "../database/types";
import PastEntryItem from "./PastEntryItem";

interface PastEntryProps {
  entries: Entry[];
  onDelete: (id: number) => void;
  onEdit: (id: number, content: string) => void;
}

const PastEntry: FC<PastEntryProps> = ({ entries, onDelete, onEdit }) => {
  return (
    <>
      {entries.map((entry) => (
        <PastEntryItem key={entry.id} entry={entry} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </>
  );
};

export default PastEntry;
