import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as joint from 'jointjs';
import * as links from './../../constants/Link';

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
      let link: joint.shapes.standard.Link = ConnectClassModalComponent.connectClasses(this.umlForm.value);

      this.dialogRef.close({ link });
    }
  }
  static connectClasses(values: { associationType: string, cardinality: string, reason?: string }): joint.shapes.standard.Link {
    let link: joint.shapes.standard.Link;
    const disableJunk = {
      '.marker-arrowheads': {
        display: 'none'
      },
      '.link-tools': {
        display: 'none'
      }
    }

    switch (values.associationType) {
      case 'Aggregation':
        link = new joint.shapes.uml.Aggregation({
          attrs: {
            '.marker-source': {
              d: 'M 30 0 L 15 -10 L 0 0 L 15 10 z',
              fill: '#FFFFFF',
              stroke: '#000000',
              strokeWidth: 2
            },
            '.marker-target': {
              d: ''
            },
            ...disableJunk
          }
        });
        break;
      case 'Composition':
        link = new joint.shapes.uml.Composition({
          attrs: {
            '.marker-source': {
              d: links.Aggregation.svgPath,
              fill: links.Aggregation.fill,
              stroke: '#000000',
              strokeWidth: 2
            },
            '.marker-target': {
              d: ''
            },
            ...disableJunk
          }
        });
        break;
      case 'Dependency':
        link = new joint.shapes.uml.Association({
          attrs: {
            '.connection': {
              'stroke-dasharray': '5,5'
            },
            '.marker-target': {
              d: links.Dependency.svgPath,
              fill: links.Dependency.fill,
              stroke: '#000000',
              'stroke-width': 2
            },
            ...disableJunk
          }
        });
        break;
      case 'Generalization/Inheritance':
        link = new joint.shapes.uml.Generalization({
          attrs: {
            '.marker-target': {
              d: links.GeneralizationInheritance.svgPath,
              fill: links.GeneralizationInheritance.fill,
              stroke: '#000000',
              'stroke-width': 2
            },
            ...disableJunk
          }
        });
        break;
      case 'Realization/Implementation':
        link = new joint.shapes.uml.Implementation({
          attrs: {
            '.connection': {
              'stroke-dasharray': '5,5'
            },
            '.marker-target': {
              d: links.RealizationImplementation.svgPath,
              fill: links.RealizationImplementation.fill,
              stroke: '#000000',
              'stroke-width': 2
            },
            ...disableJunk
          }
        });
        break;
      default:
        // Association
        link = new joint.shapes.uml.Association({
          attrs: {
            '.marker-target': {
              d: links.Association.svgPath,
              fill: links.Association.fill,
              stroke: '#000000',
              'stroke-width': 2
            },
            ...disableJunk
          }
        });
        break;
    }

    return link;
  }
}
