const fs = require('fs');
const marked = require('C:\\Users\\hp\\AppData\\Roaming\\npm\\node_modules\\marked');

const md = fs.readFileSync('C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\91180e06-4cd3-4a53-b798-2acc087b133d\\DBS_IT_LMS_SOP.md', 'utf8');

const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>DBS IT LMS - SOP</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 850px; margin: 0 auto; padding: 40px; color: #333; }
        h1, h2, h3 { color: #111; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; margin-top: 1.5em; }
        h1 { border-bottom: 2px solid #eaecef; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #dfe2e5; padding: 10px 15px; text-align: left; }
        th { background-color: #f6f8fa; font-weight: 600; }
        tr:nth-child(even) { background-color: #f6f8fa; }
        blockquote { border-left: 5px solid #0366d6; margin: 1.5em 0; padding: 0.5em 15px; background-color: #f1f8ff; border-radius: 4px; }
        a { color: #0366d6; text-decoration: none; }
        a:hover { text-decoration: underline; }
        code { font-family: monospace; background-color: #f6f8fa; padding: 2px 5px; border-radius: 3px; }
        @media print {
            body { padding: 0; max-width: 100%; font-size: 11pt; }
            a { text-decoration: underline; color: #0366d6; }
            h1, h2, h3 { page-break-after: avoid; }
            table, img { page-break-inside: avoid; }
            blockquote { border-left: 5px solid #666; background-color: #eee; }
        }
    </style>
</head>
<body>
    ${marked.parse(md)}
</body>
</html>`;

fs.writeFileSync('C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\91180e06-4cd3-4a53-b798-2acc087b133d\\DBS_IT_LMS_SOP.html', html);
console.log('Successfully generated HTML!');
