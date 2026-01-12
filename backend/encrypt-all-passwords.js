const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function encryptAllPasswords() {
  const prisma = new PrismaClient();
  
  // Define aquí los usuarios con sus contraseñas en texto plano
  const users = [
    { email: 'autoridad@ejemplo.com', password: 'password123' },
    { email: 'admin@ejemplo.com', password: 'admin123' },
    // Agrega más usuarios aquí según necesites
  ];

  try {
    console.log('🔄 Actualizando contraseñas...\n');
    
    for (const userData of users) {
      try {
        // Verificar si el usuario existe
        const user = await prisma.usuario.findUnique({
          where: { correo: userData.email }
        });

        if (!user) {
          console.log(`⚠️  Usuario no encontrado: ${userData.email}`);
          continue;
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Actualizar
        await prisma.usuario.update({
          where: { correo: userData.email },
          data: { contrasena: hashedPassword }
        });

        console.log(`✅ ${userData.email}`);
        console.log(`   Nombre: ${user.nombre}`);
        console.log(`   Rol: ${user.rol}`);
        console.log(`   Contraseña: ${userData.password}\n`);
        
      } catch (error) {
        console.error(`❌ Error con ${userData.email}:`, error.message);
      }
    }
    
    console.log('─────────────────────────────────────');
    console.log('✅ Proceso completado\n');
    
  } catch (err) {
    console.error('❌ Error general:', err.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

encryptAllPasswords();
