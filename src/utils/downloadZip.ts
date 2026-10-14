/**
 * Helper to download the health-arogyaa-source.zip file reliably.
 * Works inside Google AI Studio / Cloud Run iframes by converting
 * the pre-packaged base64 data to a Blob URL, preventing Chrome
 * authentication redirect or cookie blocking.
 */
export async function downloadSourceZip(): Promise<void> {
  try {
    // 1. Check if window.__HEALTHAROGYAA_SOURCE_ZIP_B64__ is available
    const win = window as unknown as { __HEALTHAROGYAA_SOURCE_ZIP_B64__?: string };
    let base64Data = win.__HEALTHAROGYAA_SOURCE_ZIP_B64__;

    // 2. If not loaded on window, fetch from public/source-base64.js or fetch binary
    if (!base64Data) {
      try {
        const response = await fetch('/health-arogyaa-source.zip');
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'health-arogyaa-source.zip';
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 1000);
          return;
        }
      } catch {
        // Fallback to dynamic base64 script load
      }
    }

    if (base64Data) {
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'health-arogyaa-source.zip';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
      return;
    }

    // Direct window trigger fallback
    window.location.href = '/health-arogyaa-source.zip';
  } catch (err) {
    console.error('Failed to trigger zip download:', err);
    window.location.href = '/health-arogyaa-source.zip';
  }
}

export async function downloadDistZip(): Promise<void> {
  try {
    const response = await fetch('/health-arogyaa-dist.zip');
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'health-arogyaa-dist.zip';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
      return;
    }
    window.location.href = '/health-arogyaa-dist.zip';
  } catch (err) {
    console.error('Failed to trigger dist zip download:', err);
    window.location.href = '/health-arogyaa-dist.zip';
  }
}

