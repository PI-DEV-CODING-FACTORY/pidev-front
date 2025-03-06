import { Component } from '@angular/core';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // Import a theme (you can choose different themes)

@Component({
    selector: 'app-code-display',
    template: `
        <div class="code-container">
            <div class="code-tab">script.js</div>
            <pre class="code-block"><code [innerHTML]="highlightedCode"></code></pre>
        </div>
    `,
    styles: [`
        .code-container {
            border-radius: 8px;
            overflow: hidden;
            margin: 1rem 0;
        }

        .code-tab {
            background: #282c34;
            color: #abb2bf;
            padding: 8px 16px;
            font-family: 'Segoe UI', system-ui, sans-serif;
            font-size: 13px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            border-bottom: 1px solid #181a1f;
        }

        .code-block {
            background: #282c34;
            padding: 1rem;
            margin: 0;
            overflow-x: auto;
        }

        :host ::ng-deep .hljs {
            background: transparent;
            color: #d4d4d4;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.5;
        }
    `]
})
export class CodeDisplayComponent {
    code = `
    function helloWorld() {
      console.log('Hello, world!');
    }
    `;

    highlightedCode = hljs.highlightAuto(this.code).value;
}
