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
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// 将空字符串转换为 null
function sanitizeData(data: Record<string, unknown>) {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    result[key] = value === "" ? null : value
  }
  return result
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await getSupabaseServerClient()

    // 清理数据，将空字符串转换为 null
    const insertData = sanitizeData({
      name: body.name,
      id_number: body.id_number,
      phone: body.phone,
      test_date: body.test_date,
      test_time: body.test_time,
      result: body.result,
      test_location: body.test_location,
      sample_type: body.sample_type,
      remarks: body.remarks,
    })

    const { data, error } = await supabase
      .from("nucleic_acid_results")
      .insert([insertData])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data?.[0] || {}, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
