import { File } from '../entities/file.entity';

export interface FileRepository {
  save(file: File): Promise<File>;
  findByPath(path: string): Promise<File | null>;
}
