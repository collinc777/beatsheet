import { redirect } from "next/navigation";

export default async function Page() {
  redirect("/beatsheet");
  // redirect to /beatsheet
  return <div>Home</div>;
}
