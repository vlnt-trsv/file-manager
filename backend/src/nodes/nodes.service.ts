import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNodeDto } from './dto/create-node.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RenameNodeDto } from './dto/rename-node.dto';
import { MoveNodeDto } from './dto/move-node.dto';

@Injectable()
export class NodesService {
  constructor(private readonly prisma: PrismaService) {}

  // Найти все корни
  async findRoot() {
    return this.prisma.node.findMany({
      where: { parentId: null },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
  }

  // Найти дочерние узлы
  async findChildren(id: string) {
    await this.findOne(id);

    return this.prisma.node.findMany({
      where: { parentId: id },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
  }

  // Найти все узлы в дереве
  async findTree(id: string) {
    const root = await this.findOne(id);

    const result: any[] = [];
    const queue = [root];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;

      const children = await this.prisma.node.findMany({
        where: { parentId: current.id },
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
      });

      result.push({ ...current, children });
      queue.push(...children);
    }

    return result;
  }

  // Получить один узел
  async findOne(id: string) {
    const node = await this.prisma.node.findUnique({ where: { id } });

    if (!node) {
      throw new NotFoundException(`Node with id ${id} not found`);
    }

    return node;
  }

  // Поиск по имени
  async search(query: string) {
    return this.prisma.node.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
  }

  // Создать файл или папку
  async create(dto: CreateNodeDto) {
    let path: string;

    if (dto.parentId) {
      const parent = await this.findOne(dto.parentId);

      if (parent.type === 'FILE') {
        throw new BadRequestException('Cannot create node inside a file');
      }

      await this.checkNameUnique(dto.name, dto.parentId);

      path = `${parent.path}/${dto.name}`;
    } else {
      await this.checkNameUnique(dto.name, null);
      path = `/${dto.name}`;
    }

    return this.prisma.node.create({
      data: {
        name: dto.name,
        type: dto.type,
        path,
        parentId: dto.parentId ?? null,
        size: dto.size ?? null,
        mimeType: dto.mimeType ?? null,
      },
    });
  }

  // Переименовать файл или папку
  async rename(id: string, dto: RenameNodeDto) {
    const node = await this.findOne(id);

    await this.checkNameUnique(dto.name, node.parentId, id);

    // Заменяем последний сегмент пути на новое имя
    const newPath = node.path.replace(/[^/]+$/, dto.name);

    return this.prisma.$transaction(async (tx) => {
      // Обновляем path у всех потомков
      const descendants = await tx.node.findMany({
        where: { path: { startsWith: node.path + '/' } },
      });

      for (const desc of descendants) {
        await tx.node.update({
          where: { id: desc.id },
          data: { path: desc.path.replace(node.path, newPath) },
        });
      }

      return tx.node.update({
        where: { id },
        data: { name: dto.name, path: newPath },
      });
    });
  }

  // Переместить файл или папку
  async move(id: string, dto: MoveNodeDto) {
    const node = await this.findOne(id);
    const newParentId = dto.parentId ?? null;

    if (id === newParentId) {
      throw new BadRequestException('Cannot move node into itself');
    }

    if (newParentId) {
      const newParent = await this.findOne(newParentId);

      if (newParent.path.startsWith(node.path + '/')) {
        throw new BadRequestException(
          'Cannot move node into its own descendant',
        );
      }

      if (newParent.type === 'FILE') {
        throw new BadRequestException('Cannot move node into a file');
      }

      await this.checkNameUnique(node.name, newParentId, id);
    }

    const newBasePath = newParentId
      ? `${(await this.findOne(newParentId)).path}/${node.name}`
      : `/${node.name}`;

    const oldPath = node.path;

    return this.prisma.$transaction(async (tx) => {
      const descendants = await tx.node.findMany({
        where: { path: { startsWith: oldPath + '/' } },
      });

      for (const desc of descendants) {
        await tx.node.update({
          where: { id: desc.id },
          data: { path: desc.path.replace(oldPath, newBasePath) },
        });
      }

      return tx.node.update({
        where: { id },
        data: { parentId: newParentId, path: newBasePath },
      });
    });
  }

  // Удалить
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.node.delete({
      where: { id },
    });
  }

  private async checkNameUnique(
    name: string,
    parentId: string | null,
    excludeId?: string,
  ) {
    const existing = await this.prisma.node.findFirst({
      where: {
        name,
        parentId,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Node with name "${name}" already exists in this folder`,
      );
    }
  }
}
