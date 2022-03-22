import { Constraint } from '../constraint';

/**
 * Conjunction {@link Constraint}.
 */
export class AndConstraint extends Constraint {

  private readonly _constraints: Constraint[];

  constructor(...constraints: Constraint[]) {
    super();

    this._constraints = constraints;
  }

  public override inConstraint(value: string): boolean {
    return this._constraints.every((constraint: Constraint) => constraint.inConstraint(value));
  }

}
