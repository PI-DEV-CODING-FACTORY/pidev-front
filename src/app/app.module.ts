import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';

@NgModule({
    providers:[
        MessageService
    ]
})
export class AppModule {}
