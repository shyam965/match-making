
import bcrypt from 'bcrypt';
import { prisma } from './config/db.js';
// import { prisma } from "../config/db.js";



export const createSuperAdmin = async () =>  {
try {
const email = "superadmin@gmail.com"

const existingEmail = await prisma.users.findUnique({where:{email:email}

})

    if (existingEmail) {
      console.log('Superadmin already exists!');
      return;
    }

    
    const hashedPassword = await bcrypt.hash('12345asd', 10);
const superAdmin = await prisma.users.create({
      data: {
        name: 'Super Admin',
        email: email,
        password: hashedPassword,
        role: 'superadmin', 
      },
    });
        console.log('🎉 Superadmin created:', superAdmin.email);

} catch (error) {
        console.error('Failed to create superadmin:', error);

}
}