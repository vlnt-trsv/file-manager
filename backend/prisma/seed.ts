import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, NodeType } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.node.deleteMany();

  const documents = await prisma.node.create({
    data: {
      name: 'Documents',
      type: NodeType.FOLDER,
      path: '/Documents',
    },
  });

  const pictures = await prisma.node.create({
    data: {
      name: 'Pictures',
      type: NodeType.FOLDER,
      path: '/Pictures',
    },
  });

  const work = await prisma.node.create({
    data: {
      name: 'Work',
      type: NodeType.FOLDER,
      path: '/Documents/Work',
      parentId: documents.id,
    },
  });

  const personal = await prisma.node.create({
    data: {
      name: 'Personal',
      type: NodeType.FOLDER,
      path: '/Documents/Personal',
      parentId: documents.id,
    },
  });

  await prisma.node.createMany({
    data: [
      {
        name: 'report.pdf',
        type: NodeType.FILE,
        path: '/Documents/Work/report.pdf',
        parentId: work.id,
        size: 204800,
        mimeType: 'application/pdf',
      },
      {
        name: 'notes.txt',
        type: NodeType.FILE,
        path: '/Documents/Work/notes.txt',
        parentId: work.id,
        size: 1024,
        mimeType: 'text/plain',
      },
    ],
  });

  await prisma.node.create({
    data: {
      name: 'cv.docx',
      type: NodeType.FILE,
      path: '/Documents/Personal/cv.docx',
      parentId: personal.id,
      size: 51200,
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
  });

  await prisma.node.createMany({
    data: [
      {
        name: 'photo.jpg',
        type: NodeType.FILE,
        path: '/Pictures/photo.jpg',
        parentId: pictures.id,
        size: 2097152,
        mimeType: 'image/jpeg',
      },
      {
        name: 'avatar.png',
        type: NodeType.FILE,
        path: '/Pictures/avatar.png',
        parentId: pictures.id,
        size: 512000,
        mimeType: 'image/png',
      },
    ],
  });

  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
