import {
  AlertTriangle,
  Braces,
  Check,
  ChevronRight,
  CirclePlay,
  Code2,
  Download,
  FilePenLine,
  FolderTree,
  Import,
  PanelRightOpen,
  Play,
  RefreshCcw,
  RotateCcw,
  Save,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { Compiler, type Story } from 'inkjs/full';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import fireOpeningSource from '@/content/dialogue/fire-opening.ink?raw';
import {
  DIALOGUE_CHARACTERS,
  isDialogueCharacterId,
  type DialogueCharacterId,
} from '@/features/masteryJourney/dialogue/characterRegistry';
import {
  extractInkVariableNames,
  parseEditableDialogueLines,
  parseInkTags,
  updateEditableDialogueLine,
} from '@/features/masteryJourney/dialogue/inkTags';

type EditorTab = 'friendly' | 'ink';
type DiagnosticKind = 'error' | 'warning' | 'success';

interface Diagnostic {
  kind: DiagnosticKind;
  message: string;
}

interface PreviewFrame {
  text: string;
  tags: Record<string, string>;
}

interface PreviewChoice {
  index: number;
  text: string;
  choiceId?: string;
}

interface LocatedDialogueFrame {
  story: Story;
  frame: PreviewFrame;
  pathHistory: string[];
  persistentTags: Record<string, string>;
}

const DRAFT_KEY = 'novastars.dialogue-studio.fire-opening.draft.v1';

const EMOTION_OPTIONS = [
  'neutral',
  'concerned',
  'afraid',
  'surprised',
  'thinking',
  'curious',
  'happy',
  'serious',
  'encourage',
  'excited',
  'proud',
  'sad',
];

const SCENE_GROUPS = [
  {
    id: 'safety',
    label: 'Ngân hà An toàn',
    planets: [
      {
        id: 'fire',
        label: 'Thoát hiểm hỏa hoạn',
        scenes: [
          { id: 'fire.opening', label: '01 · Câu chuyện mở đầu', ready: true },
          { id: 'fire.reflection', label: '04 · Reflection', ready: false },
          { id: 'fire.real-life', label: '05 · Nhiệm vụ đời thực', ready: false },
        ],
      },
    ],
  },
  {
    id: 'communication',
    label: 'Ngân hà Giao tiếp',
    planets: [
      {
        id: 'communication-demo',
        label: 'Hành tinh mẫu số 2',
        scenes: [{ id: 'communication.opening', label: 'Sắp triển khai', ready: false }],
      },
    ],
  },
  {
    id: 'self-management',
    label: 'Ngân hà Tự quản',
    planets: [
      {
        id: 'self-management-demo',
        label: 'Hành tinh mẫu số 3',
        scenes: [{ id: 'self-management.opening', label: 'Sắp triển khai', ready: false }],
      },
    ],
  },
];

const getInitialSource = (): string => {
  try {
    return window.localStorage.getItem(DRAFT_KEY) ?? fireOpeningSource;
  } catch {
    return fireOpeningSource;
  }
};

const cleanInkMessage = (message: string): string =>
  message.replace(/^ERROR:\s*/i, '').replace(/^WARNING:\s*/i, '').trim();

const readNextFrame = (story: Story): PreviewFrame | null => {
  let safety = 0;
  while (story.canContinue && safety < 30) {
    const text = story.Continue()?.trim() ?? '';
    const tags = parseInkTags(story.currentTags);
    if (text) return { text, tags };
    safety += 1;
  }
  return null;
};

const readChoices = (story: Story): PreviewChoice[] =>
  story.currentChoices.map((choice, index) => ({
    index,
    text: choice.text.trim(),
    choiceId: parseInkTags(choice.tags).choice_id,
  }));

const speakerFromFrame = (frame: PreviewFrame | null): DialogueCharacterId | null => {
  const speaker = frame?.tags.speaker;
  return speaker && isDialogueCharacterId(speaker) ? speaker : null;
};

const formatVariable = (value: unknown): string => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value || '—';
  return String(value);
};

const compileStory = (source: string): Story => new Compiler(source).Compile();

