export interface FormatRules {
  removeExtraSpaces: boolean;
  normalizeNewlines: boolean;
  smartQuotes: boolean;
  capitalizeFirstLetter: boolean;
  fixPunctuation: boolean;
  removeEmptyLines: boolean;
  trimLines: boolean;
  lineWidth: number;
}

export const formatText = (text: string, rules: FormatRules): string => {
  let formattedText = text;

  if (rules.removeExtraSpaces) {
    // Xóa khoảng trắng thừa
    formattedText = formattedText.replace(/\s+/g, " ");
  }

  if (rules.normalizeNewlines) {
    // Chuẩn hóa xuống dòng
    formattedText = formattedText.replace(/\r\n|\r|\n/g, "\n");
    formattedText = formattedText.replace(/\n\s*\n\s*\n/g, "\n\n");
  }

  if (rules.smartQuotes) {
    // Chuyển đổi dấu ngoặc kép đơn giản thành dấu ngoặc kép
    formattedText = formattedText
      .replace(/(\W|^)"(\w)/g, '$1"$2')
      .replace(/(\w)"/g, '$1"');
  }

  if (rules.capitalizeFirstLetter) {
    // Viết hoa chữ cái đầu câu
    formattedText = formattedText.replace(
      /(^|\.\s+|!\s+|\?\s+)([a-z])/g,
      (match, p1, p2) => p1 + p2.toUpperCase()
    );
  }

  if (rules.fixPunctuation) {
    // Sửa dấu câu
    formattedText = formattedText
      .replace(/\s+([.,!?;:])/g, "$1") // Xóa khoảng trắng trước dấu câu
      .replace(/([.,!?;:])\s*/g, "$1 ") // Thêm một khoảng trắng sau dấu câu
      .replace(/,{2,}/g, ",") // Xóa dấu phẩy trùng lặp
      .replace(/\.{2,}/g, "...") // Chuẩn hóa dấu chấm lửng
      .replace(/\s+\)/g, ")") // Xóa khoảng trắng trước dấu đóng ngoặc
      .replace(/\(\s+/g, "("); // Xóa khoảng trắng sau dấu mở ngoặc
  }

  if (rules.removeEmptyLines) {
    // Xóa dòng trống
    formattedText = formattedText.replace(/^\s*[\r\n]/gm, "");
  }

  if (rules.trimLines) {
    // Cắt khoảng trắng đầu/cuối mỗi dòng
    formattedText = formattedText
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
  }

  if (rules.lineWidth > 0) {
    // Giới hạn độ rộng dòng
    formattedText = formattedText
      .split("\n")
      .map((line) => {
        if (line.length <= rules.lineWidth) return line;

        const words = line.split(" ");
        let currentLine = "";
        const lines = [];

        words.forEach((word) => {
          if ((currentLine + " " + word).length <= rules.lineWidth) {
            currentLine += (currentLine ? " " : "") + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        });

        if (currentLine) {
          lines.push(currentLine);
        }

        return lines.join("\n");
      })
      .join("\n");
  }

  return formattedText;
};
