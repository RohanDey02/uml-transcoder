import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import * as joint from 'jointjs';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-uml-diagram',
  standalone: true,
  templateUrl: './uml-diagram.component.html',
  styleUrls: ['./uml-diagram.component.scss'],
  imports: [FormsModule]
})
export class UmlDiagramComponent implements OnInit {
  private graph: joint.dia.Graph = new joint.dia.Graph();
  private paper!: joint.dia.Paper;
  className: string = '';
  lastAddedClass: joint.shapes.uml.Class | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    console.log('UML Diagram component initialized.');
    if (isPlatformBrowser(this.platformId)) {
      this.paper = new joint.dia.Paper({
        el: document.getElementById('paper'),
        model: this.graph,
        width: 800,
        height: 600,
        gridSize: 10
      });
    }
  }

  addClass() {
    if (!this.className) {
      alert('Please enter a class name.');
      return;
    }

    const x = Math.random() * 700; // Random x position
    const y = Math.random() * 500; // Random y position

    const umlClass = new joint.shapes.uml.Class({
      position: { x, y },
      size: { width: 100, height: 40 },
      name: [this.className],
      attributes: ['+ id: number', '+ name: string'],
      methods: ['+ getName(): string', '+ setName(name: string): void']
    });
    
    this.graph.addCell(umlClass);
    this.className = ''; // Clear input field
    this.lastAddedClass = umlClass; // Keep reference to the last added class
  }

  connectClasses() {
    if (!this.lastAddedClass) {
      alert('Please add a class first to connect.');
      return;
    }

    const source = this.lastAddedClass; // Connect to the last added class
    const target = this.graph.getCells().find(c => c !== source); // Connect to any other class

    if (target) {
      const link = new joint.shapes.standard.Link();
      link.source(source);
      link.target(target);
      this.graph.addCell(link);
    } else {
      alert('No other classes to connect to.');
    }
  }
}
