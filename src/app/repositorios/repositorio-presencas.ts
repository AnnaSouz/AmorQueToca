import { Injectable, inject } from '@angular/core';
import { Firestore, doc, writeBatch } from '@angular/fire/firestore';
import { Presenca } from '../modelos/presenca';

@Injectable({ providedIn: 'root' })
export class RepositorioPresencas {
  private firestore = inject(Firestore);

  gravarVarias(presencas: Presenca[]): Promise<void> {
    const lote = writeBatch(this.firestore);
    for (const presenca of presencas) {
      lote.set(doc(this.firestore, 'presencas', presenca.id), presenca);
    }
    return lote.commit();
  }
}