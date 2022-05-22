import {
  AndConstraint,
  Constraint,
  ContainsConstraint,
  EndsWithConstraint,
  NotConstraint,
  OrConstraint, StartsWithConstraint
} from '../../constraint';
import { FileFilterConfigKey, FileFilterConfigType } from '../../file-filter.config';

/**
 * Class representing configuration constraint builder.
 */
export class ConfigConstraintFactory {

  public build(config: FileFilterConfigType): Constraint {
    return new AndConstraint(...this.recursiveBuild(config));
  }

  protected recursiveBuild(...config: FileFilterConfigType[]): Constraint[] {
    const constraints: Constraint[] = [];

    for (const constraint of config) {
      const constraintNames = Object.keys(constraint);
      for (const constraintName of constraintNames) {
        constraints.push(this.buildConstraint(constraint, constraintName as FileFilterConfigKey));
      }
    }

    return constraints;
  }

  protected buildConstraint(config: FileFilterConfigType, constraintName: FileFilterConfigKey): Constraint {
    const configElement = config[constraintName];
    switch (constraintName) {
      case 'and':
        return new AndConstraint(...this.recursiveBuild(...configElement as FileFilterConfigType[]));
      case 'or':
        return new OrConstraint(...this.recursiveBuild(...configElement as FileFilterConfigType[]));
      case 'not':
        return new NotConstraint(this.recursiveBuild(configElement as FileFilterConfigType)[0]);
      case 'contains':
        return new ContainsConstraint(configElement as string);
      case 'startsWith':
        return new StartsWithConstraint(configElement as string);
      case 'endsWith':
        return new EndsWithConstraint(configElement as string);
    }
  }

}
