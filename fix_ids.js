const fs = require('fs');

function updateFile(path, prefix) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/id:\s*(\d+),/g, (match, p1) => {
    return `id: '${prefix}_${p1.padStart(3, '0')}',`;
  });
  content = content.replace(/id:\s*number;/g, 'id: string;');
  fs.writeFileSync(path, content);
}

updateFile('src/data/projects.ts', 'local_ksrd_project');
updateFile('src/data/news.ts', 'local_ksrd_news');
updateFile('src/data/products.ts', 'local_ksrd_product');
console.log('Done mapping IDs');
