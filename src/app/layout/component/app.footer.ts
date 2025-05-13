import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Coding Factory by
        <a href="/" target="_blank" rel="noopener noreferrer" class="font-bold text-primary hover:underline">Binary Brains</a>
    </div>`
})
export class AppFooter {}
