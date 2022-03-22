import { Constraint } from '../constraint';

/**
 * {@link Constraint} which check whether the value ends with specific value.
 */
export class EndsWithConstraint extends Constraint {
  constructor(private readonly endsWith: string) {
    super();
  }

  public override inConstraint(value: string): boolean {
    return value.endsWith(this.endsWith);
  }
}
