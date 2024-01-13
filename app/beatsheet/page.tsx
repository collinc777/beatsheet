"use client";
import React from "react";

export default function Page() {
  const [acts, setActs] = React.useState([
    {
      title: "Introduction",
      id: "act1",
      beats: [
        {
          description: "Opening shot of the city",
          durationSeconds: 120,
          cameraAngle: "Wide",
          id: "beat1",
        },
        {
          description: "Main character introduction",
          durationSeconds: 90,
          cameraAngle: "Close-up",
          id: "beat2",
        },
      ],
    },
    {
      title: "Rising Action",
      id: "act2",
      beats: [
        {
          description: "Tension building scene",
          durationSeconds: 180,
          cameraAngle: "Medium",
          id: "beat3",
        },
        {
          description: "Unexpected plot twist",
          durationSeconds: 150,
          cameraAngle: "Pan",
          id: "beat4",
        },
      ],
    },
    {
      title: "Climax",
      id: "act3",
      beats: [
        {
          description: "Confrontation scene",
          durationSeconds: 200,
          cameraAngle: "Over-the-shoulder",
          id: "beat5",
        },
        {
          description: "Emotional peak",
          durationSeconds: 160,
          cameraAngle: "Close-up",
          id: "beat6",
        },
      ],
    },
    {
      title: "Conclusion",
      id: "act4",
      beats: [
        {
          description: "Resolution of main conflict",
          durationSeconds: 140,
          cameraAngle: "Wide",
          id: "beat7",
        },
        {
          description: "Final scene",
          durationSeconds: 180,
          cameraAngle: "Drone shot",
          id: "beat8",
        },
      ],
    },
  ]);
  const addBeat = async (beat: Beat, actId: string, position: number) => {
    const newActs = [...acts];
    const actIndex = newActs.findIndex((act) => act.id === actId);
    const act = newActs[actIndex];
    act.beats.splice(position, 0, beat);
    setActs(newActs);
  };

  const deleteAct = async (id: string) => {
    const newActs = acts.filter((act) => act.id !== id);
    setActs(newActs);
  };
  const addActAtPosition = async (position: number, title: string) => {
    const newAct = {
      title,
      id: `act${acts.length + 1}`,
      beats: [],
    };
    const newActs = [...acts];
    newActs.splice(position, 0, newAct);
    setActs(newActs);
  };
  const deleteBeat = async (id: string) => {
    const newActs = [...acts];
    newActs.forEach((act) => {
      act.beats = act.beats.filter((beat) => beat.id !== id);
    });
    setActs(newActs);
  };
  return (
    <PageView
      acts={acts}
      deleteBeat={deleteBeat}
      addActAtPosition={addActAtPosition}
      deleteAct={deleteAct}
      addBeat={addBeat}
    />
  );
}
type Beat = {
  description: string;
  durationSeconds: number;
  cameraAngle: string;
  id: string;
};

type Act = {
  title: string;
  id: string;
  beats: Beat[];
};

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/66FI8dNWdJt
 */
function PageView({
  acts,
  addActAtPosition,
  deleteAct,
  addBeat,
  deleteBeat,
}: {
  deleteBeat: any;
  acts: Act[];
  addActAtPosition: any;
  deleteAct: any;
  addBeat: any;
}) {
  return (
    <div className="bg-[#1a1c2b] min-h-screen text-white p-8">
      <div className="grid gap-8">
        {acts.map((act, index) => {
          return (
            <div>
              <AddAct position={index} addActAtPosition={addActAtPosition} />
              <ActView
                deleteBeat={deleteBeat}
                addBeat={addBeat}
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
  const [title, setTitle] = React.useState("");
  return (
    <div>
      <input
        type="text"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        placeholder="Act Title"
        autoFocus
        className="text-black"
      />
      <button
        onClick={async () => {
          await addActAtPosition(position, title);
        }}
      >
        Add
      </button>
    </div>
  );
}

function BeatForm({
  addBeat,
  position,
  actId,
}: {
  addBeat: any;
  position: number;
  actId: string;
}) {
  return (
    <div>
      <input type="text" placeholder="Description" />
      <input type="text" placeholder="Duration" />
      <input type="text" placeholder="Camera Angle" />
      <button
        onClick={() => {
          addBeat(
            {
              description: "Tension building scene",
              durationSeconds: 180,
              cameraAngle: "Medium",
              id: "beat3",
            },
            actId,
            position
          );
        }}
      >
        Add
      </button>
    </div>
  );
}

function BeatView({ beat, handleDelete }: { beat: Beat; handleDelete: any }) {
  // todo - incorporate all of the beat info
  const [editMode, setEditMode] = React.useState(false);
  return (
    <div className="bg-[#2d2f48] p-4 rounded-lg">
      <p>{beat.description}</p>
      <p>Camera Angle: {beat.cameraAngle}</p>
      <p>durationSeconds: {beat.durationSeconds}</p>
      <div className="flex justify-between">
        <button
          onClick={() => {
            setEditMode(true);
          }}
        >
          Edit
        </button>
        <button
          onClick={() => {
            handleDelete(beat.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function ActView({
  act,
  handleDeleteAct,
  addBeat,
  deleteBeat,
}: {
  act: Act;
  handleDeleteAct: any;
  addBeat: any;
  deleteBeat: any;
}) {
  return (
    <div>
      <div className="flex items-center mb-4 justify-between">
        <div className="bg-[#6f42c1] text-2xl font-bold px-4 py-1 rounded-l-full">
          {act.title}
        </div>
        <button onClick={handleDeleteAct}>Delete</button>
      </div>
      <div className="grid grid-cols-6 gap-4">
        <BeatForm addBeat={addBeat} position={0} actId={act.id} />
        {act.beats.map((beat, idx) => {
          return (
            <>
              <BeatView beat={beat} handleDelete={deleteBeat} />
              <BeatForm addBeat={addBeat} position={idx + 1} actId={act.id} />
            </>
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
