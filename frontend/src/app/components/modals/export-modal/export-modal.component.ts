import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss']
})
export class ExportClassModalComponent implements OnInit {
  readonly programmingLanguages: string[] = Array.from(environment.programmingLanguages).sort();
  exportOption: string = '';
  selectedLanguage: string = '';
  huggingFaceKey: string = '';
  
  constructor(
    public dialogRef: MatDialogRef<ExportClassModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  ngOnInit(): void {}

  onOptionChange(): void {
    this.selectedLanguage = '';
    this.huggingFaceKey = '';
  };

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.exportOption === 'exp-code') {
      this.dialogRef.close({
        exportOption: this.exportOption,
        selectedLanguage: this.selectedLanguage,
        huggingFaceKey: this.huggingFaceKey
      });
    } else {
      this.dialogRef.close({
        exportOption: this.exportOption
      });
    }
  }
}
