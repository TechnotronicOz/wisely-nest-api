import { BadRequestException, NotFoundException } from '@nestjs/common';

export const newBadRequestException = (
  errMessage: string,
): BadRequestException =>
  new BadRequestException(new Error(errMessage), errMessage);

export const newNotFoundException = (errMessage: string): NotFoundException =>
  new NotFoundException(new Error(errMessage), errMessage);
