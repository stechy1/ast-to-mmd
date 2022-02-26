export enum Shape {
  DEFAULT = '$TEXT$',
  /**
   * {@link https://mermaid-js.github.io/mermaid/#/flowchart?id=a-node-with-round-edges}
   */
  ROUND_EDGES = '($TEXT$)',
  /**
   * {@link https://mermaid-js.github.io/mermaid/#/flowchart?id=a-node-with-text}
   */
  SHARP_EDGES = '[$TEXT$]',
  /**
   * {@link https://mermaid-js.github.io/mermaid/#/flowchart?id=a-stadium-shaped-node}
   */
  STADIUM_SHAPED = '([$TEXT$])',
  /**
   * {@link https://mermaid-js.github.io/mermaid/#/flowchart?id=a-node-in-a-subroutine-shape}
   */
  SUBROUTINE = '[[$TEXT$]]',
  /**
   * {@link https://mermaid-js.github.io/mermaid/#/flowchart?id=a-node-in-a-cylindrical-shape}
   */
  CYLINDER = '[($TEXT$)]',
  /**
   * {@link https://mermaid-js.github.io/mermaid/#/flowchart?id=a-node-in-the-form-of-a-circle}
   */
  CIRCLE = '(($TEXT$))',
  /**
   * {@link https://mermaid-js.github.io/mermaid/#/flowchart?id=a-node-in-an-asymmetric-shape}
   */
  ASYMETRIC_RIGHT = '>$TEXT$]',
  /**
   * {@link https://mermaid-js.github.io/mermaid/#/flowchart?id=a-node-rhombus}
   */
  RHOMBUS = '{$TEXT$}',
  /**
   * {@link https://mermaid-js.github.io/mermaid/#/flowchart?id=a-hexagon-node}
   */
  HEXAGON = '{{$TEXT$}}',
  /**
   * {@link https://mermaid-js.github.io/mermaid/#/flowchart?id=parallelogram}
   */
  PARALLEOGRAM = '[/$TEXT$/]',
  /**
   * {@link https://mermaid-js.github.io/mermaid/#/flowchart?id=parallelogram-alt}
   */
  PARALLEOGRAM_ALT = '[\\$TEXT$\\]',
  /**
   * {@link https://mermaid-js.github.io/mermaid/#/flowchart?id=trapezoid}
   */
  TRAPEZOID = '[/$TEXT$\\]',
  /**
   * {@link https://mermaid-js.github.io/mermaid/#/flowchart?id=trapezoid-alt}
   */
  TRAPEZOID_ALT = '[\\$TEXT$/]',
}

/**
 * Class represents renderer of supported shapes by Mermaid.js
 *
 * {@link https://mermaid-js.github.io/mermaid/#/flowchart?id=node-shapes}
 */
export class ShapeRenderer {
  private static readonly TEXT_PLACEHOLDER = '$TEXT$';

  /**
   * Render defined shape with text.
   *
   * @param text {string} Text in the shape.
   * @param shape {@link Shape} Type of the shape.
   */
  render(text: string, shape: Shape): string {
    return shape.valueOf().replace(ShapeRenderer.TEXT_PLACEHOLDER, `"${text}"`);
  }
}
