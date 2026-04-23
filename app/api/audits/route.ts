import { NextResponse } from "next/server";
import { hasSupabase, supabase } from "@/lib/supabase";

export async function GET() {
  if (!hasSupabase || !supabase) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!hasSupabase || !supabase) {
    return NextResponse.json({ ok: true, localOnly: true });
  }

  const { error } = await supabase.from("audits").insert(body);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
