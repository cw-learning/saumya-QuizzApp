export const decodeHtmlEntities = (text = '') => {
  const input = text == null ? '' : String(text);

  if (typeof document !== 'undefined') {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = input;
    return textArea.value;
  }

  return input
    .replaceAll(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replaceAll(/&#(\d+);/g, (_, num) =>
      String.fromCodePoint(parseInt(num, 10))
    )
    .replaceAll(/&quot;/g, '"')
    .replaceAll(/&apos;/g, "'")
    .replaceAll(/&amp;/g, '&')
    .replaceAll(/&lt;/g, '<')
    .replaceAll(/&gt;/g, '>');
};