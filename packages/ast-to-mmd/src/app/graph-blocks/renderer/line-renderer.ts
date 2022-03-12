/**
 * Style of head of the line.
 *
 * - NONE: ---
 * - ARROR: -->
 * - POINT: --O
 * - CROSS: --X
 */
export enum LINE_HEAD {
  NONE,
  ARROW,
  POINT,
  CROSS,
}

/**
 * Style of the line.
 *
 * - NORMAL: ---
 * - DOTTED: ...
 */
export enum LINE_STYLE {
  NORMAL,
  DOTTED,
}

/**
 * Width of the line.
 *
 * - NORMAL:  ---
 * - THICK: ===
 */
export enum LINE_WIDTH {
  NORMAL,
  THICK,
}

/**
 * Class represents renderer of line between two nodes.
 */
export class LineRenderer {
  /**
   * Optional description on the line.
   */
  private _connectionDescription?: string;
  /**
   * Type of head on left side of the line.
   */
  private _lhsHead: LINE_HEAD = LINE_HEAD.NONE;
  /**
   * Type of head on right side of the line.
   */
  private _rhsHead: LINE_HEAD = LINE_HEAD.NONE;
  /**
   * {@link LINE_STYLE} Style of the line.
   */
  private _lineStyle: LINE_STYLE = LINE_STYLE.NORMAL;
  /**
   * {@link LINE_WIDTH} Width of the line.
   */
  private _lineWidth: LINE_WIDTH = LINE_WIDTH.NORMAL;
  /**
   * Length of the line.
   */
  private _lineLength = 1;

  /**
   * Creates new instance of the {@link LineRenderer}.
   *
   * @param lhsId {string} ID of left node.
   * @param rhsId {string} ID of right node.
   */
  constructor(private readonly lhsId: string, private readonly rhsId: string) {}

  /**
   * Set connection description on the line.
   *
   * @param value {string} Connection description.
   * @param append {boolean} True, when description should be appended to existing one, False otherwise.
   */
  setConnectionDescription(value: string, append = false): LineRenderer {
    if (!this._connectionDescription) {
      this._connectionDescription = value;
      return this;
    }

    this._connectionDescription = append ? `${this._connectionDescription}</br></br>${value}` : value;
    return this;
  }

  /**
   * Set type of head on left side the line.
   *
   * @param value {@link LINE_HEAD} Type of head.
   */
  setLhsHead(value: LINE_HEAD): LineRenderer {
    this._lhsHead = value;
    return this;
  }

  /**
   * Set type of head on right side the line.
   *
   * @param value {@link LINE_HEAD} Type of head.
   */
  setRhsHead(value: LINE_HEAD): LineRenderer {
    this._rhsHead = value;
    return this;
  }

  /**
   * Set style of the line.
   *
   * @param value {@link LINE_STYLE} Style of the line.
   */
  setLineStyle(value: LINE_STYLE): LineRenderer {
    this._lineStyle = value;
    return this;
  }

  /**
   * Set width of the line.
   *
   * @param value {@link LINE_WIDTH} Width of the line.
   */
  setLineWidth(value: LINE_WIDTH): LineRenderer {
    this._lineWidth = value;
    return this;
  }

  /**
   * Set length of the line.
   *
   * @param value {number} Length of the line.
   */
  setLineLength(value: number): LineRenderer {
    this._lineLength = value;
    return this;
  }

  /**
   * Render line with defined options.
   */
  render(): string {
    let result = `${this.lhsId} `;

    result += this.lhsHead;
    result += this.linePiece;
    if (this.isDotted) result += this.dot();

    if (this._connectionDescription) {
      if (this.isDotted) {
        result += ` ${this._connectionDescription} `;
      } else {
        result += `${this.linePiece} ${this._connectionDescription} ${this.linePiece}`;
      }
    } else {
      const tmpLineLength = this._lineLength;
      this._lineLength = 1;
      result += this.linePiece;
      this._lineLength = tmpLineLength;
    }

    if (this.isDotted) result += this.dot();
    result += this.linePiece;
    result += this.rhsHead;

    result += ` ${this.rhsId}`;

    return result;
  }

  protected get linePiece(): string {
    let repeat = this._lineLength;
    if (this.isDotted) repeat = 1;
    return (this._lineWidth === LINE_WIDTH.THICK ? '=' : '-').repeat(repeat);
  }

  protected get lhsHead(): string {
    switch (this._lhsHead) {
      case LINE_HEAD.ARROW:
        return '<';
      case LINE_HEAD.CROSS:
        return 'x';
      case LINE_HEAD.POINT:
        return 'o';
      default:
        return '';
    }
  }

  protected get rhsHead(): string {
    switch (this._rhsHead) {
      case LINE_HEAD.ARROW:
        return '>';
      case LINE_HEAD.CROSS:
        return 'x';
      case LINE_HEAD.POINT:
        return 'o';
      default:
        return '';
    }
  }

  protected dot(): string {
    return '.'.repeat(this._lineLength);
  }

  protected get isDotted(): boolean {
    return this._lineStyle === LINE_STYLE.DOTTED;
  }
}

/**
 * Modifier of existing {@link LineRenderer}
 */
export type LineRendererModifier = (builder: LineRenderer) => LineRenderer;
