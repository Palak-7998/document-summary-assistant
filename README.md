# Document Summary Assistant  
**Palak Pal – Roll No: 220164520117**

## What This App Does
This app lets you upload a PDF or image file and shows a summary of the document. It works even if the real summary API is blocked.

## Features
- Upload PDF or image files (`.pdf`, `.jpg`, `.jpeg`, `.png`)
- Extract real text using `pdf.js` and `Tesseract.js`
- Choose summary length: Short, Medium, Long
- Shows word count and a preview of the content
- Works even if the internet blocks the summary API

## How to Use
1. Open `index.html` in your browser (use Live Server if possible)
2. Upload a document
3. Choose summary length
4. Click "Generate Summary"
5. See the result below the button

## Notes
- If the file has no readable text, it will show a message
- The summary is simulated (not from a real AI) because of internet restrictions
- The app is ready for full summary integration when deployed online

## Hosting
You can host this app on Netlify or Vercel to make it live.
