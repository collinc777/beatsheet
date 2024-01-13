"use client";
import { nanoid } from "nanoid";
import React, { use } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, PlusCircleIcon } from "lucide-react";
import { useBeatsheet } from "./useBeatsheet";
import { Act, Beat } from "./types";
export function BeatsheetView({ serverActs }: { serverActs: Act[] }) {
  const { addActAtPosition, addBeat, deleteAct, deleteBeat, updateBeat, acts } =
    useBeatsheet(serverActs);
  return (
    <div className="bg-[#1a1c2b] min-h-screen text-white p-8">
      <div>
        {acts.map((act, index) => {
          return (
            <div key={act.title}>
              <AddAct
                key={act.title}
                position={index}
                addActAtPosition={addActAtPosition}
              />
              <ActView
                deleteBeat={deleteBeat}
                addBeat={addBeat}
                updateBeat={updateBeat}
                act={act}
                key={act.title}
                handleDeleteAct={() => {
                  deleteAct(act.id);
                }}
              />
            </div>
          );
        })}
        <AddAct position={acts.length} addActAtPosition={addActAtPosition} />
      </div>
    </div>
  );
}

function AddAct({
  position,
  addActAtPosition,
}: {
  position: number;
  addActAtPosition: any;
}) {
  const [showForm, setShowForm] = React.useState(false);
  const [title, setTitle] = React.useState("");
  if (!showForm) {
    return (
      <div className="flex flex-col justify-center p-3">
        <Button
          onClick={() => {
            setShowForm(true);
          }}
        >
          Add Act
        </Button>
      </div>
    );
  }
  return (
    <div className={"flex space-x-3 py-3"}>
      <Input
        type="text"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        placeholder="Act Title"
        autoFocus
      />
      <Button
        variant={"secondary"}
        onClick={async () => {
          await addActAtPosition(position, title);
        }}
      >
        Add
      </Button>
    </div>
  );
}

function AddBeat({
  addBeat,
  position,
  actId,
}: {
  addBeat: any;
  position: number;
  actId: string;
}) {
  const [showForm, setShowForm] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [cameraAngle, setCameraAngle] = React.useState("");
  if (!showForm) {
    return (
      <div className="flex flex-col justify-center p-3">
        <Button
          variant={"success"}
          size={"icon"}
          onClick={() => {
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4">
      <Input
        type="text"
        autoFocus
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Duration"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Camera Angle"
        value={cameraAngle}
        onChange={(e) => setCameraAngle(e.target.value)}
      />
      <div className="flex justify-between py-2">
        <Button
          onClick={() => {
            addBeat(
              {
                description: description,
                durationSeconds: parseInt(duration),
                cameraAngle: cameraAngle,
                id: nanoid(),
              },
              actId,
              position
            );
            setShowForm(false);
          }}
        >
          Add
        </Button>
        <Button
          variant={"secondary"}
          onClick={() => {
            setShowForm(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

function BeatView({
  beat,
  handleDelete,
  updateBeat,
}: {
  beat: Beat;
  handleDelete: any;
  updateBeat: any;
}) {
  // todo - incorporate all of the beat info
  const [editMode, setEditMode] = React.useState(false);
  return (
    <div className="bg-[#2d2f48] p-4 rounded-lg w-80">
      {editMode ? (
        <UpdateBeatForm
          beat={beat}
          updateBeat={updateBeat}
          setEditMode={setEditMode}
        />
      ) : (
        <>
          <p>{beat.description}</p>
          <p>Camera Angle: {beat.cameraAngle}</p>
          <p>durationSeconds: {beat.durationSeconds}</p>
          <div className="flex justify-between">
            <Button
              variant={"secondary"}
              onClick={() => {
                setEditMode(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => {
                handleDelete(beat.id);
              }}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function UpdateBeatForm({
  beat,
  updateBeat,
  setEditMode,
}: {
  beat: Beat;
  updateBeat: any;
  setEditMode: any;
}) {
  const [description, setDescription] = React.useState(beat.description);
  const [duration, setDuration] = React.useState(beat.durationSeconds);
  const [cameraAngle, setCameraAngle] = React.useState(beat.cameraAngle);

  return (
    <div>
      <Input
        type="text"
        autoFocus
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Duration"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      />
      <Input
        type="text"
        placeholder="Camera Angle"
        value={cameraAngle}
        onChange={(e) => setCameraAngle(e.target.value)}
      />
      <div className="flex justify-between">
        <Button
          onClick={async () => {
            await updateBeat(beat.id, {
              description,
              durationSeconds: duration,
              cameraAngle,
              id: beat.id,
            });
            setEditMode(false);
          }}
        >
          Update
        </Button>
        <Button variant={"secondary"}>Cancel</Button>
      </div>
    </div>
  );
}

function ActView({
  act,
  handleDeleteAct,
  updateBeat,
  addBeat,
  deleteBeat,
}: {
  act: Act;
  handleDeleteAct: any;
  updateBeat: any;
  addBeat: any;
  deleteBeat: any;
}) {
  return (
    <div className="overflow-auto">
      <div className="flex items-center mb-4 justify-between">
        <div className="bg-[#6f42c1] text-2xl font-bold px-4 py-1 rounded-l-full">
          {act.title}
        </div>
        <Button variant={"destructive"} onClick={handleDeleteAct}>
          Delete
        </Button>
      </div>
      <div className="flex">
        <AddBeat addBeat={addBeat} position={0} actId={act.id} />
        {act.beats.map((beat, idx) => {
          return (
            <div className="flex" key={beat.id}>
              <BeatView
                key={beat.id}
                beat={beat}
                handleDelete={deleteBeat}
                updateBeat={updateBeat}
              />
              <AddBeat
                key={beat.id}
                addBeat={addBeat}
                position={idx + 1}
                actId={act.id}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
