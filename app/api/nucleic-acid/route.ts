import { getSupabaseServerClient } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from("nucleic_acid_results")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.log("[v0] GET error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.log("[v0] GET exception:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] POST body:", body)
    
    const supabase = await getSupabaseServerClient()

    // 确保数据格式正确
    const insertData = {
      name: body.name,
      id_number: body.id_number,
      phone: body.phone || null,
      test_date: body.test_date,
      test_time: body.test_time || null,
      result: body.result,
      test_location: body.test_location || null,
      sample_type: body.sample_type || null,
      remarks: body.remarks || null,
    }

    console.log("[v0] Insert data:", insertData)

    const { data, error } = await supabase
      .from("nucleic_acid_results")
      .insert([insertData])
      .select()

    if (error) {
      console.log("[v0] POST error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log("[v0] POST success:", data)
    return NextResponse.json(data?.[0] || {}, { status: 201 })
  } catch (error) {
    console.log("[v0] POST exception:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
