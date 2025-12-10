"use client"

import type { NucleicAcidResult } from "@/types/nucleic-acid"
import { Edit2, Trash2, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate, formatTime } from "@/lib/utils-date"

interface NucleicAcidTableProps {
  data: NucleicAcidResult[]
  onEdit: (item: NucleicAcidResult) => void
  onDelete: (id: number) => void
  isLoading?: boolean
}

const resultMap = {
  positive: {
    label: "阳性",
    icon: AlertCircle,
    bgColor: "bg-red-50 dark:bg-red-950",
    textColor: "text-red-700 dark:text-red-300",
    badgeColor: "bg-red-100 dark:bg-red-900",
  },
  negative: {
    label: "阴性",
    icon: CheckCircle2,
    bgColor: "bg-green-50 dark:bg-green-950",
    textColor: "text-green-700 dark:text-green-300",
    badgeColor: "bg-green-100 dark:bg-green-900",
  },
  pending: {
    label: "待检",
    icon: Clock,
    bgColor: "bg-amber-50 dark:bg-amber-950",
    textColor: "text-amber-700 dark:text-amber-300",
    badgeColor: "bg-amber-100 dark:bg-amber-900",
  },
}

export function NucleicAcidTable({ data, onEdit, onDelete, isLoading }: NucleicAcidTableProps) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">姓名</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">身份证号</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">电话</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">检测日期</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">检测时间</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">结果</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">检测地点</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">样本类型</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="text-5xl">📋</div>
                    <p className="text-muted-foreground font-medium">暂无数据</p>
                    <p className="text-sm text-muted-foreground">点击上方"新增记录"按钮开始添加核酸检测数据</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const resultInfo = resultMap[item.result as keyof typeof resultMap]
                const ResultIcon = resultInfo.icon
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/40 transition-colors duration-150 even:bg-muted/20 dark:even:bg-muted/10"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-mono">{item.id_number}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{item.phone || "-"}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{formatDate(item.test_date)}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {item.test_time ? formatTime(item.test_time) : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold ${resultInfo.badgeColor} ${resultInfo.textColor}`}
                      >
                        <ResultIcon size={16} />
                        <span>{resultInfo.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{item.test_location || "-"}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {item.sample_type === "throat" && "咽拭子"}
                      {item.sample_type === "nasal" && "鼻拭子"}
                      {item.sample_type === "saliva" && "唾液"}
                      {!item.sample_type && "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                          disabled={isLoading}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit2 size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(item.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 dark:text-red-400 dark:hover:text-red-300 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
