'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Ast-to-mmd documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/BaseForDeclarationGraphBlock.html" data-type="entity-link" >BaseForDeclarationGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/BinaryExpressionDeclarationGraphBlock.html" data-type="entity-link" >BinaryExpressionDeclarationGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/BlockDeclarationGraphBlock.html" data-type="entity-link" >BlockDeclarationGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/CodeParser.html" data-type="entity-link" >CodeParser</a>
                            </li>
                            <li class="link">
                                <a href="classes/Convertor.html" data-type="entity-link" >Convertor</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmptyGraphBlock.html" data-type="entity-link" >EmptyGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/Exporter.html" data-type="entity-link" >Exporter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForDeclarationGraphBlock.html" data-type="entity-link" >ForDeclarationGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForInDeclarationGraphBlock.html" data-type="entity-link" >ForInDeclarationGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForOfDeclarationGraphBlock.html" data-type="entity-link" >ForOfDeclarationGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForXDeclarationGraphBlock.html" data-type="entity-link" >ForXDeclarationGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphBlock.html" data-type="entity-link" >GraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphParentGraphBlock.html" data-type="entity-link" >GraphParentGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/IfElseDeclarationGraphBlock.html" data-type="entity-link" >IfElseDeclarationGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/IncrementalBlockIdGenerator.html" data-type="entity-link" >IncrementalBlockIdGenerator</a>
                            </li>
                            <li class="link">
                                <a href="classes/LineRenderer.html" data-type="entity-link" >LineRenderer</a>
                            </li>
                            <li class="link">
                                <a href="classes/MethodCallGraphBlock.html" data-type="entity-link" >MethodCallGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/NamedBlockDeclarationGraphBlock.html" data-type="entity-link" >NamedBlockDeclarationGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParallelBlockDeclarationGraphBlock.html" data-type="entity-link" >ParallelBlockDeclarationGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShapeRenderer.html" data-type="entity-link" >ShapeRenderer</a>
                            </li>
                            <li class="link">
                                <a href="classes/TextGraphBlock.html" data-type="entity-link" >TextGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/ThrowDeclarationGraphBlock.html" data-type="entity-link" >ThrowDeclarationGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/TryCatchDeclarationGraphBlock.html" data-type="entity-link" >TryCatchDeclarationGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/UuidBlockIdGenerator.html" data-type="entity-link" >UuidBlockIdGenerator</a>
                            </li>
                            <li class="link">
                                <a href="classes/VariableDeclarationGraphBlock.html" data-type="entity-link" >VariableDeclarationGraphBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/VariableDeclarationListGraphBlock.html" data-type="entity-link" >VariableDeclarationListGraphBlock</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/BlockIdGenerator.html" data-type="entity-link" >BlockIdGenerator</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraphResult.html" data-type="entity-link" >GraphResult</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});