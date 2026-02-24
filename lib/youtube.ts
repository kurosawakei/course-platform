/**
 * YouTube URL を埋め込み用 URL に変換する（サーバーサイド専用）
 */
export function toEmbedUrl(youtubeUrl: string): string | null {
  try {
    const url = new URL(youtubeUrl);

    // https://www.youtube.com/watch?v=VIDEO_ID
    if (url.hostname.includes("youtube.com") && url.pathname === "/watch") {
      const videoId = url.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    // https://youtu.be/VIDEO_ID
    if (url.hostname === "youtu.be") {
      const videoId = url.pathname.slice(1);
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    // https://www.youtube.com/embed/VIDEO_ID（既に埋め込み形式）
    if (url.hostname.includes("youtube.com") && url.pathname.startsWith("/embed/")) {
      return youtubeUrl;
    }

    return null;
  } catch {
    return null;
  }
}
