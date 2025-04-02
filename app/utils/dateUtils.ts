/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Timestamp } from "firebase/firestore";

/**
 * Format a date or Firestore timestamp to a human-readable string
 * @param date Date or Firestore Timestamp object
 * @returns Formatted date string
 */
export function formatDate(date: Date | Timestamp): string {
  if (!date) return "";

  // Convert Firestore Timestamp to Date if needed
  const dateObj = date instanceof Timestamp ? date.toDate() : date;

  // Format options
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Intl.DateTimeFormat("ko-KR", options).format(dateObj);
}

/**
 * Get relative time (e.g., "3 hours ago", "2 days ago")
 * @param date Date or Firestore Timestamp object
 * @returns Relative time string
 */
export function getRelativeTime(date: Date | Timestamp): string {
  if (!date) return "";

  // Convert Firestore Timestamp to Date if needed
  const dateObj = date instanceof Timestamp ? date.toDate() : date;

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);

  if (diffSec < 60) {
    return "방금 전";
  } else if (diffMin < 60) {
    return `${diffMin}분 전`;
  } else if (diffHour < 24) {
    return `${diffHour}시간 전`;
  } else if (diffDay < 30) {
    return `${diffDay}일 전`;
  } else if (diffMonth < 12) {
    return `${diffMonth}개월 전`;
  } else {
    return `${diffYear}년 전`;
  }
}
