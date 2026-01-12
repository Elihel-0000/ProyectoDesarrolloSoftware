const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function encryptPassword() {
  const prisma = new PrismaClient();
  
  // CONFIGURA AQUÍ EL EMAIL Y LA NUEVA CONTRASEÑA
  const userEmail = process.env.USER_EMAIL || 'autoridad@ejemplo.com';
  const newPassword = process.env.NEW_PASSWORD || 'password123';

  try {
    console.log('🔄 Buscando usuario...\n');
    
    // Buscar el usuario
    const user = await prisma.usuario.findUnique({
      where: { correo: userEmail }
    });

    if (!user) {
      console.error(`❌ No se encontró usuario con email: ${userEmail}`);
      process.exit(1);
    }

    console.log(`✅ Usuario encontrado: ${user.nombre} (${user.rol})\n`);
    console.log('🔐 Encriptando contraseña...\n');

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña
    await prisma.usuario.update({
      where: { correo: userEmail },
      data: { contrasena: hashedPassword }
    });

    console.log('✅ Contraseña actualizada exitosamente!\n');
    console.log('─────────────────────────────────────');
    console.log(`📧 Email: ${userEmail}`);
    console.log(`🔑 Nueva contraseña: ${newPassword}`);
    console.log(`👤 Nombre: ${user.nombre}`);
    console.log(`🛡️  Rol: ${user.rol}`);
    console.log('─────────────────────────────────────\n');
    console.log('✅ Ahora puedes iniciar sesión con estas credenciales\n');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

encryptPassword();
