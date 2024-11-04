import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import * as joint from 'jointjs';
import { isPlatformBrowser } from '@angular/common';
import { InputModalComponent } from '../input-modal/input-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

const shapeNamespace = { ...joint.shapes };

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private dialog: MatDialog) {}

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
    console.log('UML Diagram component initialized.');
    if (isPlatformBrowser(this.platformId)) {
      this.paper = new joint.dia.Paper({
        el: document.getElementById('paper'),
        model: this.graph,
        width: window.innerWidth - 35,
        height: window.innerHeight - 160,
        background: {
            color: '#F8F9FA',
        },
        async: true,
        sorting: joint.dia.Paper.sorting.APPROX,
        cellViewNamespace: joint.shapes
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
    if (!this.className) {
      alert('Please enter a class name.');
      return;
    }

    const x = Math.random() * (window.innerWidth - 135);
    const y = Math.random() * (window.innerHeight - 260);

    const umlClass = new joint.shapes.uml.Class({
      position: { x, y },
      size: { width: 200, height: 200 },
      name: [this.className],
      attributes: this.attributes,
      methods: this.methods
    });
    
    this.graph.addCell(umlClass);
    this.className = ''; // Clear input field
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
}
