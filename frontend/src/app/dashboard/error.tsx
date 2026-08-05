"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="p-8 flex items-center justify-center min-h-[70vh]">
      <Card className="border border-gray-100 shadow-sm max-w-md w-full">
        <CardContent className="p-8 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Couldn&apos;t load this page</h2>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
              Could not reach the backend. Make sure FastAPI is running on port 8000, then try again.
            </p>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            Retry
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
