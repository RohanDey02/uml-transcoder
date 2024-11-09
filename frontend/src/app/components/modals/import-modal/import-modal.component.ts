import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

// TODO: Only allow 1 file upload and update indicators for file upload

@Component({
  selector: 'import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.scss']
})
export class ImportClassModalComponent implements OnInit {
  readonly programmingLanguages: string[] = Array.from(environment.programmingLanguages).sort();
  importOption: string = '';
  uploadedFile: File | undefined;
  selectedLanguage: string = '';
  huggingFaceKey: string = '';
  
  constructor(
    public dialogRef: MatDialogRef<ImportClassModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  ngOnInit(): void {}

  onOptionChange(): void {
    this.uploadedFile = undefined;
    this.selectedLanguage = '';
    this.huggingFaceKey = '';
  };


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFile = input.files[0];
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.importOption === 'imp-uml') {
      this.dialogRef.close({
        importOption: this.importOption,
        uploadedFile: this.uploadedFile,
        huggingFaceKey: this.huggingFaceKey
      });
    }
    else if (this.importOption === 'imp-code') {
      this.dialogRef.close({
        importOption: this.importOption,
        uploadedFile: this.uploadedFile,
        selectedLanguage: this.selectedLanguage,
        huggingFaceKey: this.huggingFaceKey
      });
    } else {
      this.dialogRef.close({
        importOption: this.importOption,
        uploadedFile: this.uploadedFile
      });
    }
  }
}
