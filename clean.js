const fs = require('fs');
const path = require('path');

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');

      // Replace any instance of `\"use client\";\n` or `\"use client\";\r\n` anywhere.
      let newcontent = content.replace(/\\"use client\\";\r?\n/g, '');
      
      if (newcontent !== content) {
          fs.writeFileSync(filePath, newcontent);
      }
    }
  });
}

walk('src/app');
walk('src/components');
