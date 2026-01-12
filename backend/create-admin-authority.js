const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function createAdminAndAuthority() {
  const prisma = new PrismaClient();
  
  // Usuarios a crear
  const users = [
    {
      email: 'admin@municipio.com',
      password: 'admin123',
      name: 'Administrador del Sistema',
      role: 'admin'
    },
    {
      email: 'autoridad@municipio.com',
      password: 'autoridad123',
      name: 'Autoridad Municipal',
      role: 'authority'
    }
  ];

  try {
    console.log('🚀 Iniciando creación de usuarios...\n');
    
    for (const userData of users) {
      console.log(`🔄 Procesando: ${userData.email}`);
      
      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Crear o actualizar usuario
      const user = await prisma.usuario.upsert({
        where: { correo: userData.email },
        update: {
          nombre: userData.name,
          contrasena: hashedPassword,
          rol: userData.role,
          estado: 'active',
        },
        create: {
          correo: userData.email,
          nombre: userData.name,
          contrasena: hashedPassword,
          rol: userData.role,
          estado: 'active',
        },
      });

      console.log(`✅ Usuario ${user.rol} creado/actualizado`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.correo}`);
      console.log(`   Nombre: ${user.nombre}\n`);
    }

    console.log('═════════════════════════════════════════════════');
    console.log('✅ USUARIOS CREADOS EXITOSAMENTE\n');
    console.log('📋 CREDENCIALES DE ACCESO:');
    console.log('─────────────────────────────────────────────────');
    console.log('\n🔴 ADMINISTRADOR:');
    console.log('   📧 Email: admin@municipio.com');
    console.log('   🔑 Contraseña: admin123');
    console.log('   🛡️  Rol: admin');
    console.log('   ⚡ Permisos: Acceso total al sistema\n');
    
    console.log('🔵 AUTORIDAD MUNICIPAL:');
    console.log('   📧 Email: autoridad@municipio.com');
    console.log('   🔑 Contraseña: autoridad123');
    console.log('   🛡️  Rol: authority');
    console.log('   ⚡ Permisos: Gestionar denuncias\n');
    console.log('═════════════════════════════════════════════════\n');
    
  } catch (err) {
    console.error('❌ Error al crear usuarios:', err.message);
    console.error(err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

createAdminAndAuthority();
