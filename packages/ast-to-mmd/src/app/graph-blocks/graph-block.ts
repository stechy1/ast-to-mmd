import { BlockKind } from '../block.kind';
import { PositiveSiblingCondition, SiblingCondition } from '../conditions';
import { LineRenderer, LineRendererModifier, Shape, ShapeRenderer } from './renderer';

/**
 * Base class representing each node in graph.
 */
export abstract class GraphBlock {
  /**
   * Shape renderer for generating different shapes in graph.
   */
  private static readonly SHAPE_RENDERER: ShapeRenderer = new ShapeRenderer();
  /**
   * Positive sibling condition default for all {@link GraphBlock}.
   */
  private static readonly POSITIVE_SIBLING_CONDITION: SiblingCondition = new PositiveSiblingCondition();
  /**
   * Empty implementation of {@link LineRendererModifier}.
   */
  private static readonly EMPTY_LINE_RENDERER_MODIFIER: LineRendererModifier = (lineRenderer: LineRenderer) => lineRenderer;

  /**
   * Parent of current node in graph. Can be undefined.
   */
  private _parent: GraphBlock | undefined = undefined;

  /**
   * Lazy dependencies ready to render when this node is rendered.
   */
  private _lazyDependencies: string[] = [];

  /**
   * {@link SiblingCondition}.
   */
  private _siblingCondition: SiblingCondition;
  /**
   * {@link SiblingCondition} for finding correct parent.
   */
  private _parentSiblingCondition: SiblingCondition;

  /**
   * Construct new node in graph.
   *
   * @param id {string} Unique ID in the node graph.
   */
  protected constructor(public readonly id: string) {
    this._siblingCondition = GraphBlock.POSITIVE_SIBLING_CONDITION;
    this._parentSiblingCondition = GraphBlock.POSITIVE_SIBLING_CONDITION;
  }

  /**
   * Renders current node.
   *
   * @param _indent {number} Indentation from start of the line.
   */
  public abstract render(_indent: number): string;

  /**
   * Renders lazy dependencies of current node.
   *
   * @param _indent {number} Indentiation from start of the line.
   */
  public renderLazyDependencies(_indent: number): string {
    return this._lazyDependencies
      .map((dependency: string) => `${this._generateSpace(_indent)}${dependency}`)
      .join('\n');
  }

  /**
   * Renders current node wrapped in a subgraph.
   *
   * Direction options:
   * - TB - top to bottom (default)
   * - TD - top-down / same as top to bottom
   * - BT - bottom to top
   * - LR - left to rignt
   * - RL - right to left
   *
   * @param _indent {number} Indentation from start of the line.
   * @param id {string} ID of a subgraph.
   * @param text {string} Name of a subgraph.
   * @param bodyRenderer {function} Callback responsible for rendering real node content.
   * @param direction {string} Direction of a subgraph.
   * @returns {string} Graph wrapped in a subgraph.
   */
  protected renderInSubgraph(
    _indent: number,
    id: string,
    text: string,
    bodyRenderer: (indent: number) => string,
    direction: 'TB' | 'TD' | 'BT' | 'LR' | 'RL' = 'TB'
  ): string {
    return `
${this._generateSpace(_indent)}subgraph ${id} ${this._renderShape(text, Shape.SHARP_EDGES)}
${this._generateSpace(_indent + 1)}direction ${direction}
${bodyRenderer(_indent + 1)}
${this._generateSpace(_indent)}end
`;
  }

  /**
   * @returns {@link BlockKind} of the block.
   */
  public abstract get blockKind(): BlockKind;

  /**
   * Returns parent of this node or undefined if node has no parent.
   *
   * @returns {{@link GraphBlock} | undefined}
   */
  get parent(): GraphBlock | undefined {
    return this._parent;
  }

  /**
   * Set parent of this node.
   * Can not set {undefined} value.
   *
   * @param value {@link GraphBlock} Parent of this node.
   */
  set parent(value: GraphBlock | undefined) {
    if (value) {
      this._parent = value;
    }
  }

  /**
   * @returns {string} First ID of this node.
   */
  public get firstBlock(): GraphBlock {
    return this;
  }

  /**
   * @returns {string[]} Array of last ID of nodes directly connected to this node.
   */
  public get lastBlocks(): string[] {
    return [this.id];
  }

  /**
   * @returns {boolean} True when this node has some children, False otherwise.
   */
  public get hasChildren(): boolean {
    return false;
  }

  /**
   * @returns {GraphBlock[][]} Multidimensional array of direct children of this node.
   */
  public get children(): GraphBlock[][] {
    return [];
  }

