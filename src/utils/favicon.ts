/**
 * Dynamically updates the browser favicon using the custom campus logo URL
 * @param logoUrl Absolute path or URL of the uploaded campus logo, or null to revert to default
 */
export function updateFavicon(logoUrl: string | null) {
  try {
    // Find all rel="icon" link tags (standard and apple-touch-icon)
    const links: NodeListOf<HTMLLinkElement> = document.querySelectorAll(
      "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']"
    );

    const targetUrl = logoUrl && logoUrl.trim() !== "" ? logoUrl : "/favicon.svg";

    if (links.length > 0) {
      links.forEach((link) => {
        link.href = targetUrl;
      });
    } else {
      // If no link exists, create a standard one
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.type = logoUrl ? "image/png" : "image/svg+xml";
      newLink.href = targetUrl;
      document.head.appendChild(newLink);
    }
  } catch (error) {
    console.error("Gagal memperbarui favicon:", error);
  }
}
