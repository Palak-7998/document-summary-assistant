async function processFile() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) {
    alert("Please upload a file.");
    return;
  }

  const fileType = file.type;

  if (fileType === "application/pdf") {
    const reader = new FileReader();
    reader.onload = async function () {
      try {
        const pdf = await pdfjsLib.getDocument(reader.result).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(" ");
        }

        console.log("Extracted text:", text);
        document.getElementById("summaryBox").innerText = "Generating summary...";
        simulateSummary(text);
      } catch (err) {
        console.error("PDF Parsing Error:", err);
        document.getElementById("summaryBox").innerText = "Failed to extract text from PDF.";
      }
    };
    reader.readAsArrayBuffer(file);
  } else if (fileType.startsWith("image/")) {
    document.getElementById("summaryBox").innerText = "Extracting text from image...";
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      console.log("Extracted text:", text);
      simulateSummary(text);
    } catch (err) {
      console.error("Image OCR Error:", err);
      document.getElementById("summaryBox").innerText = "Failed to extract text from image.";
    }
  } else {
    alert("Unsupported file type. Please upload a PDF or image.");
  }
}
function simulateSummary(text) {
  console.log("Extracted text:", text);

  if (!text || text.trim().length < 10) {
    document.getElementById("summaryBox").innerText =
      "No readable content was extracted from the document. Please try a different file or ensure the image/PDF contains typed text.";
    return;
  }

  // Clean up OCR output
  const cleanedText = text
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z0-9., ]/g, "") // Remove noisy characters
    .replace(/(TR TV TO ){5,}/gi, "")
    .replace(/(x o i v ){5,}/gi, "");

  const sentences = cleanedText.split(". ").filter(s => s.length > 20);
  const length = document.querySelector('input[name="length"]:checked').value;

  let sliceCount;
  if (length === "short") sliceCount = 2;
  else if (length === "medium") sliceCount = 5;
  else sliceCount = 10;

  let summary;
  if (sentences.length === 0) {
    summary = "No meaningful sentences were found in the document.";
  } else if (sentences.length < sliceCount) {
    summary = sentences.join(". ") + "...";
    summary += `\n\n(Note: Only ${sentences.length} readable sentences found. Showing full content.)`;
  } else {
    summary = sentences.slice(0, sliceCount).join(". ") + "...";
  }

  const summaryWordCount = summary.split(" ").filter(w => w.trim().length > 0).length;

  const output = `This summary contains approximately ${summaryWordCount} words.\n\nHere is a ${length} summary:\n\n${summary}\n\n(Simulated summary due to API restrictions.)`;

  document.getElementById("summaryBox").innerText = output;
}
