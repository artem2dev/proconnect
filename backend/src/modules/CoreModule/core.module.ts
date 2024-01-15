import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
  exports: [JwtModule],
})
export class CoreModule {}
