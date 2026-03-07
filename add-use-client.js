const fs = require('fs');
const path = require('path');

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.startsWith('"use client"')) {
        fs.writeFileSync(filePath, '"use client";\n' + content);
      }
    }
  });
}

walk('src/app/sections');
walk('src/app/components');

const file = 'src/app/LandingClient.tsx';
if (fs.existsSync(file)) {
    const c = fs.readFileSync(file, 'utf8');
    if (!c.startsWith('"use client"')) {
        fs.writeFileSync(file, '"use client";\n' + c);
    }
}
