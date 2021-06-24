import { newBadRequestException, newNotFoundException } from './exceptions';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('util/exceptions', () => {
  it('should create a BadRequestException', () => {
    const err = newBadRequestException('test');
    expect(err).toBeInstanceOf(BadRequestException);
    expect(err.message).toBe('test');
  });

  it('should create a NotFoundException', () => {
    const err = newNotFoundException('test');
    expect(err).toBeInstanceOf(NotFoundException);
    expect(err.message).toBe('test');
  });
});
