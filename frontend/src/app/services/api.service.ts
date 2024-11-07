import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  endpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.endpoint}/api/v1/upload`, formData);
  }

  generateUMLToCode(artifactSrc: string, language: string) {
    const prompt: string = `Take the UML diagram (attached as an image) and convert to ${language} code.`;

    return this.http.post(`${this.endpoint}/api/v1/generate`, {
      prompt,
      artifactSrc,
      purpose: "UML_TO_CODE"
    });
  }

  generateUMLToJSON(artifactSrc: string) {
    const prompt: string = 'Take this UML diagram (attached as an image) and convert to desired form.';

    return this.http.post(`${this.endpoint}/api/v1/generate`, {
      prompt,
      artifactSrc,
      purpose: "UML_TO_JSON",
    });
  }

  generateCodeToJSON(language: string) {
    const prompt: string = `Take this ${language} code and convert to desired form.`;

    return this.http.post(`${this.endpoint}/api/v1/generate`, {
      prompt,
      purpose: "CODE_TO_JSON",
    });
  }
}
