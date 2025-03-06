import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxHighlightJsModule } from 'ngx-highlightjs';

@NgModule({
    imports: [NgModule, NgbAccordionModule, NgxHighlightJsModule]
    // ... rest of the module definition
})
export class AppModule {}
