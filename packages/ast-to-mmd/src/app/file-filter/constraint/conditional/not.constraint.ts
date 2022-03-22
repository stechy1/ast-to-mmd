import { Constraint } from '../constraint';

/**
 * Negation {@link Constraint}.
 */
export class NotConstraint extends Constraint {
  constructor(private readonly constraint: Constraint) {
    super();
  }

  public override inConstraint(value: string): boolean {
    return !this.constraint.inConstraint(value);
  }

}
