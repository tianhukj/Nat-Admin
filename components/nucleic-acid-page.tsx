"use client"

import { useState, useEffect } from "react"
import { NucleicAcidForm } from "./nucleic-acid-form"
import { NucleicAcidTable } from "./nucleic-acid-table"
import type { NucleicAcidResult } from "@/types/nucleic-acid"
import { Plus, Search } from "lucide-react"

export function NucleicAcidPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<NucleicAcidResult | undefined>()
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState<NucleicAcidResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/nucleic-acid")
        if (!response.ok) throw new Error("Failed to fetch")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredData =
    data?.filter(
      (item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id_number.includes(searchTerm),
    ) || []

  const stats = {
    total: data?.length || 0,
    negative: data?.filter((item) => item.result === "negative").length || 0,
    positive: data?.filter((item) => item.result === "positive").length || 0,
    pending: data?.filter((item) => item.result === "pending").length || 0,
  }

  const handleAddNew = () => {
    setEditingItem(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (item: NucleicAcidResult) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true)
      if (editingItem) {
        const response = await fetch(`/api/nucleic-acid/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!response.ok) throw new Error("Update failed")
      } else {
        const response = await fetch("/api/nucleic-acid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!response.ok) throw new Error("Create failed")
      }
      const refreshResponse = await fetch("/api/nucleic-acid")
      if (refreshResponse.ok) {
        const result = await refreshResponse.json()
        setData(result)
      }
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error:", error)
      alert("操作失败，请重试")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除此记录吗？")) return
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/nucleic-acid/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Delete failed")
      const refreshResponse = await fetch("/api/nucleic-acid")
      if (refreshResponse.ok) {
        const result = await refreshResponse.json()
        setData(result)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("删除失败，请重试")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            核酸检测管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400">专业的检测结果录入和管理系统</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 px-6 py-2 rounded-lg font-medium"
        >
          <Plus size={20} />
          新增记录
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">总检测数</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">阴性</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">{stats.negative}</p>
            </div>
            <div className="text-4xl">✓</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border border-red-200 dark:border-red-800 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">阳性</p>
              <p className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">{stats.positive}</p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border border-amber-200 dark:border-amber-800 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">待检</p>
              <p className="text-3xl font-bold text-amber-700 dark:text-amber-300 mt-2">{stats.pending}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="搜索姓名或身份证号..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">加载中...</div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              找到 <span className="font-semibold text-gray-900 dark:text-white">{filteredData.length}</span> 条记录
            </p>
          </div>
          <NucleicAcidTable data={filteredData} onEdit={handleEdit} onDelete={handleDelete} isLoading={isSubmitting} />
        </>
      )}

      {isFormOpen && (
        <NucleicAcidForm
          initialData={editingItem}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setIsFormOpen(false)
            setEditingItem(undefined)
          }}
          isLoading={isSubmitting}
        />
      )}
    </div>
  )
}
