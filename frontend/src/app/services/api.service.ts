import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  endpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  /*
   * Uploads a file to the server
   */
  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.endpoint}/api/v1/upload`, formData);
  }

  /*
   * AI Generation API Functions
   */
  generateUMLToCode(artifactSrc: string, language: string, huggingFaceKey: string) {
    const prompt: string = `Take the UML diagram (attached as an image) and convert to ${language} code.`;

    return this.http.post(`${this.endpoint}/api/v1/generate`, {
      prompt,
      artifactSrc: `${this.endpoint}/${artifactSrc}`,
      purpose: "UML_TO_CODE"
    }, {
      headers: {
        Authorization: huggingFaceKey
      }
    });
  }

  generateUMLToJSON(artifactSrc: string, huggingFaceKey: string) {
    const prompt: string = 'Take this UML diagram (attached as an image) and convert to desired form.';

    return this.http.post(`${this.endpoint}/api/v1/generate`, {
      prompt,
      artifactSrc: `${this.endpoint}/${artifactSrc}`,
      purpose: "UML_TO_JSON",
    }, {
      headers: {
        Authorization: huggingFaceKey
      }
    });
  }

  generateCodeToJSON(language: string, huggingFaceKey: string) {
    const prompt: string = `Take this ${language} code and convert to desired form.`;

    return this.http.post(`${this.endpoint}/api/v1/generate`, {
      prompt,
      purpose: "CODE_TO_JSON",
    }, {
      headers: {
        Authorization: huggingFaceKey
      }
    });
  }

  /*
   * Acts as a proxy to the web to extract content from a URL
   */
  extractWebContent(url: string) {
    return this.http.get(`${this.endpoint}/api/v1/import`, {
      params: {
        targetUrl: url
      }
    });
  }
}
