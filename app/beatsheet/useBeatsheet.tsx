"use client";
import { nanoid } from "nanoid";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect } from "react";
import { Act, Beat } from "./types";

export const useBeatsheet = (serverActs: Act[]) => {
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
          setActs((payload.new as any)?.acts);
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
