"use client";
import { nanoid } from "nanoid";
import { createClient } from "@/utils/supabase/client";
import React, { use, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, PlusCircleIcon } from "lucide-react";
export type Beat = {
  description: string;
  durationSeconds: number;
  cameraAngle: string;
  id: string;
};

export type Act = {
  title: string;
  id: string;
  beats: Beat[];
};

const useBeatsheet = (serverActs: Act[]) => {
  const supabase = createClient();
  const [acts, setActs] = React.useState(serverActs);
  useEffect(() => {
    const channel = supabase
      .channel("realtimeposts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Beatsheets",
        },
        (payload) => {
          console.log("does this get called");
          console.log({ payload });
          setActs(payload.new?.acts);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
  const addActAtPosition = async (position: number, title: string) => {
    const newAct = {
      title,
      id: nanoid(),
      beats: [],
    };
    const newActs = [...acts];
    newActs.splice(position, 0, newAct);
    const result = await supabase
      .from("Beatsheets")
      .update({ acts: newActs })
      .eq("id", 1);
  };
  const deleteAct = async (id: string) => {
    const newActs = acts.filter((act) => act.id !== id);
    const result = await supabase
      .from("Beatsheets")
      .update({ acts: newActs })
      .eq("id", 1);
  };
  const addBeat = async (beat: Beat, actId: string, position: number) => {
    const newActs = [...acts];
    const actIndex = newActs.findIndex((act) => act.id === actId);
    const act = newActs[actIndex];
    act.beats.splice(position, 0, beat);
    const result = await supabase
      .from("Beatsheets")
      .update({ acts: newActs })
      .eq("id", 1);
  };
  const deleteBeat = async (id: string) => {
    const newActs = [...acts];
    newActs.forEach((act) => {
      act.beats = act.beats.filter((beat) => beat.id !== id);
    });
    const result = await supabase
      .from("Beatsheets")
      .update({ acts: newActs })
      .eq("id", 1);
  };
  const updateBeat = async (id: string, newBeat: Beat) => {
    const newActs = [...acts];
    newActs.forEach((act) => {
      act.beats = act.beats.map((beat) => {
        if (beat.id === id) {
          return newBeat;
        }
        return beat;
      });
    });
    const result = await supabase
      .from("Beatsheets")
      .update({ acts: newActs })
      .eq("id", 1);
  };
  return { addBeat, deleteBeat, updateBeat, deleteAct, addActAtPosition, acts };
};

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

function ActivityIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function ArrowRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function BedIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  );
}

function BombIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="13" r="9" />
      <path d="m19.5 9.5 1.8-1.8a2.4 2.4 0 0 0 0-3.4l-1.6-1.6a2.41 2.41 0 0 0-3.4 0l-1.8 1.8" />
      <path d="m22 2-1.5 1.5" />
    </svg>
  );
}

function BookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function CameraIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function CastleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z" />
      <path d="M18 11V4H6v7" />
      <path d="M15 22v-4a3 3 0 0 0-3-3v0a3 3 0 0 0-3 3v4" />
      <path d="M22 11V9" />
      <path d="M2 11V9" />
      <path d="M6 4V2" />
      <path d="M18 4V2" />
      <path d="M10 4V2" />
      <path d="M14 4V2" />
    </svg>
  );
}

function FileQuestionIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <path d="M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function GamepadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
  );
}

function GoalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 13V2l8 4-8 4" />
      <path d="M20.55 10.23A9 9 0 1 1 8 4.94" />
      <path d="M8 10a5 5 0 1 0 8.9 2.02" />
    </svg>
  );
}

function GroupIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7V5c0-1.1.9-2 2-2h2" />
      <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
      <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
      <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
      <rect width="7" height="5" x="7" y="7" rx="1" />
      <rect width="7" height="5" x="10" y="12" rx="1" />
    </svg>
  );
}

function HistoryIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function LightbulbIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function ShovelIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 22v-5l5-5 5 5-5 5z" />
      <path d="M9.5 14.5 16 8" />
      <path d="m17 2 5 5-.5.5a3.53 3.53 0 0 1-5 0s0 0 0 0a3.53 3.53 0 0 1 0-5L17 2" />
    </svg>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function TargetIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
