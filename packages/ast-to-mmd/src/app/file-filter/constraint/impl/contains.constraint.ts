import { Constraint } from '../constraint';

/**
 * {@link Constraint} which check whether the tested value contains specific value.
 */
export class ContainsConstraint extends Constraint {
  constructor(private readonly contains: string) {
    super();
  }

  public override inConstraint(value: string): boolean {
    return value.includes(this.contains);
  }
}
