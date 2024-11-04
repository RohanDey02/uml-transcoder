import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import * as joint from 'jointjs';
import { isPlatformBrowser } from '@angular/common';
import { InputModalComponent } from '../input-modal/input-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-uml-diagram',
  templateUrl: './uml-diagram.component.html',
  styleUrls: ['./uml-diagram.component.scss'],
})
export class UmlDiagramComponent implements OnInit {
  private graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });
  private paper!: joint.dia.Paper;
  selectedClass: joint.dia.Element | null = null;

  className: string = '';
  attributes: string[] = [];
  methods: string[] = [];
  lastAddedClass: joint.shapes.uml.Class | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private dialog: MatDialog) { }

  getGraph() {
    return this.graph;
  }

  openAddClassDialog() {
    const dialogRef = this.dialog.open(InputModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      const { className, attributes, methods } = result;
      this.className = className;
      this.attributes = attributes.map((a: any) => `${a.level} ${a.name}`);
      this.methods = methods.map((m: any) => `${m.level} ${m.name}`);
      this.addClass();
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.paper = new joint.dia.Paper({
        el: document.getElementById('paper'),
        model: this.graph,
        width: window.innerWidth - 50,
        height: window.innerHeight - 140,
        async: true
      });

      // Event listener to select a class
      // this.paper.on('cell:pointerclick', (cellView) => {
      //   const elementView = cellView as joint.dia.ElementView;
      //   this.selectedClass = elementView. as joint.dia.Element;
      //   console.log(`Selected class: ${this.selectedClass.get('name')}`);
      // });
    }
  }

  addClass() {
    const x = Math.random() * (window.innerWidth - 150);
    const y = Math.random() * (window.innerHeight - 240);

    const umlDesignAttrs: any = (col1: string, col2: string, gradient: boolean = false) => {
      if (gradient) {
        return {
          fill: {
            type: 'linearGradient',
            stops: [
              { offset: '0%', color: col1 },
              { offset: '100%', color: col2 }
            ]
          },
          stroke: col2,
          'stroke-width': 1
        }
      } else {
        return {
          fill: col1,
          stroke: col2,
          'stroke-width': 1
        }
      }
    };

    const umlClass = new joint.shapes.uml.Class({
      position: { x, y },
      size: { width: 200, height: 150 },
      name: [this.className],
      attributes: this.attributes,
      methods: this.methods,
      attrs: {
        '.uml-class-name-rect': umlDesignAttrs('#007bff', '#0056b3', true),
        '.uml-class-attrs-rect': umlDesignAttrs('#ECF0F1', '#BDC3C7'),
        '.uml-class-methods-rect': umlDesignAttrs('#ECF0F1', '#BDC3C7'),
        '.uml-class-name-text': { 'font-family': 'Roboto, Helvetica Neue, sans-serif', 'font-size': 14, 'font-weight': 'bold', fill: '#f4f4f4' },
        '.uml-class-attrs-text': { 'font-family': 'Roboto, Helvetica Neue, sans-serif', 'font-size': 12, fill: '#2C3E50' },
        '.uml-class-methods-text': { 'font-family': 'Roboto, Helvetica Neue, sans-serif', 'font-size': 12, fill: '#2C3E50' }
      }
    });

    this.graph.addCell(umlClass);

    // Clear input fields
    this.className = '';
    this.attributes = [];
    this.methods = [];
    this.lastAddedClass = umlClass;
  }

  connectClasses() {
    if (!this.selectedClass || !this.lastAddedClass) {
      alert('Please select a class and add another class to connect.');
      return;
    }

    const source = this.selectedClass;
    const target = this.graph.getCells().find(c => c !== source);

    if (target) {
      const link = new joint.shapes.standard.Link();
      link.source(source);
      link.target(target);
      this.graph.addCell(link);
    } else {
      alert('No other classes to connect to.');
    }
  }

  clearGraph() {
    this.graph.clear();
  }
}