  /**
   * Add lazy dependency to local collection.
   *
   * @param lazyLine {string} Rendered lazy dependency line.
   */
  public set lazyDependency(lazyLine: string) {
    this._lazyDependencies.push(lazyLine);
  }

  /**
   * @returns {boolean} True, when this node should be included in dependency graph, False otherwise.
   */
  public get includeInDependencyGraph(): boolean {
    return true;
  }

  /**
   * @returns True, when this children of this node is allowed to unwrap, False otherwise.
   */
  public get allowUnwrapChildren(): boolean {
    return true;
  }

  /**
   * @returns True, when rest of the dependencies in a chain should not be rendered, False otherwise.
   */
  public get skipRenderRestDependencies(): boolean {
    return false;
  }

  /**
   * @returns {@link SiblingCondition}.
   */
  public get siblingCondition(): SiblingCondition {
    return this._siblingCondition;
  }

  /**
   * Set {@link SiblingCondition}.
   *
   * @param condition {@link SiblingCondition}.
   */
  protected set siblingCondition(condition: SiblingCondition) {
    this._siblingCondition = condition;
  }

  /**
   * @returns {@link SiblingCondition}.
   */
  public get parentSiblingCondition(): SiblingCondition {
    return this._parentSiblingCondition;
  }

  /**
   * Set {@link SiblingCondition}.
   *
   * @param condition {@link SiblingCondition}.
   */
  protected set parentSiblingCondition(condition: SiblingCondition) {
    this._parentSiblingCondition = condition;
  }

  /**
   * Should be used only when:
   * - {@link skipRenderRestDependencies} = true
   *
   * @returns True, when this block must be connected with its direct parent, False otherwise.
   */
  public get connectWithDirectParent(): boolean {
    return false;
  }

  /**
   * Should be used only when:
   * - {@link skipRenderRestDependencies} = true
   *
   * @returns True, when this block must be connected with parent of defined kind, False otherwise.
   */
  public get connectWithParentOfKind(): boolean {
    return false;
  }

  /**
   * Should be used only when:
   * - {@link skipRenderRestDependencies} = true
   *
   * @returns True, when this block must connect with next parents sibling, False otherwise.
   */
  public get connectWithNextParentsSibling(): boolean {
    return false;
  }

  /**
   * Should be used only when:
   * - {@link connectWithDirectParent} = true OR
   * - {@link connectWithParentOfKind} = true OR
   * - {@link connectWithNextParentsSibling} = true
   * <br>
   * In this case line configuration will be overriden by one from bridge block.
   *
   * @returns True, when this block serves only as a bridge between two blocks.
   */
  public get isDependencyBridge(): boolean {
    return false
  }

  /**
   * Should be used only when:
   * - {@link isDependencyBridge} = true
   *
   * @returns {@link LineRendererModifier} Modifier of current line renderer.
   */
  public get lineRendererModifier(): LineRendererModifier {
    return GraphBlock.EMPTY_LINE_RENDERER_MODIFIER;
  }

  /**
   * Create new instance of {@link LineRenderer}.
   *
   * @param lhsId {string} ID of start node.
   * @param rhsId {string} ID of end node.
   * @returns {@link LineRenderer} New instance of {@link LineRenderer}
   */
  protected createLineBuilder(lhsId: string, rhsId: string): LineRenderer {
    return new LineRenderer(lhsId, rhsId);
  }

  // ----------------------------- HELPER METHODS ------------------------------

  /**
   * Helper method for assigning this parent into each children.
   *
   * @param children {@link GraphBlock[]} Children where this parent is going to be assigned.
   */
  protected _assignParent(children: GraphBlock[]): void {
    children.forEach((child: GraphBlock) => {
      child.parent = this;
    });
  }

  /**
   * Helper method for generating space.
   *
   * @param count {number} Count of space.
   * @returns {string} Space of defined length.
   */
  protected _generateSpace(count: number): string {
    return ' '.repeat(count);
  }

  /**
   * Helper method for generating line between two nodes.
   *
   * @param indent {number} Indentation from start of the line.
   * @param lhsId {string} ID of start node.
   * @param rhsId {string} ID of end node.
   * @param builderModifier
   * @returns {string} Line definition between two nodes.
   */
  protected _renderLine(
    indent: number,
    lhsId: string,
    rhsId: string,
    ...builderModifier: LineRendererModifier[]
  ): string {
    let builder = this.createLineBuilder(lhsId, rhsId);
    if (builderModifier) {
      builder = builderModifier.reduce((prev: LineRenderer, curr: LineRendererModifier) => curr(builder), builder);
    }

    return `${this._generateSpace(indent + 1)}${builder.render()}`;
  }

