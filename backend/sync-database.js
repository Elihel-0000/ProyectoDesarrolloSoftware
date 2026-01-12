const { execSync } = require('child_process');

console.log('==============================================');
console.log('Sincronizando Base de Datos con Prisma Schema');
console.log('==============================================\n');

try {
  // Usar prisma db push para sincronizar sin crear migraciones
  console.log('Ejecutando: prisma db push...\n');
  
  execSync('node node_modules/prisma/build/index.js db push', {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  console.log('\n✅ Base de datos sincronizada correctamente');
  console.log('\nTablas creadas:');
  console.log('  - Comment (Comentarios)');
  console.log('  - Vote (Votos)');
  console.log('\n✅ Ahora puedes reiniciar el backend con: npm run start:dev');
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.log('\nSi el backend está ejecutándose, deténlo primero (Ctrl+C)');
  process.exit(1);
}
