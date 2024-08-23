import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from 'src/base/application/email.service';
import {
  PasswordRecoveryCode,
  PasswordRecoveryCodeSchema,
} from './auth/schemas/PasswordRecoveryCode.schema';
import { AppSettings, appSettings } from 'src/settings/app-settings';
import { User, UserSchema } from './user/schemas/User.schema';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { AuthRepository } from './auth/auth.repository';
import { UserRepository } from './user/user.repository';
import { UserQueryRepository } from './user/user.query.repository';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { SetNewPasswordUseCase } from './auth/use-cases/setNewPassword-use-case';
import { LoginUserUseCase } from './auth/use-cases/loginUser-use-case';
import { RegisterUserUseCase } from './auth/use-cases/registerUser-use-case';
import { ConfirmationRegistrationUserUseCase } from './auth/use-cases/confirmationRegistration-use-case';
import { RegistrationEmailResendingUseCase } from './auth/use-cases/registrationEmailResending-use-case';
import { PasswordRecoveryUseCase } from './auth/use-cases/passwordRecovery-use-case';
import { CreateUserUseCase } from './user/use-cases/createUser-use.case';
import { DeleteUserUseCase } from './user/use-cases/deleteUser-use.case';
import { TransformUser } from './user/DTOs/output/TransformUser';
import { Session, SessionSchema } from './auth/schemas/Session.schema';
import {  CreateSessionUseCase } from './auth/use-cases/createSession-use-case';
import { TokenService } from 'src/base/application/jwt.service';
import { SetNewTokensUseCase } from './auth/use-cases/setNewTokens-use-case';
import { UpdateSessionUseCase } from './auth/use-cases/updateSession-use-case';
import { DeleteSessionUseCase } from './auth/use-cases/deleteSession-use-case';
import { DeviceQueryRepository } from './securityDevices/device.query.repository';
import { DeleteDevicesUseCase } from './securityDevices/use-cases/deleteDevices-use-case';
import { DeleteDeviceByIdUseCase } from './securityDevices/use-cases/deleteDeviceById-use-case';
import { TransformDevice } from './securityDevices/DTOs/output/TransformDevice';
import { DeviceRepository } from './securityDevices/device.repository';
import { DeviceController } from './securityDevices/device.controller';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: PasswordRecoveryCode.name,
        schema: PasswordRecoveryCodeSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Session.name,
        schema: SessionSchema,
      },
    ]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: appSettings.api.JWT_ACCESS_TOKEN_SECRET,
        signOptions: { expiresIn: '5m' },
      }),
    }),
  ],
  controllers: [AuthController, UserController, DeviceController],
  providers: [
    AuthService,
    UserService,
    AuthRepository,
    UserRepository,
    DeviceRepository,
    UserQueryRepository,
    DeviceQueryRepository,
    LocalStrategy,
    JwtStrategy,
    EmailService,
    TokenService,
    SetNewPasswordUseCase,
    LoginUserUseCase,
    RegisterUserUseCase,
    ConfirmationRegistrationUserUseCase,
    RegistrationEmailResendingUseCase,
    PasswordRecoveryUseCase,
    CreateSessionUseCase,
    UpdateSessionUseCase,
    DeleteSessionUseCase,
    SetNewTokensUseCase,
    DeleteDevicesUseCase,
    DeleteDeviceByIdUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    TransformUser,
    TransformDevice,
  ],
  exports: [],
})
export class AuthUserModule {}
