"use client";

import Link from "next/link";
import { useCursors } from "./cursors-provider";

export default function Home() {
  const { getCount } = useCursors();
  const count = getCount();

  return (
    <div className="w-full flex flex-col gap-8">
      <section className="bg-yellow-100 w-full p-2 rounded flex justify-center items-center text-xl">
        <p>
          <strong>{count}</strong> potential roommate online!{count != 1 ? "s" : ""} 🥳
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h1 className="text-4xl font-medium pb-6">Stan Davis - Find Your Roommates</h1>
        <p>What you’ll find here...</p>
        <ul className="list-disc list-inside">
          <li>Awesome people!</li>
          <li>Cool conversations</li>
          <li>Your future roommates!</li>
        </ul>
        {/* <p>
          Check <code>README.md</code> for how to run this locally in 3 steps.
        </p> */}
      </section>

      <Link href="/chat" className="underline">
        <button className="flex items-center justify-center px-10 py-6 border border-stone-200 rounded-lg shadow hover:shadow-md">
          HOP IN -&gt;
        </button>
      </Link>
    </div>
  );
}
