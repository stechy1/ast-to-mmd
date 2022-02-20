export enum Shape {
  DEFAULT = '$TEXT$',
  ROUND_EDGES = '($TEXT$)',
  SHARP_EDGES = '[$TEXT$]',
  STADIUM_SHAPED = '([$TEXT$])',
  SUBROUTINE = '[[$TEXT$]]',
  CYLINDER = '[($TEXT$)]',
  CIRCLE = '(($TEXT$))',
  ASYMETRIC_RIGHT = '>$TEXT$]',
  RHOMBUS = '{$TEXT$}',
  HEXAGON = '{{$TEXT$}}',
  PARALLEOGRAM = '[/$TEXT$/]',
  PARALLEOGRAM_ALT = '[\\$TEXT$\\]',
  TRAPEZOID = '[/$TEXT$\\]',
  TRAPEZOID_ALT = '[\\$TEXT$/]',
}

export class ShapeRenderer {
  private static readonly TEXT_PLACEHOLDER = '$TEXT$';

  render(text: string, shape: Shape): string {
    return shape.valueOf().replace(ShapeRenderer.TEXT_PLACEHOLDER, `"${text}"`);
  }
}
