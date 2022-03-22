import { SourceFile } from 'ts-morph';

import { Constraint } from '../constraint';
import { FileFilter } from '../file-filter';
import { FileFilterConfigType } from '../file-filter.config';
import { ConfigConstraintFactory } from './builder/config-constraint.factory';

/**
 * Implementation of {@link FileFilter} where conditions are defined constraint.
 */
export class ConstraintFileFilter implements FileFilter {

  private static readonly CONFIG_CONSTRAINT_FACTORY: ConfigConstraintFactory = new ConfigConstraintFactory();

  private readonly constraint: Constraint;

  constructor(private readonly fileFilterConfig: FileFilterConfigType) {
    this.constraint = ConstraintFileFilter.CONFIG_CONSTRAINT_FACTORY.build(fileFilterConfig);
  }

  public accept(file: SourceFile): boolean {
    return this.constraint.inConstraint(file.getFilePath());
  }

}
