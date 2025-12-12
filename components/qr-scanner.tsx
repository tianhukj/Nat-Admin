"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, Camera, X } from "lucide-react"

interface QRScannerProps {
  onScan: (data: { name?: string; idCard?: string; phone?: string }) => void
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [cameraActive, setCameraActive] = useState(false)
  const [scanMessage, setScanMessage] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanningRef = useRef(false)

  const loadJsQRLibrary = (): Promise<void> => {
    return new Promise((resolve) => {
      if ((window as any).jsQR) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js"
      script.crossOrigin = "anonymous"
      script.onload = () => resolve()
      script.onerror = () => {
        console.error("[v0] Failed to load jsQR library")
        resolve()
      }
      document.head.appendChild(script)
    })
  }

  const decodeQRCode = async (imageData: ImageData): Promise<string | null> => {
    try {
      await loadJsQRLibrary()
      if (!(window as any).jsQR) {
        console.error("[v0] jsQR not available")
        return null
      }

      const result = (window as any).jsQR(imageData.data, imageData.width, imageData.height)
      console.log("[v0] jsQR result:", result)
      return result?.data || null
    } catch (e) {
      console.error("[v0] decode error:", e)
      return null
    }
  }

  const startCamera = async () => {
    try {
      setScanMessage("正在启动摄像头...")
      console.log("[v0] Starting camera")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      console.log("[v0] Camera stream obtained")
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
        scanningRef.current = true
        setScanMessage("")
        setTimeout(() => scanQRCode(), 100)
      }
    } catch (error) {
      console.error("[v0] Camera error:", error)
      setScanMessage("无法访问摄像头，请检查权限")
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    console.log("[v0] Stopping camera")
    scanningRef.current = false
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        console.log("[v0] Stopping track:", track.kind)
        track.stop()
      })
      streamRef.current = null
    }
    setCameraActive(false)
  }

  const scanQRCode = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !scanningRef.current) {
      console.log("[v0] Scan stopped: missing refs or not scanning")
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.log("[v0] Failed to get canvas context")
      return
    }

    const scanFrame = async () => {
      if (!scanningRef.current) return

      try {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const qrData = await decodeQRCode(imageData)

          if (qrData) {
            console.log("[v0] QR code detected:", qrData)
            try {
              const data = JSON.parse(qrData)
              console.log("[v0] Parsed data:", data)
              onScan({
                name: data.name || "",
                idCard: data.idCard || "",
                phone: data.phone || "",
              })
              setScanMessage("✓ 扫描成功！")
              stopCamera()
              return
            } catch (error) {
              console.error("[v0] JSON parse error:", error)
              setScanMessage("⚠ 二维码格式无效")
            }
          }
        }
      } catch (e) {
        console.error("[v0] Frame scan error:", e)
      }

      if (scanningRef.current) {
        requestAnimationFrame(scanFrame)
      }
    }

    scanFrame()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log("[v0] Image upload started:", file.name)
    setScanMessage("正在处理图片...")

    const reader = new FileReader()
    reader.onload = async (event) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = async () => {
        console.log("[v0] Image loaded, size:", img.width, "x", img.height)
        const canvas = canvasRef.current
        if (!canvas) {
          console.error("[v0] Canvas ref is null")
          setScanMessage("✗ 系统错误，请重试")
          return
        }

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          console.error("[v0] Canvas context not available")
          setScanMessage("✗ 系统错误，请重试")
          return
        }

        try {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          console.log("[v0] Image data extracted, processing QR code...")
          const qrData = await decodeQRCode(imageData)

          if (qrData) {
            console.log("[v0] QR found in image:", qrData)
            try {
              const data = JSON.parse(qrData)
              console.log("[v0] Parsed image data:", data)
              onScan({
                name: data.name || "",
                idCard: data.idCard || "",
                phone: data.phone || "",
              })
              setScanMessage("✓ 解析成功！")
              if (fileInputRef.current) {
                fileInputRef.current.value = ""
              }
            } catch (error) {
              console.error("[v0] Parse error:", error)
              setScanMessage("⚠ 二维码格式无效，请确保是正确的 JSON 格式")
            }
          } else {
            console.log("[v0] No QR code detected in image")
            setScanMessage("✗ 未检测到二维码，请上传包含二维码的图片")
          }
        } catch (error) {
          console.error("[v0] Canvas operation error:", error)
          setScanMessage("✗ 图片处理失败")
        }
      }

      img.onerror = () => {
        console.error("[v0] Image load error")
        setScanMessage("✗ 图片加载失败，请选择有效的图片文件")
      }

      setTimeout(() => {
        img.src = event.target?.result as string
      }, 0)
    }

    reader.onerror = () => {
      console.error("[v0] FileReader error")
      setScanMessage("✗ 文件读取失败")
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3">
      {!cameraActive ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={startCamera}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 px-4 py-2 font-medium transition-colors"
          >
            <Camera size={18} />
            扫描二维码
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-foreground rounded-lg flex items-center justify-center gap-2 px-4 py-2 font-medium transition-colors border border-gray-300 dark:border-gray-600"
          >
            <Upload size={18} />
            上传图片
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
      ) : (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full aspect-video object-cover"
            onLoadedMetadata={() => {
              console.log("[v0] Video metadata loaded")
            }}
          />
          <canvas ref={canvasRef} className="hidden" />
          <button
            type="button"
            onClick={stopCamera}
            className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center p-0 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">
            对准二维码扫描
          </div>
        </div>
      )}
      {scanMessage && (
        <div
          className={`text-sm p-2 rounded text-center font-medium ${
            scanMessage.includes("✓") || scanMessage.includes("正在")
              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
          }`}
        >
          {scanMessage}
        </div>
      )}
    </div>
  )
}
