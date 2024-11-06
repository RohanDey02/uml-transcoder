import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import * as joint from 'jointjs';
import { isPlatformBrowser } from '@angular/common';
import { AddClassModalComponent } from '../modals/add-class-modal/add-class-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ImportClassModalComponent } from '../modals/import-modal/import-modal.component';
import { ExportClassModalComponent } from '../modals/export-modal/export-modal.component';
import * as fflate from 'fflate';

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
    const dialogRef = this.dialog.open(AddClassModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      const { className, attributes, methods } = result;
      this.className = className;
      this.attributes = attributes.map((a: any) => `${a.level} ${a.name}`);
      this.methods = methods.map((m: any) => `${m.level} ${m.name}`);
      this.addClass();
    });
  }

  openImportDialog() {
    const dialogRef = this.dialog.open(ImportClassModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      const { importOption, uploadedFile, selectedLanguage } = result;

      if (importOption === 'imp-rohanuml') {
        uploadedFile.text().then((text: string) => {
          this.importFromRohanUML(text);
        });
      } else if (importOption === 'imp-uml') {
        alert('Importing from UML is not yet supported.');
        // TODO: Call endpoint with the URL
      } else {
        alert('Importing from code is not yet supported.');
        // TODO: Call endpoint with the URL
      }
    });
  }

  openExportDialog() {
    const dialogRef = this.dialog.open(ExportClassModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      const { exportOption, selectedLanguage } = result;

      if (exportOption === 'exp-code') {
        alert('Exporting to code is not yet supported.');
      } else if (exportOption == 'exp-image') {
        this.exportToImage();
      } else {
        // alert('Exporting to RohanUML is not yet supported.');
        this.exportToRohanUML();
      }
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

  exportToImage() {
    const svgString = new XMLSerializer().serializeToString(this.paper.svg);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image(window.innerWidth - 50, window.innerHeight - 140);

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context?.drawImage(image, 0, 0);

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'uml-diagram.png';
      a.click();
    };

    image.src = 'data:image/svg+xml;base64,' + btoa(decodeURIComponent(encodeURIComponent(svgString)));
  }

  exportToRohanUML() {
    const graphData = this.graph.toJSON().cells.map((cell: joint.shapes.uml.ClassAttributes) => {
      return {
        name: cell.name[0],
        attributes: cell.attributes,
        methods: cell.methods
      };
    });

    const compressed = fflate.gzipSync(fflate.strToU8(JSON.stringify(graphData, null, 2)), { level: 9 });
    // Create a hidden anchor element
    const link = document.createElement('a');

    // Set file content as a data URL
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(fflate.strFromU8(compressed, true));
    
    // Set the download attribute with the desired file name
    link.download = 'uml-diagram.rohanuml';

    // Append the link to the document, trigger click, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  importFromRohanUML(text: string) {
    const decompressed = fflate.gunzipSync(fflate.strToU8(text, true));
    const graphData = JSON.parse(new TextDecoder().decode(decompressed));

    for (const cell of Array.from(graphData) as { name: string; attributes: string[]; methods: string[] }[]) {
      this.className = cell.name;
      this.attributes = cell.attributes;
      this.methods = cell.methods;
      this.addClass();
    };
  }
}