// Replays possible choice paths until it reaches the requested stable line_id.
// This keeps editor-to-preview navigation data-driven as more Ink branches are added.
const locateDialogueFrame = (source: string, targetLineId: string): LocatedDialogueFrame | null => {
  const pendingPaths: number[][] = [[]];
  const visitedPaths = new Set<string>();

  while (pendingPaths.length > 0 && visitedPaths.size < 128) {
    const choicePath = pendingPaths.shift() ?? [];
    const pathKey = choicePath.join('.');
    if (visitedPaths.has(pathKey)) continue;
    visitedPaths.add(pathKey);

    const story = compileStory(source);
    const pathHistory: string[] = [];
    let choiceDepth = 0;
    let persistentTags: Record<string, string> = {};
    let safety = 0;

    while (safety < 500) {
      while (story.canContinue && safety < 500) {
        const rawFrame = readNextFrame(story);
        safety += 1;
        if (!rawFrame) break;
        const frame = {
          ...rawFrame,
          tags: { ...persistentTags, ...rawFrame.tags },
        };
        if (rawFrame.tags.background) persistentTags = { background: rawFrame.tags.background };
        if (rawFrame.tags.line_id === targetLineId) {
          return { story, frame, pathHistory, persistentTags };
        }
      }

      if (story.currentChoices.length === 0) break;
      if (choiceDepth < choicePath.length) {
        const choiceIndex = choicePath[choiceDepth];
        const choice = story.currentChoices[choiceIndex];
        if (!choice) break;
        pathHistory.push(choice.text.trim());
        story.ChooseChoiceIndex(choiceIndex);
        choiceDepth += 1;
        continue;
      }

      story.currentChoices.forEach((_, index) => pendingPaths.push([...choicePath, index]));
      break;
    }
  }

  return null;
};

const emotionClassName = (emotion?: string): string => {
  switch (emotion) {
    case 'surprised':
      return 'emotion-surprised';
    case 'afraid':
    case 'fearful':
    case 'scared':
      return 'emotion-afraid';
    case 'happy':
    case 'excited':
    case 'proud':
      return 'emotion-happy';
    case 'sad':
      return 'emotion-sad';
    case 'encourage':
    case 'encouraged':
      return 'emotion-encouraged';
    default:
      return 'emotion-neutral';
  }
};

