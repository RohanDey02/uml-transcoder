import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'edit-diagram-modal',
  templateUrl: './edit-diagram-modal.component.html',
  styleUrls: ['./edit-diagram-modal.component.scss']
})
export class EditDiagramModalComponent implements OnInit {
  readonly associationTypes: string[] = ['Aggregation', 'Association', 'Composition', 'Dependency', 'Generalization/Inheritance', 'Realization/Implementation'];
  readonly cardinalities: string[] = ['0..1', '0..*', '1..1', '1..*', '*..*', '1..0', '*..0'];
  umlForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditDiagramModalComponent>,
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
      this.dialogRef.close(this.umlForm.value);
    }
  }
}
