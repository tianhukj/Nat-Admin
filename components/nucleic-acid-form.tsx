"use client"

import type React from "react"
import { useState } from "react"
import type { NucleicAcidResult } from "@/types/nucleic-acid"
import { X } from "lucide-react"
import { QRScanner } from "./qr-scanner"

interface NucleicAcidFormProps {
  initialData?: NucleicAcidResult
  onSubmit: (data: any) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

export function NucleicAcidForm({ initialData, onSubmit, onClose, isLoading = false }: NucleicAcidFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    id_number: initialData?.id_number || "",
    phone: initialData?.phone || "",
    test_date: initialData?.test_date || "",
    test_time: initialData?.test_time || "",
    result: initialData?.result || "pending",
    test_location: initialData?.test_location || "",
    sample_type: initialData?.sample_type || "throat",
    remarks: initialData?.remarks || "",
  })

  const handleQRScan = (qrData: { name?: string; idCard?: string; phone?: string }) => {
    const today = new Date().toISOString().split("T")[0]
    setFormData((prev) => ({
      ...prev,
      name: qrData.name || prev.name,
      id_number: qrData.idCard || prev.id_number,
      phone: qrData.phone || prev.phone,
      test_date: prev.test_date || today,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {initialData ? "编辑检测结果" : "新增检测结果"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {!initialData && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3 font-medium">使用二维码快速填充信息</p>
              <QRScanner onScan={handleQRScan} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入姓名"
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                身份证号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.id_number}
                onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                placeholder="请输入身份证号"
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">电话</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="请输入电话"
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                检测日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.test_date}
                onChange={(e) => setFormData({ ...formData, test_date: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">检测时间</label>
              <input
                type="time"
                value={formData.test_time}
                onChange={(e) => setFormData({ ...formData, test_time: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                检测结果 <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="pending">待检</option>
                <option value="negative">阴性</option>
                <option value="positive">阳性</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">检测地点</label>
              <input
                type="text"
                value={formData.test_location}
                onChange={(e) => setFormData({ ...formData, test_location: e.target.value })}
                placeholder="请输入检测地点"
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">样本类型</label>
              <select
                value={formData.sample_type}
                onChange={(e) => setFormData({ ...formData, sample_type: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="throat">咽拭子</option>
                <option value="nasal">鼻拭子</option>
                <option value="saliva">唾液</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">备注</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="请输入备注信息（可选）"
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white min-h-24 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50"
            >
              {isLoading ? "提交中..." : "提交"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
