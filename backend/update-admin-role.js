const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAdminRole() {
  try {
    const updated = await prisma.usuario.update({
      where: { correo: 'admin@test.com' },
      data: { rol: 'autoridad' }
    });
    console.log('✅ Rol actualizado exitosamente:');
    console.log(`   Email: ${updated.correo}`);
    console.log(`   Nombre: ${updated.nombre}`);
    console.log(`   Rol: ${updated.rol}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminRole();
