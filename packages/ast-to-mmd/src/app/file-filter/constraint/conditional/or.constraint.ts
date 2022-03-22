import { Constraint } from '../constraint';

/**
 * Disjunction {@link Constraint}.
 */
export class OrConstraint extends Constraint {
  private readonly _constraints: Constraint[];

  constructor(...constraints: Constraint[]) {
    super();

    this._constraints = constraints;
  }

  public override inConstraint(value: string): boolean {
    return this._constraints.some((constraint: Constraint) => constraint.inConstraint(value));
  }

}
