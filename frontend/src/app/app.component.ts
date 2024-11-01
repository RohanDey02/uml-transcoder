import { Component } from '@angular/core';
import { UmlDiagramComponent } from './components/uml-diagram/uml-diagram.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UmlDiagramComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title: string = 'UML Diagram to SQL DDL';
}
