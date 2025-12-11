"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Camera, X } from "lucide-react"

interface QRScannerProps {
  onScan: (data: { name?: string; idCard?: string; phone?: string }) => void
}

declare global {
  interface Window {
    jsQR?: (imageData: ImageData, width: number, height: number) => { data: string } | null
  }
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [scanMessage, setScanMessage] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadJsQR = async () => {
    if (window.jsQR) return
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js"
    script.onload = () => {
      console.log("[v0] jsQR loaded successfully")
    }
    document.body.appendChild(script)
  }

  const startCamera = async () => {
    try {
      setScanMessage("")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
        setIsScanning(true)
        await loadJsQR()
        scanQRCode()
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setScanMessage("无法访问摄像头，请检查权限")
    }
  }

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    setCameraActive(false)
    setIsScanning(false)
    setScanMessage("")
  }

  const scanQRCode = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !window.jsQR) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const scanFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = window.jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          console.log("[v0] QR code found:", code.data)
          try {
            const qrData = JSON.parse(code.data)
            onScan({
              name: qrData.name,
              idCard: qrData.idCard,
              phone: qrData.phone,
            })
            setScanMessage("扫描成功！")
            stopCamera()
            return
          } catch (error) {
            console.error("Error parsing QR data:", error)
            setScanMessage("二维码格式无效")
          }
        }
      }

      if (isScanning) {
        requestAnimationFrame(scanFrame)
      }
    }

    scanFrame()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScanMessage("")
    const reader = new FileReader()
    reader.onload = async (event) => {
      const img = new Image()
      img.onload = async () => {
        await loadJsQR()
        const canvas = canvasRef.current
        if (!canvas || !window.jsQR) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = window.jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          console.log("[v0] QR code found in image:", code.data)
          try {
            const qrData = JSON.parse(code.data)
            onScan({
              name: qrData.name,
              idCard: qrData.idCard,
              phone: qrData.phone,
            })
            setScanMessage("解析成功！")
          } catch (error) {
            console.error("Error parsing QR data:", error)
            setScanMessage("二维码格式无效")
          }
        } else {
          setScanMessage("未找到二维码")
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3">
      {!cameraActive ? (
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={startCamera}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <Camera size={18} />
            扫描二维码
          </Button>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-muted rounded-lg flex items-center justify-center gap-2"
          >
            <Upload size={18} />
            上传图片
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
      ) : (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className="w-full aspect-video object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          <Button
            type="button"
            onClick={stopCamera}
            className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center p-0"
          >
            <X size={20} />
          </Button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">
            对准二维码扫描
          </div>
        </div>
      )}
      {scanMessage && (
        <div
          className={`text-sm p-2 rounded text-center ${scanMessage.includes("成功") ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"}`}
        >
          {scanMessage}
        </div>
      )}
    </div>
  )
}
