import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { MunicipioService } from 'src/municipio/municipio.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
    // Ya no necesitas 'municipioService' aquí si eliminas la función de abajo
    private readonly municipioService: MunicipioService, 
  ) {
    super({
      clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, name, emails, photos } = profile;

      // Arreglamos el nombre 'undefined' y obtenemos la foto
      const googlePictureUrl = photos[0]?.value;
      const googleName = `${name.givenName} ${name.familyName || ''}`.trim();

      // Buscar usuario por providerId O email
      const userByProvider = await this.usersService.findUserAuth({
        providerId: id,
        provider: 'google',
      });

      const userByEmail = await this.usersService.findUserAuth({
        email: emails[0].value,
      });

      let user = userByProvider || userByEmail;

      if (!user) {
        // --- SECCIÓN PARA CREAR USUARIO NUEVO ---
        
        // Ya no buscamos un municipio por defecto
        
        // Crear nuevo usuario
        user = await this.usersService.createUser({
          provider: 'google',
          providerId: id,
          email: emails[0].value,
          name: googleName, // <-- Nombre corregido
          picture: googlePictureUrl, // <-- Foto guardada
          municipio: null, // <--- ¡AQUÍ ESTÁ EL CAMBIO!
          role: 'client',
          password: null,
          isDeleted: false,
        });
      } else if (user.provider === 'local' && user.password) {
        // El email ya existe con contraseña local.
        // Devolvemos un objeto simple que SOLO contiene la bandera de error.
        return done(null, {
          __google_auth_error__:
            'Este email ya está registrado con email y contraseña.',
        });
        
      } else {
        // --- ACTUALIZACIÓN DE USUARIO EXISTENTE ---
        // Actualizamos sus datos por si cambió la foto o el nombre.
        user = await this.usersService.updateUser(
          { _id: user._id },
          {
            provider: 'google',
            providerId: id,
            picture: googlePictureUrl, // <-- Actualiza la foto
            name: googleName, // <-- Actualiza el nombre
          },
        );
      }

      // Si todo salió bien (crear o actualizar), pasamos el usuario real.
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }

  // --- ¡DEBES ELIMINAR O COMENTAR ESTA FUNCIÓN! ---
  /*
  private async getDefaultMunicipio() {
    try {
      const municipios = await this.municipioService.findAll();
      return municipios[0]; // Retorna el primer municipio, no el array
    } catch (error) {
      console.error('Error obteniendo municipio por defecto:', error);
      throw new Error('No se pudo obtener el municipio por defecto');
    }
  }
  */
}