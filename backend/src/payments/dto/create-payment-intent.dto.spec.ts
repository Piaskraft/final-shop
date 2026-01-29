import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreatePaymentIntentDto } from './create-payment-intent.dto';

describe('CreatePaymentIntentDto', () => {
  it('requires orderId', async () => {
    const dto = new CreatePaymentIntentDto();
    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'orderId')).toBe(true);
  });

  it('rejects orderId < 1', async () => {
    const dto = new CreatePaymentIntentDto();
    dto.orderId = 0;

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'orderId')).toBe(true);
  });

  it('accepts valid dto', async () => {
    const dto = new CreatePaymentIntentDto();
    dto.orderId = 1;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
