const { execSync } = require('child_process');

console.log('Generando cliente de Prisma...');

try {
  // Usar el ejecutable de prisma directamente
  execSync('node node_modules/prisma/build/index.js generate', {
    cwd: __dirname,
    stdio: 'inherit'
  });
  console.log('\n✅ Cliente de Prisma generado correctamente');
} catch (error) {
  console.error('\n❌ Error al generar cliente de Prisma:', error.message);
  process.exit(1);
}
