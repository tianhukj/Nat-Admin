import { NucleicAcidPage } from "@/components/nucleic-acid-page"

export const metadata = {
  title: "核酸检测管理系统",
  description: "核酸检测结果录入和管理系统",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NucleicAcidPage />
      </div>
    </main>
  )
}
