import { createHash } from 'node:crypto';

export interface EventIdentity {
  studyId: string;
  subjectId: string;
  source?: string;
  sourceRecordId?: string;
  term: string;
  onsetDate?: string;
}

export function normalize(value: string) {
  return value.trim().toLocaleLowerCase('en-US').replace(/\s+/g, ' ');
}

export function eventFingerprint(input: EventIdentity) {
  const study = normalize(input.studyId);
  const subject = normalize(input.subjectId);
  const sourceSystem = normalize(input.source ?? '') || 'unknown';
  const sourceRecord = normalize(input.sourceRecordId ?? '');
  const term = normalize(input.term);
  const onset = normalize(input.onsetDate ?? '') || 'unknown';
  const identity = sourceRecord
    ? [study, subject, sourceSystem, sourceRecord].join('|')
    : [study, subject, term, onset].join('|');
  return createHash('sha256').update(identity).digest('hex');
}
