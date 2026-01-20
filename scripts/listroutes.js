const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../src/app');

function getRoutes(dir, route = '') {
  let routes = [];

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      routes = routes.concat(getRoutes(fullPath, `${route}/${file}`));
    } else if (file.startsWith('page.')) {
      const cleanRoute = route || '/';
      routes.push({
        route: cleanRoute.replace(/\/+/g, '/'),
        file: fullPath.replace(process.cwd() + '/', '')
      });
    } else if (file.match(/^\[.*\]\.jsx?$/)) {
      const dynamic = file.replace(/\.(jsx?|tsx?)$/, '');
      routes.push({
        route: `${route}/${dynamic}`.replace(/\/+/g, '/'),
        file: fullPath.replace(process.cwd() + '/', '')
      });
    }
  }

  return routes;
}

const allRoutes = getRoutes(appDir);

// Sort by route
allRoutes.sort((a, b) => a.route.localeCompare(b.route));

// Calculate column widths
const routeColWidth = Math.max(...allRoutes.map(r => r.route.length), 10);
const fileColWidth = Math.max(...allRoutes.map(r => r.file.length), 20);

// 🖨 Table Header
console.log('\n📍 Routes in App Router:\n');
console.log(
  `  ${'Route'.padEnd(routeColWidth)} | ${'File Path'.padEnd(fileColWidth)}  `
);
console.log(
  `--${'-'.repeat(routeColWidth)}---${'-'.repeat(fileColWidth)}--`
);

// 🖨 Table Rows
allRoutes.forEach(r => {
  console.log(
    `  ${r.route.padEnd(routeColWidth)} | ${r.file.padEnd(fileColWidth)}  `
  );
});
