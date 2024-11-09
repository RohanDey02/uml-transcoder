import { Component } from '@angular/core';
import { environment } from './environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'UML Transcoder';

  ngOnInit(): void {
    const letters: string[] = ['a', 'e', 'i', 'o', 'u'];
    for (let i = 0; i < letters.length; i++) {
      fetch(`https://api.github.com/search/repositories?q=${letters[i]}&sort=stars&order=desc`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(data => {
          const notPermitted: string[] = ['HTML', 'CSS', 'SCSS', 'Markdown', 'Shell', 'Dockerfile', 'MDX']
            const languages = new Set<string>(
            data.items
              .map((repo: any) => repo.language)
              .filter((language: string | null) => language && !notPermitted.includes(language))
            );

          environment.programmingLanguages = new Set([
            ...Array.from(environment.programmingLanguages),
            ...Array.from(languages)
          ]);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }
}
