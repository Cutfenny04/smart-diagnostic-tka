import * as Icons from 'lucide-react';

/* Data lama pakai nama ikon Lucide gaya kebab-case (mis. "book-open"),
   sedangkan lucide-react meng-export komponennya dalam PascalCase
   (BookOpen). Helper ini mengubah salah satu ke bentuk yang lain. */
function toPascalCase(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export function getIcon(name) {
  return Icons[toPascalCase(name)] || Icons.CircleHelp;
}
