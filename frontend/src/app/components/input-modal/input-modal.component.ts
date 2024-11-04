import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss']
})
export class InputModalComponent implements OnInit {
  umlForm: FormGroup;
  umlLevels = ['+', '-', '#', '~'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InputModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.umlForm = this.fb.group({
      className: ['', Validators.required],
      attributes: this.fb.array([]),
      methods: this.fb.array([])
    });
  }

  ngOnInit(): void {}

  get attributes(): FormArray {
    return this.umlForm.get('attributes') as FormArray;
  }

  get methods(): FormArray {
    return this.umlForm.get('methods') as FormArray;
  }

  addAttribute(): void {
    const attributeGroup = this.fb.group({
      level: ['', Validators.required],
      name: ['', Validators.required]
    });
    this.attributes.push(attributeGroup);
  }
  
  addMethod(): void {
    const methodGroup = this.fb.group({
      level: ['', Validators.required],
      name: ['', Validators.required]
    });
    this.methods.push(methodGroup);
  }

  removeAttribute(index: number): void {
    this.attributes.removeAt(index);
  }
  
  removeMethod(index: number): void {
    this.methods.removeAt(index);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log(this.umlForm.get('methods'));
    console.log('Form submitted:', this.umlForm.value);
    if (this.umlForm.valid) {
      this.dialogRef.close(this.umlForm.value);
    }
  }
}
