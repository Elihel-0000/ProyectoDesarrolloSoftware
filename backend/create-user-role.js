const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function createUser() {
  const prisma = new PrismaClient();
  
  // Configuración del usuario - MODIFICA ESTOS VALORES
  const userConfig = {
    email: process.env.USER_EMAIL || 'authority@example.com',
    password: process.env.USER_PASSWORD || 'password123',
    name: process.env.USER_NAME || 'Autoridad Municipal',
    role: process.env.USER_ROLE || 'authority', // citizen | authority | admin
  };

  try {
    console.log('🔄 Creando usuario...\n');
    
    const hashedPassword = await bcrypt.hash(userConfig.password, 10);

    const user = await prisma.usuario.upsert({
      where: { correo: userConfig.email },
      update: {
        nombre: userConfig.name,
        contrasena: hashedPassword,
        rol: userConfig.role,
        estado: 'active',
      },
      create: {
        correo: userConfig.email,
        nombre: userConfig.name,
        contrasena: hashedPassword,
        rol: userConfig.role,
        estado: 'active',
      },
    });

    console.log('✅ Usuario creado/actualizado exitosamente:\n');
    console.log('─────────────────────────────────────');
    console.log(`📧 Email: ${user.correo}`);
    console.log(`👤 Nombre: ${user.nombre}`);
    console.log(`🔑 Rol: ${user.rol}`);
    console.log(`📝 Estado: ${user.estado}`);
    console.log(`🔢 ID: ${user.id}`);
    console.log('─────────────────────────────────────\n');
    
    if (userConfig.role === 'admin') {
      console.log('⚠️  ADMIN - Acceso total al sistema');
    } else if (userConfig.role === 'authority') {
      console.log('🛡️  AUTORIDAD - Puede gestionar denuncias');
    } else {
      console.log('👤 CIUDADANO - Puede crear denuncias');
    }
    
  } catch (err) {
    console.error('❌ Error al crear usuario:', err.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
