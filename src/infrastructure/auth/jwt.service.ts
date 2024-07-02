// src/infrastructure/auth/jwt.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { v4 as generateUuid } from 'uuid';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  async sign(uuid: string, role: string, issuedAt: Date): Promise<string> {
    const jti = generateUuid();
    const payload = {
      jti,
      role,
      sub: uuid,
      iat: Math.floor(issuedAt.getTime() / 1000),
    };

    const jwt = this.jwtService.sign({
      data: this.encryptJWT(JSON.stringify(payload)),
      iat: Math.floor(issuedAt.getTime() / 1000),
    });

    return jwt;
  }

  private encryptJWT(data: string): string {
    // Implementa tu lógica de encriptación aquí
    return data; // Este es un ejemplo, debes reemplazarlo con una implementación real
  }
}
