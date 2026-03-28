const fs = require('fs');

const files = [
  'd:/CODE/React-website-KSRD/src/pages/admin/UserManager.tsx',
  'd:/CODE/React-website-KSRD/src/pages/admin/Settings.tsx',
  'd:/CODE/React-website-KSRD/src/pages/admin/RecruitmentManager.tsx',
  'd:/CODE/React-website-KSRD/src/pages/admin/ProjectsManager.tsx',
  'd:/CODE/React-website-KSRD/src/pages/admin/ProductsManager.tsx',
  'd:/CODE/React-website-KSRD/src/pages/admin/NewsManager.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('useToast')) {
    // Inject import after AuthContext if it exists, else after react
    if (content.includes("from '../../contexts/AuthContext'")) {
        content = content.replace(/import \{ useAuth \} from '\.\.\/\.\.\/contexts\/AuthContext';(.*?)/, "import { useAuth } from '../../contexts/AuthContext';\nimport { useToast } from '../../contexts/ToastContext';$1");
    } else {
        content = content.replace("import React", "import { useToast } from '../../contexts/ToastContext';\nimport React");
    }
  }

  // add const { showToast } = useToast();
  if (!content.includes('showToast')) {
    content = content.replace(/export default function \w+\(\) \{/, match => match + "\n  const { showToast } = useToast();");
    content = content.replace(/const \w+ = \(\) => \{/, match => match + "\n  const { showToast } = useToast();");
  }

  // replace all alert(...) calls
  content = content.replace(/alert\((.+?)\);/g, (match, msg) => {
    let type = msg.toLowerCase().includes('thành công') ? 'success' : 'error';
    return `showToast(${msg}, '${type}');`;
  });

  fs.writeFileSync(file, content);
  console.log(`Refactored ${file}`);
}
