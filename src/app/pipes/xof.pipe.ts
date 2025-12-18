import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'xof',
  standalone: false
})
export class XofPipe implements PipeTransform {

  transform(value: any): string {
    if (value === null || value === undefined) return '0 F CFA';

    // Convertir en nombre
    const num = Number(value);

    // Formater avec des milliers
    const formatted = num.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return `${formatted} F CFA`;
  }

}


