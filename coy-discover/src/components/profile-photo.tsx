"use client";

import Image from "next/image";
import { useState } from "react";

export function ProfilePhoto({
  name,
  photo,
  alt,
  priority = false,
  className,
}: {
  name: string;
  photo: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (failed) {
    return (
      <div
        aria-label={alt ?? name}
        className={`profile-photo-fallback ${className ?? ""}`}
        role="img"
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`profile-photo ${className ?? ""}`}>
      <Image
        alt={alt ?? name}
        className="profile-photo-image"
        fill
        onError={() => setFailed(true)}
        priority={priority}
        sizes="(max-width: 640px) 90vw, 440px"
        src={photo}
        unoptimized
      />
    </div>
  );
}
