import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';

import { AppComponent } from './app.component';
import { UmlDiagramComponent } from './pages/uml-diagram/uml-diagram.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './api.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AddClassModalComponent } from './components/modals/add-class-modal/add-class-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImportClassModalComponent } from './components/modals/import-modal/import-modal.component';
import { ExportClassModalComponent } from './components/modals/export-modal/export-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    UmlDiagramComponent,
    AddClassModalComponent,
    ImportClassModalComponent,
    ExportClassModalComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
