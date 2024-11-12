import { Component, Inject, OnInit, PLATFORM_ID, HostListener } from '@angular/core';
import * as joint from 'jointjs';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddClassModalComponent } from '../../components/modals/add-class-modal/add-class-modal.component';
import { ConnectClassModalComponent } from '../../components/modals/connect-class-modal/connect-class-modal.component';
import { ExportClassModalComponent } from '../../components/modals/export-modal/export-modal.component';
import { ImportClassModalComponent } from '../../components/modals/import-modal/import-modal.component';
import { ApiService } from '../../services/api.service';
import * as fflate from 'fflate';

@Component({
  selector: 'app-uml-diagram',
  templateUrl: './uml-diagram.component.html',
  styleUrls: ['./uml-diagram.component.scss'],
})
export class UmlDiagramComponent implements OnInit {
  private graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });
  private paper!: joint.dia.Paper;
  selectedClasses: joint.shapes.uml.Class[] = [];

  className: string = '';
  attributes: string[] = [];
  methods: string[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private dialog: MatDialog, private api: ApiService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.paper = new joint.dia.Paper({
        el: document.getElementById('paper'),
        model: this.graph,
        async: true,
        width: window.innerWidth - 35,
        height: window.innerHeight - 155
      });

      this.paper.on('element:pointerdown', (elementView, evt) => {
        if (!(evt.target instanceof HTMLInputElement && evt.target.type === 'checkbox')) {
          this.selectedClasses.forEach(c => {
            const checkbox = document.getElementById(`checkbox-${c.id}`) as HTMLInputElement;
            if (checkbox) {
              checkbox.checked = false;
            }
          });
          this.selectedClasses = [];
        }
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.paper.setDimensions(window.innerWidth - 35, window.innerHeight - 155);
  }

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

  openConnectClassDialog() {
    const dialogRef = this.dialog.open(ConnectClassModalComponent, {
      data: {
        selectedClasses: this.selectedClasses.map((c: any) => c.attributes.name[0])
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      const { link } = result;

      const source = this.selectedClasses[0];
      const target = this.selectedClasses[1];

      link.source(source);
      link.target(target);
      this.graph.addCell(link);
    });
  }

  openImportDialog() {
    const dialogRef = this.dialog.open(ImportClassModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      const { importOption, uploadedFile, selectedLanguage, huggingFaceKey } = result;

      if (importOption === 'imp-rohanuml') {
        uploadedFile.text().then((text: string) => {
          this.importFromRohanUML(text);
        });
      } else if (importOption === 'imp-uml') {
        alert('Importing from UML is not yet supported.');
        // TODO: Call endpoint with the URL
      } else {
        uploadedFile.text().then((text: string) => {
          this.api.generateCodeToJSON(text, selectedLanguage, huggingFaceKey).subscribe({
            next: (response: any) => {
              this.insertGraphData(JSON.parse(response.result));
            },
            error: (err: Error) => {
              console.error(err);
            }
          });
        });
      }
    });
  }

  openExportDialog() {
    const dialogRef = this.dialog.open(ExportClassModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      const { exportOption, selectedLanguage, huggingFaceKey } = result;

      if (exportOption === 'exp-code') {
        // Hide checkboxes before exporting
        this.handleCheckboxState(true);

        this.formatAsFile().then(file => {
          this.api.uploadFile(file).subscribe({
            next: (response: any) => {
              this.api.generateUMLToCode(response.filename, selectedLanguage, huggingFaceKey).subscribe({
                next: (response: any) => {
                  console.log(response);
                },
                error: (err: Error) => {
                  console.error(err);
                }
              });
            },
            error: (err: Error) => {
              console.error(err);
            }
          });
        }).catch((err: Error) => {
          console.error(err);
        });

        // Show checkboxes after exporting
        this.handleCheckboxState(false);
      } else if (exportOption == 'exp-image') {
        // Hide checkboxes before exporting
        this.handleCheckboxState(true);

        this.exportToImage();

        // Show checkboxes after exporting
        this.handleCheckboxState(false);
      } else {
        this.exportToRohanUML();
      }
    });
  }

  addClass() {
    this.selectedClasses = [];

    const x = Math.random() * (window.innerWidth - 135);
    const y = Math.random() * (window.innerHeight - 255);

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
      size: { width: Math.max(200, this.className.length * 10, ...this.attributes.map(attr => attr.length * 7), ...this.methods.map(method => method.length * 7)), height: Math.max(150, (this.attributes.length + this.methods.length) * 20) },
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

    this.paper.on('render:done', () => {
      const elementView = this.paper.findViewByModel(umlClass);
      if (elementView) {
        // Create foreignObject with a checkbox
        const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        foreignObject.setAttribute('width', '20');
        foreignObject.setAttribute('height', '20');
        foreignObject.setAttribute('x', '5');
        foreignObject.setAttribute('y', '5');

        // Create a div to contain the checkbox
        const div = document.createElement('div');
        div.style.width = '20px';
        div.style.height = '20px';

        // Create and style the checkbox
        const checkbox = document.createElement('input');
        checkbox.id = `checkbox-${umlClass.id}`;
        checkbox.type = 'checkbox';
        checkbox.style.width = '16px';
        checkbox.style.height = '16px';

        // Add functionality to checkbox
        checkbox.addEventListener('change', () => {
          if (checkbox.checked && !this.selectedClasses.includes(umlClass)) {
            this.selectedClasses.push(umlClass);

            if (this.selectedClasses.length === 2) {
              this.openConnectClassDialog();
            }
          } else {
            const index = this.selectedClasses.indexOf(umlClass);
            if (index > -1) {
              this.selectedClasses.splice(index, 1);
            }
          }
        });

        // Append checkbox to div, div to foreignObject, and foreignObject to the elementView
        div.appendChild(checkbox);
        foreignObject.appendChild(div);
        elementView.vel.append(foreignObject);
      }
    });

    this.graph.addCell(umlClass);

    // Clear input fields
    this.className = '';
    this.attributes = [];
    this.methods = [];
  }

  handleCheckboxState(hide: boolean = false) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    if (hide) {
      checkboxes.forEach((checkbox) => {
        const inputElement = checkbox as HTMLInputElement; // Cast to HTMLInputElement
        inputElement.style.display = 'none';
      });
    } else {
      // Disable all checkboxes if there are 2 selected or total UML classes <= 1
      const disableCheckboxes = this.selectedClasses.length === 2 || this.graph.getCells().length <= 1;

      // Get all checkbox elements
      checkboxes.forEach((checkbox) => {
        const inputElement = checkbox as HTMLInputElement; // Cast to HTMLInputElement
        inputElement.style.display = 'block';

        // If checkbox is already checked (part of the selected classes), leave it enabled
        const isChecked = inputElement.checked;
        inputElement.disabled = disableCheckboxes && !isChecked;
      });
    }
  }

  clearGraph() {
    this.graph.clear();
  }

  formatAsFile(): Promise<File> {
    const svgString = new XMLSerializer().serializeToString(this.paper.svg);
    const svgBase64 = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;

    return new Promise<File>((resolve, reject) => {
      const image = new Image(window.innerWidth - 35, window.innerHeight - 155);
      image.src = svgBase64;

      image.onload = () => {
        const offscreenCanvas = new OffscreenCanvas(image.width, image.height);
        const context = offscreenCanvas.getContext('2d')!;

        context.drawImage(image, 0, 0);

        offscreenCanvas.convertToBlob({ type: 'image/png' }).then(blob => {
          const file = new File([blob], 'uml-diagram.png', { type: 'image/png' });
          resolve(file);
        }).catch(reject);
      };

      image.onerror = () => {
        reject(new Error("Failed to load the SVG for PNG conversion"));
      };
    });
  }

  exportToImage() {
    const svgString = new XMLSerializer().serializeToString(this.paper.svg);
    const svgBase64 = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;

    // Create a new image element and set its source to the base64 SVG
    const image = new Image(window.innerWidth - 35, window.innerHeight - 155);
    image.src = svgBase64;

    image.onload = () => {
      // Convert the image to a Blob using an offscreen canvas (hidden)
      const offscreenCanvas = new OffscreenCanvas(image.width, image.height);
      const context = offscreenCanvas.getContext('2d')!;

      // Draw the SVG image to the offscreen canvas
      context.drawImage(image, 0, 0);

      // Export to a Blob in PNG format
      offscreenCanvas.convertToBlob({ type: 'image/png' }).then(blob => {
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('download', 'image.png');
        a.setAttribute('href', pngUrl);
        a.click();
        URL.revokeObjectURL(pngUrl);
      });
    };

    image.onerror = () => {
      console.error("Failed to load the SVG for PNG conversion");
    };
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

    this.insertGraphData(graphData);
  }

  insertGraphData(graphData: { name: string; attributes: string[]; methods: string[], associations: { type: string, cardinality: string, reason: string, to: string }[] }[]) {
    for (const cell of Array.from(graphData)) {
      this.className = cell.name;
      this.attributes = cell.attributes;
      this.methods = cell.methods;
      this.addClass();
    };

    // Add associations (do it after because we need all the objects to exist first)
    for (const cell of Array.from(graphData)) {
      if (cell.associations && cell.associations.length > 0) {
        for (const association of cell.associations) {
          // Create a link between the two classes
          let link: joint.shapes.standard.Link = ConnectClassModalComponent.connectClasses({ ...association, associationType: association.type });

          // Get the source and target classes
          link.source(this.graph.getCells().find((c: any) => c.attributes.name[0] === cell.name)!);
          link.target(this.graph.getCells().find((c: any) => c.attributes.name[0] === association.to)!);
          this.graph.addCell(link);
        }
      }
    }
  }
}
