const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const admin = await prisma.usuario.findUnique({
      where: { correo: 'admin@test.com' }
    });
    console.log('Usuario admin:', JSON.stringify(admin, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