export function DialogueStudio() {
  const [source, setSource] = useState(getInitialSource);
  const [editorTab, setEditorTab] = useState<EditorTab>('friendly');
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [frame, setFrame] = useState<PreviewFrame | null>(null);
  const [choices, setChoices] = useState<PreviewChoice[]>([]);
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [isPreviewFinished, setIsPreviewFinished] = useState(false);
  const storyRef = useRef<Story | null>(null);
  const persistentSceneTagsRef = useRef<Record<string, string>>({});
  const selectedLineIdRef = useRef<string | null>(null);
  const lineButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const importRef = useRef<HTMLInputElement | null>(null);

  const editableLines = useMemo(() => parseEditableDialogueLines(source), [source]);
  const variableNames = useMemo(() => extractInkVariableNames(source), [source]);
  const visibleLines = useMemo(() => {
    const query = filter.trim().toLocaleLowerCase('vi');
    if (!query) return editableLines;
    return editableLines.filter(
      (line) =>
        line.text.toLocaleLowerCase('vi').includes(query) ||
        line.lineId.toLocaleLowerCase('vi').includes(query),
    );
  }, [editableLines, filter]);

  const syncVariables = useCallback(
    (story: Story) => {
      const nextValues: Record<string, string> = {};
      for (const name of variableNames) {
        nextValues[name] = formatVariable(story.variablesState.$(name));
      }
      setVariableValues(nextValues);
    },
    [variableNames],
  );

  const syncPreview = useCallback(
    (story: Story, resetHistory = false) => {
      if (resetHistory) persistentSceneTagsRef.current = {};
      const rawFrame = readNextFrame(story);
      const nextFrame = rawFrame
        ? {
            ...rawFrame,
            tags: { ...persistentSceneTagsRef.current, ...rawFrame.tags },
          }
        : null;
      if (rawFrame?.tags.background) {
        persistentSceneTagsRef.current = { background: rawFrame.tags.background };
      }
      setFrame(nextFrame);
      setChoices(readChoices(story));
      setIsPreviewFinished(!nextFrame && !story.canContinue && story.currentChoices.length === 0);
      if (nextFrame?.tags.line_id) {
        selectedLineIdRef.current = nextFrame.tags.line_id;
        setSelectedLineId(nextFrame.tags.line_id);
      }
      syncVariables(story);
      if (resetHistory) setPathHistory([]);
    },
    [syncVariables],
  );

  const compileAndRestart = useCallback(
    (inkSource: string, quiet = false, targetLineId?: string | null) => {
      try {
        const compiler = new Compiler(inkSource);
        const story = compiler.Compile();
        const compilerDiagnostics: Diagnostic[] = [
          ...compiler.errors.map((message) => ({
            kind: 'error' as const,
            message: cleanInkMessage(message),
          })),
          ...compiler.warnings.map((message) => ({
            kind: 'warning' as const,
            message: cleanInkMessage(message),
          })),
        ];

        if (compilerDiagnostics.some((item) => item.kind === 'error')) {
          storyRef.current = null;
          setFrame(null);
          setChoices([]);
          setDiagnostics(compilerDiagnostics);
          return;
        }

        const locatedFrame = targetLineId ? locateDialogueFrame(inkSource, targetLineId) : null;
        const previewStory = locatedFrame?.story ?? story;
        storyRef.current = previewStory;
        setDiagnostics(
          compilerDiagnostics.length > 0
            ? compilerDiagnostics
            : [{ kind: 'success', message: quiet ? 'Preview đã được đồng bộ.' : 'Ink hợp lệ. Preview đã khởi động lại.' }],
        );
        if (locatedFrame) {
          persistentSceneTagsRef.current = locatedFrame.persistentTags;
          setFrame(locatedFrame.frame);
          setChoices(readChoices(previewStory));
          setPathHistory(locatedFrame.pathHistory);
          setIsPreviewFinished(false);
          selectedLineIdRef.current = targetLineId ?? null;
          setSelectedLineId(targetLineId ?? null);
          syncVariables(previewStory);
        } else {
          syncPreview(previewStory, true);
        }
      } catch (error) {
        storyRef.current = null;
        setFrame(null);
        setChoices([]);
        setIsPreviewFinished(false);
        setDiagnostics([
          {
            kind: 'error',
            message: error instanceof Error ? cleanInkMessage(error.message) : 'Không thể biên dịch nội dung Ink.',
          },
        ]);
      }
    },
    [syncPreview, syncVariables],
  );

  useEffect(() => {
    const timer = window.setTimeout(
      () => compileAndRestart(source, true, selectedLineIdRef.current),
      500,
    );
    return () => window.clearTimeout(timer);
  }, [compileAndRestart, source]);

  useEffect(() => {
    if (!selectedLineId && editableLines.length > 0) {
      selectedLineIdRef.current = editableLines[0].lineId;
      setSelectedLineId(editableLines[0].lineId);
    }
  }, [editableLines, selectedLineId]);

  useEffect(() => {
    if (!selectedLineId || editorTab !== 'friendly') return;
    lineButtonRefs.current.get(selectedLineId)?.scrollIntoView({ block: 'nearest' });
  }, [editorTab, selectedLineId]);

  const handleContinue = () => {
    const story = storyRef.current;
    if (!story || choices.length > 0) return;
    syncPreview(story);
  };

  const handleChoice = (choice: PreviewChoice) => {
    const story = storyRef.current;
    if (!story) return;
    story.ChooseChoiceIndex(choice.index);
    setPathHistory((current) => [...current, choice.text]);
    syncPreview(story);
  };

  const handleSelectLine = (lineId: string) => {
    selectedLineIdRef.current = lineId;
    setSelectedLineId(lineId);
    try {
      const locatedFrame = locateDialogueFrame(source, lineId);
      if (!locatedFrame) return;
      storyRef.current = locatedFrame.story;
      persistentSceneTagsRef.current = locatedFrame.persistentTags;
      setFrame(locatedFrame.frame);
      setChoices(readChoices(locatedFrame.story));
      setPathHistory(locatedFrame.pathHistory);
      setIsPreviewFinished(false);
      syncVariables(locatedFrame.story);
    } catch {
      // Compiler diagnostics remain the source of truth while the author is typing invalid Ink.
    }
  };

  const handleLineChange = (
    lineId: string,
    changes: Parameters<typeof updateEditableDialogueLine>[2],
  ) => {
    setSource((current) => updateEditableDialogueLine(current, lineId, changes));
  };

  const saveDraft = () => {
    try {
      window.localStorage.setItem(DRAFT_KEY, source);
      setSavedAt(new Date());
      setDiagnostics([{ kind: 'success', message: 'Đã lưu bản nháp trên thiết bị này.' }]);
    } catch {
      setDiagnostics([{ kind: 'error', message: 'Trình duyệt không cho phép lưu bản nháp cục bộ.' }]);
    }
  };

  const resetSource = () => {
    if (!window.confirm('Khôi phục nội dung Ink gốc? Bản đang sửa trong màn hình sẽ bị thay thế.')) return;
    setSource(fireOpeningSource);
    setSelectedLineId(null);
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      // The source can still be reset when local storage is unavailable.
    }
    setSavedAt(null);
  };

  const exportInk = () => {
    const blob = new Blob([source], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fire-opening.ink';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importInk = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const importedSource = await file.text();
      setSource(importedSource);
      setEditorTab('ink');
      setSelectedLineId(null);
    } catch {
      setDiagnostics([{ kind: 'error', message: 'Không thể đọc file Ink vừa chọn.' }]);
    }
  };

  const activeSpeaker = speakerFromFrame(frame);
  const selectedLine = editableLines.find((line) => line.lineId === selectedLineId) ?? null;
  const backgroundClass = frame?.tags.background ? `scene-${frame.tags.background}` : 'scene-smoke_station';

  return (
    <main className="dialogue-studio-shell">
      <header className="studio-header">
        <div className="studio-brand">
          <div className="brand-mark"><Sparkles size={20} /></div>
          <div>
            <p className="eyebrow">NovaStars Creator Tool</p>
            <h1>Dialogue Studio</h1>
          </div>
          <span className="version-pill">v0</span>
        </div>

        <div className="header-actions">
          <button className="button button-ghost" type="button" onClick={() => importRef.current?.click()}>
            <Import size={17} /> Nhập .ink
          </button>
          <button className="button button-ghost" type="button" onClick={exportInk}>
            <Download size={17} /> Xuất .ink
          </button>
          <button className="button button-ghost" type="button" onClick={resetSource}>
            <RotateCcw size={17} /> Khôi phục
          </button>
          <button className="button button-primary" type="button" onClick={saveDraft}>
            <Save size={17} /> Lưu bản nháp
          </button>
          <input ref={importRef} className="visually-hidden" type="file" accept=".ink,text/plain" onChange={importInk} />
        </div>
      </header>

      <section className="studio-workspace">
        <aside className="scene-panel panel">
          <div className="panel-heading">
            <FolderTree size={18} />
            <div>
              <p className="eyebrow">Nội dung</p>
              <h2>Cây phân cảnh</h2>
            </div>
          </div>
          <nav aria-label="Danh sách phân cảnh" className="scene-tree">
            {SCENE_GROUPS.map((group) => (
              <div className="tree-group" key={group.id}>
                <p className="tree-galaxy">{group.label}</p>
                {group.planets.map((planet) => (
                  <div key={planet.id}>
                    <p className="tree-planet"><span>◉</span>{planet.label}</p>
                    <div className="tree-scenes">
                      {planet.scenes.map((scene) => (
                        <button
                          className={`tree-scene ${scene.id === 'fire.opening' ? 'is-active' : ''}`}
                          disabled={!scene.ready}
                          key={scene.id}
                          type="button"
                        >
                          <span>{scene.label}</span>
                          {scene.ready ? <ChevronRight size={15} /> : <span className="soon-pill">Sau</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </nav>

          <div className="character-notes">
            <p className="eyebrow">Nhân vật chính</p>
            {(Object.keys(DIALOGUE_CHARACTERS) as DialogueCharacterId[]).map((id) => {
              const character = DIALOGUE_CHARACTERS[id];
              return (
                <div className="character-note" key={character.id}>
                  <span className="character-dot" style={{ background: character.accentColor }} />
                  <div><strong>{character.displayName}</strong><p>{character.side === 'left' ? 'Bên trái' : 'Bên phải'}</p></div>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="editor-panel panel">
          <div className="editor-toolbar">
            <div>
              <p className="eyebrow">Thoát hiểm hỏa hoạn</p>
              <h2>Câu chuyện mở đầu</h2>
            </div>
            <div className="compile-state">
              {diagnostics.some((item) => item.kind === 'error') ? (
                <><AlertTriangle size={15} /> Cần sửa Ink</>
              ) : (
                <><Check size={15} /> Sẵn sàng chạy</>
              )}
            </div>
          </div>

          <div className="tab-list" role="tablist" aria-label="Chế độ biên tập">
            <button
              className={editorTab === 'friendly' ? 'is-active' : ''}
              type="button"
              role="tab"
              aria-selected={editorTab === 'friendly'}
              onClick={() => setEditorTab('friendly')}
            >
              <FilePenLine size={16} /> Biên tập thân thiện
            </button>
            <button
              className={editorTab === 'ink' ? 'is-active' : ''}
              type="button"
              role="tab"
              aria-selected={editorTab === 'ink'}
              onClick={() => setEditorTab('ink')}
            >
              <Code2 size={16} /> Mã Ink
            </button>
          </div>

          {editorTab === 'friendly' ? (
            <div className="friendly-editor">
              <label className="search-field">
                <span>Tìm câu thoại</span>
                <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Nội dung hoặc line_id…" />
              </label>
              <div className="line-layout">
                <div className="line-list" aria-label="Danh sách câu thoại">
                  {visibleLines.map((line, index) => (
                    <button
                      className={`line-card ${selectedLineId === line.lineId ? 'is-active' : ''}`}
                      data-line-id={line.lineId}
                      key={line.lineId}
                      ref={(element) => {
                        if (element) lineButtonRefs.current.set(line.lineId, element);
                        else lineButtonRefs.current.delete(line.lineId);
                      }}
                      type="button"
                      aria-current={selectedLineId === line.lineId ? 'true' : undefined}
                      onClick={() => handleSelectLine(line.lineId)}
                    >
                      <span className="line-number">{String(index + 1).padStart(2, '0')}</span>
                      <span className="line-summary">
                        <strong>{isDialogueCharacterId(line.speaker) ? DIALOGUE_CHARACTERS[line.speaker].displayName : line.speaker}</strong>
                        <span>{line.text}</span>
                      </span>
                    </button>
                  ))}
                  {visibleLines.length === 0 && <p className="empty-note">Không tìm thấy câu thoại phù hợp.</p>}
                </div>

                <div className="line-inspector">
                  {selectedLine ? (
                    <>
                      <div className="inspector-title">
                        <WandSparkles size={17} />
                        <div><p className="eyebrow">Câu đang chọn</p><h3>{selectedLine.lineId}</h3></div>
                      </div>
                      <label>
                        <span>Nhân vật nói</span>
                        <select
                          value={selectedLine.speaker}
                          onChange={(event) => handleLineChange(selectedLine.lineId, { speaker: event.target.value })}
                        >
                          <option value="bo">Bơ</option>
                          <option value="bao">Bảo</option>
                          <option value="narrator">Người dẫn chuyện</option>
                        </select>
                      </label>
                      <label>
                        <span>Cảm xúc</span>
                        <select
                          value={selectedLine.emotion}
                          onChange={(event) => handleLineChange(selectedLine.lineId, { emotion: event.target.value })}
                        >
                          {EMOTION_OPTIONS.map((emotion) => <option key={emotion} value={emotion}>{emotion}</option>)}
                        </select>
                      </label>
                      <label className="dialogue-copy-field">
                        <span>Nội dung thoại</span>
                        <textarea
                          value={selectedLine.text}
                          rows={6}
                          onChange={(event) => handleLineChange(selectedLine.lineId, { text: event.target.value })}
                        />
                      </label>
                      <p className="helper-text">Nhánh lựa chọn và logic biến được chỉnh trong tab Mã Ink ở phiên bản v0.</p>
                    </>
                  ) : (
                    <div className="empty-inspector"><FilePenLine size={28} /><p>Chọn một câu thoại để bắt đầu sửa.</p></div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="ink-editor">
              <div className="ink-editor-meta"><Braces size={15} /> {source.split(/\r?\n/).length} dòng · {editableLines.length} câu thoại</div>
              <textarea
                aria-label="Mã nguồn Ink"
                spellCheck={false}
                value={source}
                onChange={(event) => setSource(event.target.value)}
              />
            </div>
          )}

          <section className="diagnostics" aria-label="Chẩn đoán Ink">
            <div className="diagnostics-heading">
              <span>Chẩn đoán</span>
              <button type="button" onClick={() => compileAndRestart(source)}><RefreshCcw size={14} /> Biên dịch lại</button>
            </div>
            <div className="diagnostic-list">
              {diagnostics.map((item, index) => (
                <p className={`diagnostic diagnostic-${item.kind}`} key={`${item.kind}-${index}`}>
                  {item.kind === 'success' ? <Check size={14} /> : <AlertTriangle size={14} />}
                  {item.message}
                </p>
              ))}
            </div>
            {savedAt && <p className="saved-time">Bản nháp lưu lúc {savedAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>}
          </section>
        </section>

        <aside className="preview-panel panel">
          <div className="preview-heading">
            <div className="panel-heading compact">
              <PanelRightOpen size={18} />
              <div><p className="eyebrow">Live preview</p><h2>Graphic novel</h2></div>
            </div>
            <button className="icon-button" aria-label="Khởi động lại preview" title="Khởi động lại" type="button" onClick={() => compileAndRestart(source)}>
              <RefreshCcw size={17} />
            </button>
          </div>

          <div className={`novel-stage ${backgroundClass}`}>
            <div className="stars-layer" />
            <div className="station-orbit" />
            {(Object.keys(DIALOGUE_CHARACTERS) as DialogueCharacterId[]).map((id) => {
              const character = DIALOGUE_CHARACTERS[id];
              const isActive = activeSpeaker === character.id;
              const activeEmotion = isActive ? frame?.tags.emotion : undefined;
              return (
                <div
                  className={`novel-character character-${character.side} ${isActive ? 'is-speaking' : ''} ${emotionClassName(activeEmotion)}`}
                  key={`${character.id}-${isActive ? frame?.tags.line_id ?? activeEmotion : 'idle'}`}
                >
                  <span className="character-name" style={{ '--character-color': character.accentColor } as React.CSSProperties}>
                    {character.displayName}
                  </span>
                  <div className="character-portrait-crop">
                    <img src={character.assetPath} alt={`${character.displayName} đứng bên ${character.side === 'left' ? 'trái' : 'phải'}`} />
                  </div>
                </div>
              );
            })}

            <div className="novel-dialogue">
              {frame ? (
                <>
                  <div className="dialogue-meta">
                    <strong style={{ color: activeSpeaker ? DIALOGUE_CHARACTERS[activeSpeaker].accentColor : undefined }}>
                      {activeSpeaker ? DIALOGUE_CHARACTERS[activeSpeaker].displayName : 'Người dẫn chuyện'}
                    </strong>
                  </div>
                  <p>{frame.text}</p>
                  {choices.length === 0 && !isPreviewFinished && (
                    <button className="continue-button" type="button" onClick={handleContinue}>
                      Tiếp tục <ChevronRight size={17} />
                    </button>
                  )}
                </>
              ) : diagnostics.some((item) => item.kind === 'error') ? (
                <div className="preview-message"><AlertTriangle size={24} /><p>Hãy sửa lỗi Ink để chạy preview.</p></div>
              ) : isPreviewFinished ? (
                <div className="preview-message"><Check size={24} /><p>Đã xem hết phân cảnh.</p><button type="button" onClick={() => compileAndRestart(source)}>Xem lại</button></div>
              ) : (
                <div className="preview-message"><CirclePlay size={24} /><p>Đang chuẩn bị phân cảnh…</p></div>
              )}
            </div>
          </div>

          {choices.length > 0 && (
            <div className="preview-choices">
              <p><Play size={14} /> Chọn phản hồi của người chơi</p>
              {choices.map((choice) => (
                <button key={choice.choiceId ?? choice.index} type="button" onClick={() => handleChoice(choice)}>
                  <span>{choice.text}</span><ChevronRight size={17} />
                </button>
              ))}
            </div>
          )}

          <div className="preview-data">
            <div>
              <p className="eyebrow">Biến Ink</p>
              <div className="data-chips">
                {variableNames.map((name) => <span key={name}><strong>{name}</strong> {variableValues[name] ?? '—'}</span>)}
              </div>
            </div>
            <div>
              <p className="eyebrow">Lịch sử lựa chọn</p>
              {pathHistory.length > 0 ? (
                <ol className="path-history">{pathHistory.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}</ol>
              ) : (
                <p className="empty-data">Chưa có lựa chọn nào.</p>
              )}
            </div>
            {frame?.tags.command && <div className="command-chip">Lệnh game: <strong>{frame.tags.command}</strong></div>}
          </div>
        </aside>
      </section>
    </main>
  );
}
