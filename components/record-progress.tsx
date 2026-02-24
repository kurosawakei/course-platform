"use client";

import { useEffect } from "react";
import { recordProgress } from "@/app/actions/progress";

export function RecordProgress({ courseId }: { courseId: string }) {
  useEffect(() => {
    recordProgress(courseId);
  }, [courseId]);

  return null;
}