  /**
   * Helper method for rendering defined shape with text.
   *
   * @param text {string} Text in shape.
   * @param shape {@link Shape} Type of shape.
   * @returns {string} Rendered shape with text.
   */
  protected _renderShape(text: string, shape: Shape): string {
    return GraphBlock.SHAPE_RENDERER.render(text, shape);
  }

  /**
   * Helper method for rendering dependencies with defined indent between blocks.
   *
   * @param indent {number} Indentation from start of the line.
   * @param blocks {@link GraphBlock[]} Blocks to render dependencies between each node.
   * @returns {string} Dependencies of blocks.
   */
  protected _renderDependencies(indent: number, blocks: GraphBlock[]): string {
    blocks = blocks.filter((block: GraphBlock) => block.includeInDependencyGraph);
    if (blocks.length <= 1) {
      return '';
    }

    let result = '';
    let lastBlockWithDependency = blocks[0];

    for (let i = 1; i < blocks.length; i++) {
      const currentBlockWithDependency: GraphBlock = blocks[i];
      const currentFirstBlock: GraphBlock = currentBlockWithDependency.firstBlock;
      const lastIds: string[] = lastBlockWithDependency.lastBlocks;

      if (!currentBlockWithDependency.isDependencyBridge) {
        result += this._renderLinesL2R(indent, currentFirstBlock.id, lastIds);
      }
      if (currentBlockWithDependency.skipRenderRestDependencies) {
        result += this._renderConnectionWithParent(indent, currentBlockWithDependency, lastIds);
        break;
      }

      lastBlockWithDependency = currentBlockWithDependency;
    }

    return result;
  }

  /**
   * Helper method for rendering line starting in one node and ending in multiple nodes.
   *
   * @param indent {number} Indentation from start of the line.
   * @param toId {string} ID of start node.
   * @param fromIds {string[]} Array of end nodes.
   * @param builderModifier {function} Optional modifier of current line.
   * @returns {string} Rendered line.
   */
  protected _renderLinesL2R(
    indent: number,
    toId: string,
    fromIds: string[],
    ...builderModifier: LineRendererModifier[]
  ): string {
    return this.__renderLines(indent, toId, fromIds, 'right', ...builderModifier);
  }

  /**
   * Helper method for rendering line starting in multiple nodes and ending in one node.
   *
   * @param indent {number} Indentation from start of the line.
   * @param fromId {string} Array of start nodes.
   * @param toIds {string[]} ID of end node.
   * @param builderModifier {function} Optional modifier of current line.
   * @returns {string} Rendered line.
   */
  protected _renderLinesR2L(
    indent: number,
    fromId: string,
    toIds: string[],
    ...builderModifier: LineRendererModifier[]
  ): string {
    return this.__renderLines(indent, fromId, toIds, 'left', ...builderModifier);
  }

  protected _renderConnectionWithParent(indent: number, children: GraphBlock, lastIds: string[], ...priorityBuilderModifier: LineRendererModifier[]): string {
    if (!children.parent) {
      return '';
    }

    let result = '';

    if (children.connectWithDirectParent) {
      if (children.isDependencyBridge) {
        result += this._renderLinesL2R(indent, children.parent.id, lastIds, ...priorityBuilderModifier, children.lineRendererModifier);
      } else {
        result += this._renderLine(indent, children.id, children.parent.id);
      }
    }

    if (children.connectWithParentOfKind) {
      const parentOfKind = this._findParentBySiblingCondition(children, children.siblingCondition);
      if (parentOfKind) {
        if (children.isDependencyBridge) {
          result += this._renderLinesL2R(indent, parentOfKind.id, lastIds, ...priorityBuilderModifier, children.lineRendererModifier);
        } else {
          result += this._renderLine(indent, children.id, parentOfKind.id);
        }
      }
    }

    if (children.connectWithNextParentsSibling) {
      const siblingChild: GraphBlock | undefined = this._findSiblingChild(this, children.parentSiblingCondition, children.siblingCondition);
      if (siblingChild) {
        if (children.isDependencyBridge) {
          siblingChild.lazyDependency = this._renderLinesL2R(0, siblingChild.id, lastIds, ...priorityBuilderModifier, children.lineRendererModifier);
        } else {
          result += this._renderLine(indent, children.id, siblingChild.id);
        }
      }
    }

    return result;
  }

  /**
   * Helper method for filtering children in multidimensional array of children.
   *
   * @param children {@link GraphBlock[][]} Array of children.
   * @returns {@link GraphBlock[][]} Multidimensional array of children ready for rendering.
   */
  protected _multiFilterChildren(children: GraphBlock[][]): GraphBlock[][] {
    return children.filter((childs: GraphBlock[]) => this._filterChildren(childs));
  }

