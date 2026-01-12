const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  const prisma = new PrismaClient();
  try {
    const email = 'admin@test.com';
    const plain = 'admin123';
    const saltRounds = 10;

    const hashed = await bcrypt.hash(plain, saltRounds);

    const admin = await prisma.usuario.upsert({
      where: { correo: email },
      update: {
        nombre: 'Admin',
        contrasena: hashed,
        rol: 'admin',
        estado: 'active',
      },
      create: {
        correo: email,
        nombre: 'Admin',
        contrasena: hashed,
        rol: 'admin',
        estado: 'active',
      },
    });

    console.log('Admin upserted:', { id: admin.id, correo: admin.correo });
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
