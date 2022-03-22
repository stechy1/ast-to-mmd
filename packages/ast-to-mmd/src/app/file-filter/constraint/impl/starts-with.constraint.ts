import { Constraint } from '../constraint';

/**
 * {@link Constraint} which check whether the value start with specific value.
 */
export class StartsWithConstraint extends Constraint {
  constructor(private readonly startsWith: string) {
    super();
  }

  public override inConstraint(value: string): boolean {
    return value.startsWith(this.startsWith);
  }
}
