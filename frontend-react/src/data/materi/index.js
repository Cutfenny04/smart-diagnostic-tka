import { modul01 } from './modul01';
import { modul02 } from './modul02';
import { modul03 } from './modul03';
import { modul04 } from './modul04';
import { modul05 } from './modul05';

export const officialModules = [modul01, modul02, modul03, modul04, modul05];

export function getModuleContentById(id) {
  const numericId = Number(id);
  return officialModules.find((m) => m.id === numericId) || null;
}

export function getNextModule(currentId) {
  const numericId = Number(currentId);
  const next = officialModules.find((m) => m.id === numericId + 1);
  return next || null;
}

export function getPreviousModule(currentId) {
  const numericId = Number(currentId);
  const prev = officialModules.find((m) => m.id === numericId - 1);
  return prev || null;
}