  /**
   * Helper method for filtering array of children.
   *
   * @param children {@link GraphBlock[]} Array of children.
   * @returns {@link GraphBlock[]} Children ready for rendering.
   */
  protected _filterChildren(children: GraphBlock[]): GraphBlock[] {
    return children.filter((block: GraphBlock) => block.includeInDependencyGraph);
  }

  /**
   * Helper method for finding a sibling of defined child in parents children.
   *
   * @param child {@link GraphBlock} Node which for sibling is looked for.
   * @param parentSiblingCondition {@link SiblingCondition}.
   * @param siblingCondition {@link SiblingCondition}.
   * @returns {@link GraphBlock} | {@link undefined} Sibling of wanted child or undefined when sibling was not possible to find.
   */
  protected _findSiblingChild(child: GraphBlock, parentSiblingCondition: SiblingCondition = this.siblingCondition, siblingCondition: SiblingCondition = this.siblingCondition): GraphBlock | undefined {
    if (!child.parent) {
      return undefined;
    }

    const parent = child.parent;
    if (!parentSiblingCondition.isValid(child)) {
      return this._findSiblingChild(child.parent, parentSiblingCondition, siblingCondition);
    }

    const filteredParentChildren = this._multiFilterChildren(parent.children);
    const result: [number, number] | undefined = this.__multiFindChildIndex(filteredParentChildren, child);
    if (result) {
      const [outerIndexOfThisBlock, innerIndexOfThisBlock]: [number, number] = result;
      const childrenCount = filteredParentChildren[outerIndexOfThisBlock].length;
      if (childrenCount - 1 > innerIndexOfThisBlock) {
        for (let i = innerIndexOfThisBlock + 1; i < childrenCount; i++) {
          const sibling = filteredParentChildren[outerIndexOfThisBlock][i];
          if (siblingCondition.isValid(sibling)) {
            return sibling;
          }
        }
        // const sibling = filteredParentChildren[outerIndexOfThisBlock][innerIndexOfThisBlock + 1];
        // if (siblingCondition.isValid(sibling)) {
        //   return sibling;
        // } else {
          return this._findSiblingChild(parent, parentSiblingCondition, siblingCondition);
        // }
      } else {
        return this._findSiblingChild(parent, parentSiblingCondition, siblingCondition);
      }
    } else {
      return undefined;
    }
  }

  /**
   * Helper method for finding an indirect parent of defined child by {@link SiblingCondition}.
   *
   * @param child {@link GraphBlock} Child whose parent is wanted.
   * @param siblingCondition {@link SiblingCondition}.
   * @returns {@link GraphBlock} | {@link undefined} Parent of wanted child or undefined when parent was not possible to find.
   */
  protected _findParentBySiblingCondition(child: GraphBlock, siblingCondition: SiblingCondition): GraphBlock | undefined {
    if (!child.parent) {
      return undefined;
    }

    const parent = child.parent;

    if (siblingCondition.isValid(parent)) {
      return parent;
    }

    return this._findParentBySiblingCondition(parent, siblingCondition);
  }
  // ----------------------------- PRIVATE METHODS -----------------------------

  /**
   * Private method for rendering lines between nodes in defined directions.
   *
   * @param indent {number} Indentation from start of the line.
   * @param id {string} ID of one side of connection.
   * @param ids {string[]} Array of IDs of end of a connection.
   * @param direction {string} Direction of a line.
   * @param builderModifier {function} Optional modifier of current line.
   * @returns {string} Rendered line.
   */
  private __renderLines(
    indent: number,
    id: string,
    ids: string[],
    direction: 'left' | 'right',
    ...builderModifier: LineRendererModifier[]
  ): string {
    let result = ids
      .map((currentId) => {
        if (direction === 'left') {
          return this._renderLine(indent + 1, id, currentId, ...builderModifier);
        } else {
          return this._renderLine(indent + 1, currentId, id, ...builderModifier);
        }
      })
      .join('\n');
    result += '\n';

    return result;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Private method for finding a child index of defined block in a multidimensional array of children.
   *
   * @param children {@link GraphBlock[][]} Multidimensional array of children including the child.
   * @param child {@link GraphBlock} Wanted child.
   * @returns {[number, number] | undefined} Coordinates of child block or undefined when block is not found.
   */
  private __multiFindChildIndex(children: GraphBlock[][], child: GraphBlock): [number, number] | undefined {
    for (let i = 0; i < children.length; i++) {
      const parallelChildren = children[i];
      for (let j = 0; j < parallelChildren.length; j++) {
        const innerChildren = parallelChildren[j];
        if (innerChildren === child) {
          return [i, j];
        }
      }
    }

    return undefined;
  }

  public toString(): string {
    return this.id;
  }
}
