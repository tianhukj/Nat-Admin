export interface NucleicAcidResult {
  id: number
  name: string
  id_number: string
  phone?: string
  test_date: string
  test_time?: string
  result: "positive" | "negative" | "pending"
  test_location?: string
  sample_type?: string
  remarks?: string
  created_at: string
  updated_at: string
}

export type CreateNucleicAcidInput = Omit<NucleicAcidResult, "id" | "created_at" | "updated_at">
