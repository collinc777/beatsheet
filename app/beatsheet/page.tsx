import { BeatsheetView } from "@/app/beatsheet/BeatsheetView";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import React from "react";
import type { Act, Beat } from "./types";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  //   select first beatsheet from beatsheets
  //   select beats from beatsheets where beatsheetId = first beatsheet.id
  const { data: beatsheets, error } = await supabase
    .from("Beatsheets")
    .select("*")
    .limit(1);

  const beatSheet = beatsheets?.[0];

  //   const [acts, setActs] = React.useState([
  //     {
  //       title: "Introduction",
  //       id: "act1",
  //       beats: [
  //         {
  //           description: "Opening shot of the city",
  //           durationSeconds: 120,
  //           cameraAngle: "Wide",
  //           id: "beat1",
  //         },
  //         {
  //           description: "Main character introduction",
  //           durationSeconds: 90,
  //           cameraAngle: "Close-up",
  //           id: "beat2",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Rising Action",
  //       id: "act2",
  //       beats: [
  //         {
  //           description: "Tension building scene",
  //           durationSeconds: 180,
  //           cameraAngle: "Medium",
  //           id: "beat3",
  //         },
  //         {
  //           description: "Unexpected plot twist",
  //           durationSeconds: 150,
  //           cameraAngle: "Pan",
  //           id: "beat4",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Climax",
  //       id: "act3",
  //       beats: [
  //         {
  //           description: "Confrontation scene",
  //           durationSeconds: 200,
  //           cameraAngle: "Over-the-shoulder",
  //           id: "beat5",
  //         },
  //         {
  //           description: "Emotional peak",
  //           durationSeconds: 160,
  //           cameraAngle: "Close-up",
  //           id: "beat6",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Conclusion",
  //       id: "act4",
  //       beats: [
  //         {
  //           description: "Resolution of main conflict",
  //           durationSeconds: 140,
  //           cameraAngle: "Wide",
  //           id: "beat7",
  //         },
  //         {
  //           description: "Final scene",
  //           durationSeconds: 180,
  //           cameraAngle: "Drone shot",
  //           id: "beat8",
  //         },
  //       ],
  //     },
  //   ]);
  //   const addBeat = async (beat: Beat, actId: string, position: number) => {
  //     const newActs = [...acts];
  //     const actIndex = newActs.findIndex((act) => act.id === actId);
  //     const act = newActs[actIndex];
  //     act.beats.splice(position, 0, beat);
  //     setActs(newActs);
  //   };

  //   const deleteAct = async (id: string) => {
  //     const newActs = acts.filter((act) => act.id !== id);
  //     setActs(newActs);
  //   };
  //   const addActAtPosition = async (position: number, title: string) => {
  //     const newAct = {
  //       title,
  //       id: `act${acts.length + 1}`,
  //       beats: [],
  //     };
  //     const newActs = [...acts];
  //     newActs.splice(position, 0, newAct);
  //     setActs(newActs);
  //   };
  //   const deleteBeat = async (id: string) => {
  //     const newActs = [...acts];
  //     newActs.forEach((act) => {
  //       act.beats = act.beats.filter((beat) => beat.id !== id);
  //     });
  //     setActs(newActs);
  //   };

  //   const updateBeat = async (id: string, newBeat: Beat) => {
  //     const newActs = [...acts];
  //     newActs.forEach((act) => {
  //       act.beats = act.beats.map((beat) => {
  //         if (beat.id === id) {
  //           return newBeat;
  //         }
  //         return beat;
  //       });
  //     });
  //     console.log({ newActs });
  //     setActs(newActs);
  //   };
  //   return (
  //     <BeatsheetView
  //       acts={acts}
  //       updateBeat={updateBeat}
  //       deleteBeat={deleteBeat}
  //       addActAtPosition={addActAtPosition}
  //       deleteAct={deleteAct}
  //       addBeat={addBeat}
  //     />
  //   );
  return <BeatsheetView beatSheet={beatSheet} />;
}
