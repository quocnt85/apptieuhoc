export type DialogueCharacterId = 'bao' | 'bo';

export type DialogueCharacterSide = 'left' | 'right';

export interface DialogueCharacterDefinition {
  id: DialogueCharacterId;
  displayName: string;
  assetPath: string;
  side: DialogueCharacterSide;
  accentColor: string;
  personality: string;
}

export const DIALOGUE_CHARACTERS: Record<DialogueCharacterId, DialogueCharacterDefinition> = {
  bo: {
    id: 'bo',
    displayName: 'Bơ',
    assetPath: '/assets/dialogue/characters/bo.webp',
    side: 'left',
    accentColor: '#2dd4bf',
    personality: 'Quan sát tốt, đồng cảm, thích đặt câu hỏi và giúp cả đội diễn đạt suy nghĩ.',
  },
  bao: {
    id: 'bao',
    displayName: 'Bảo',
    assetPath: '/assets/dialogue/characters/bao.webp',
    side: 'right',
    accentColor: '#f59e0b',
    personality: 'Năng động, tò mò, thích hành động và sẵn sàng thừa nhận khi cần đổi chiến thuật.',
  },
};

export const isDialogueCharacterId = (value: string): value is DialogueCharacterId =>
  value === 'bao' || value === 'bo';

