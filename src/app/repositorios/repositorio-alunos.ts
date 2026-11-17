import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Aluno } from '../modelos/aluno';

/** Alunos ficam em `turmas/{turmaId}/alunos`. Remover só marca `ativo: false`, para manter o histórico de presenças. */
@Injectable({ providedIn: 'root' })
export class RepositorioAlunos {
  private firestore = inject(Firestore);

  private colecao(turmaId: string) {
    return collection(this.firestore, 'turmas', turmaId, 'alunos');
  }

  observarAtivos(turmaId: string): Observable<Aluno[]> {
    const consulta = query(this.colecao(turmaId), where('ativo', '==', true));
    return collectionData(consulta, { idField: 'id' }).pipe(
      map((documentos) =>
        documentos
          .map((d) => ({ id: d['id'] as string, nome: d['nome'] as string }))
          .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
      ),
    );
  }

  adicionar(turmaId: string, nome: string): Promise<unknown> {
    return addDoc(this.colecao(turmaId), { nome, ativo: true, criadoEm: serverTimestamp() });
  }

  renomear(turmaId: string, id: string, nome: string): Promise<void> {
    return updateDoc(doc(this.colecao(turmaId), id), { nome });
  }

  remover(turmaId: string, id: string): Promise<void> {
    return updateDoc(doc(this.colecao(turmaId), id), { ativo: false });
  }
}
