"use client";
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

export type Beatsheet = {
  id: string;
  title: string;
  acts: Act[];
};
