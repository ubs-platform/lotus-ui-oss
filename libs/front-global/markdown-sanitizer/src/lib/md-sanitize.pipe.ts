import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mdSanitize',
    standalone: false
})
export class MdSanitizePipe implements PipeTransform {
  transform(markdown: string): string {
    let noToken = /(^[\\\/].*)|([\*\#\_\~\?].)/gm;
    let regexNoLink = /([\[](.*)[\]]|[\(](.*)[\)])/gm;
    markdown = markdown.replace(noToken, '');
    markdown = markdown.replace(regexNoLink, '');
    markdown = markdown.startsWith('!') ? markdown.substring(1) : markdown;
    return markdown;
  }
}
