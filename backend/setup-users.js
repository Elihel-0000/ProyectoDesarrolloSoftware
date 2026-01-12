const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function setupUsers() {
  try {
    // Verificar usuarios existentes
    const usuarios = await prisma.usuario.findMany({
      select: { correo: true, nombre: true, rol: true }
    });
    
    console.log('📋 Usuarios existentes:');
    usuarios.forEach(u => {
      console.log(`   - ${u.correo} | ${u.nombre} | ${u.rol}`);
    });
    
    // Crear usuario ciudadano si no existe
    const ciudadanoEmail = 'usuario@test.com';
    const ciudadanoExiste = await prisma.usuario.findUnique({
      where: { correo: ciudadanoEmail }
    });
    
    if (!ciudadanoExiste) {
      const hashedPassword = await bcrypt.hash('usuario123', 10);
      await prisma.usuario.create({
        data: {
          correo: ciudadanoEmail,
          nombre: 'Usuario Trabajador',
          contrasena: hashedPassword,
          rol: 'ciudadano',
          estado: 'active'
        }
      });
      console.log('\n✅ Usuario ciudadano creado:');
      console.log(`   Email: ${ciudadanoEmail}`);
      console.log(`   Contraseña: usuario123`);
    } else {
      console.log(`\n✅ Usuario ciudadano ya existe: ${ciudadanoEmail}`);
    }
    
    console.log('\n📝 CREDENCIALES FINALES:');
    console.log('─────────────────────────────────────');
    console.log('👤 CIUDADANO/TRABAJADOR (reporta denuncias):');
    console.log('   Email: usuario@test.com');
    console.log('   Contraseña: usuario123');
    console.log('\n🛡️  AUTORIDAD (gestiona denuncias):');
    console.log('   Email: admin@test.com');
    console.log('   Contraseña: admin123');
    console.log('─────────────────────────────────────');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

setupUsers();
