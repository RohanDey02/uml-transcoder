import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as joint from 'jointjs';

@Component({
  selector: 'connect-class-modal',
  templateUrl: './connect-class-modal.component.html',
  styleUrls: ['./connect-class-modal.component.scss']
})
export class ConnectClassModalComponent implements OnInit {
  readonly associationTypes: string[] = ['Aggregation', 'Association', 'Composition', 'Dependency', 'Generalization/Inheritance', 'Realization/Implementation'];
  readonly cardinalities: string[] = ['0..1', '0..*', '1..1', '1..*', '*..*', '1..0', '*..0'];
  umlForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ConnectClassModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.umlForm = this.fb.group({
      associationType: ['', Validators.required],
      cardinality: ['', Validators.required],
      reason: ''
    });
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.umlForm.valid) {
      let link: joint.shapes.standard.Link = this.connectClasses();

      this.dialogRef.close({ link });
    }
  }
  connectClasses(): joint.shapes.standard.Link {
    let link: joint.shapes.standard.Link;
    switch (this.umlForm.value.associationType) {
      case 'Aggregation':
        link = new joint.shapes.standard.Link({
          attrs: {
            line: {
              stroke: '#000000',
              sourceMarker: {
                type: 'path',
                d: 'M 30 0 L 15 -10 L 0 0 L 15 10 z',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeWidth: 2
              },
              targetMarker: {
                type: 'path',
                d: ''
              }
            }
          }
        });
        break;
      case 'Composition':
        link = new joint.shapes.standard.Link({
          attrs: {
            line: {
              stroke: '#000000',
              sourceMarker: {
                type: 'path',
                d: 'M 30 0 L 15 -10 L 0 0 L 15 10 z',
                fill: '#000000',
                stroke: '#000000',
                strokeWidth: 2
              },
              targetMarker: {
                type: 'path',
                d: ''
              }
            }
          }
        });
        break;
      case 'Dependency':
        link = new joint.shapes.standard.Link({
          attrs: {
            line: {
              stroke: '#000000',
              'stroke-dasharray': '5,5',
              targetMarker: {
                'type': 'path',
                'd': 'M 0 0 20 10 0 0 20 -10',
                'fill': '#000000',
                'stroke': '#000000',
                'stroke-width': 2
              }
            }
          }
        });
        break;
      case 'Generalization/Inheritance':
        link = new joint.shapes.standard.Link({
          attrs: {
            line: {
              stroke: '#000000',
              targetMarker: {
                'type': 'path',
                'd': 'M 20 -10 0 0 20 10 z',
                'fill': '#FFFFFF',
                'stroke': '#000000',
                'stroke-width': 2
              }
            }
          }
        });
        break;
      case 'Realization/Implementation':
        link = new joint.shapes.standard.Link({
          attrs: {
            line: {
              stroke: '#000000',
              'stroke-dasharray': '5,5',
              targetMarker: {
                'type': 'path',
                'd': 'M 20 -10 0 0 20 10 z',
                'fill': '#FFFFFF',
                'stroke': '#000000',
                'stroke-width': 2
              }
            }
          }
        });
        break;
      default:
        // Association
        link = new joint.shapes.standard.Link({
          attrs: {
            line: {
              stroke: '#000000',
              targetMarker: {
                'type': 'path',
                'd': 'M 0 0 20 10 0 0 20 -10',
                'fill': '#000000',
                'stroke': '#000000',
                'stroke-width': 2
              }
            }
          }
        });
        break;
    }

    return link;
  }
}
