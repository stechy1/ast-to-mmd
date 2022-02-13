export enum LINE_HEAD {
  NONE,
  ARROW,
  POINT,
  CROSS,
}

export enum LINE_STYLE {
  NORMAL,
  DOTTED,
}

export enum LINE_WIDTH {
  NORMAL,
  THICK,
}

export class LineBuilder {
  private _connectionDescription?: string;
  private _lhsHead: LINE_HEAD = LINE_HEAD.NONE;
  private _rhsHead: LINE_HEAD = LINE_HEAD.NONE;
  private _lineStyle: LINE_STYLE = LINE_STYLE.NORMAL;
  private _lineWidth: LINE_WIDTH = LINE_WIDTH.NORMAL;
  private _lineLength: number = 1;

  constructor(private readonly lhsId: string, private readonly rhsId: string) {}

  setConnectionDescription(value: string): LineBuilder {
    this._connectionDescription = value;
    return this;
  }

  setLhsHead(value: LINE_HEAD): LineBuilder {
    this._lhsHead = value;
    return this;
  }

  setRhsHead(value: LINE_HEAD): LineBuilder {
    this._rhsHead = value;
    return this;
  }

  setLineStyle(value: LINE_STYLE): LineBuilder {
    this._lineStyle = value;
    return this;
  }

  setLineWidth(value: LINE_WIDTH): LineBuilder {
    this._lineWidth = value;
    return this;
  }

  setLineLength(value: number): LineBuilder {
    this._lineLength = value;
    return this;
  }

  build(): string {
    let result = `${this.lhsId} `;

    result += this.lhsHead;
    result += this.linePiece;
    if (this.isDotted) result += this.dot();

    if (this._connectionDescription) {
      result += ` ${this._connectionDescription} `;
    } else {
      let tmpLineLength = this._lineLength;
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
